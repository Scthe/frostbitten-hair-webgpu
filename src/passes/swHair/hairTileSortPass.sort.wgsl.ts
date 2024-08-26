import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import { BUFFER_SEGMENT_COUNT_PER_TILE } from './shared/segmentCountPerTileBuffer.ts';
import * as SHADER_SNIPPETS from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { SHADER_TILE_UTILS } from './shaderImpl/tileUtils.wgsl.ts';
import { SORT_BUCKETS_BUFFER } from './hairTileSortPass.countTiles.wgsl.ts';
import { BUFFER_TILE_LIST } from './shared/tileListBuffer.ts';

export const SHADER_PARAMS = {
  workgroupSizeX: 256,
  bindings: {
    renderUniforms: 0,
    segmentCountPerTile: 1,
    tileList: 2,
    sortBuckets: 3,
  },
};

///////////////////////////
/// SHADER CODE
///////////////////////////
const c = SHADER_PARAMS;
const b = SHADER_PARAMS.bindings;

export const SHADER_CODE = () => /* wgsl */ `

${SHADER_SNIPPETS.GENERIC_UTILS}
${SHADER_TILE_UTILS}

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}
${BUFFER_SEGMENT_COUNT_PER_TILE(b.segmentCountPerTile, 'read')}
${BUFFER_TILE_LIST(b.tileList, 'read_write')}
${SORT_BUCKETS_BUFFER(b.sortBuckets, 'sort')}


var<workgroup> _bucketOffsets: array<u32, SORT_BUCKETS>;

@compute
@workgroup_size(${c.workgroupSizeX}, 1, 1)
fn main(
  @builtin(global_invocation_id) global_id: vec3<u32>,
  @builtin(local_invocation_index) local_invocation_index: u32, // threadId inside workgroup
) {
  let tileIdx = global_id.x;
  let viewportSize: vec2f = _uniforms.viewport.xy;

  if (local_invocation_index == 0u) {
    calculateOffsetsForEachBucket();
  }
  workgroupBarrier();

  let screenTileCount_2d = getTileCount(vec2u(viewportSize));
  let screenTileCount = screenTileCount_2d.x * screenTileCount_2d.y;
  let isValidTile = tileIdx < screenTileCount;

  let segmentCount = _hairSegmentCountPerTile[tileIdx];
  if (isValidTile && segmentCount > 0u) {
    let sortBucket = calcTileSortBucket(segmentCount);
    let bucketOffset = _bucketOffsets[sortBucket];
    let inBucketOffset = atomicAdd(&_buckets[sortBucket].writeOffset, 1u);
    let offset = bucketOffset + inBucketOffset;
    _hairTileData.data[offset] = tileIdx;

    // add to tile counter
    atomicAdd(&_hairTileData.drawnTiles, 1u);
  }
}

fn calculateOffsetsForEachBucket() {
  var offset = 0u;
  for (var i = 0u; i < SORT_BUCKETS; i++) {
    let idx = SORT_BUCKETS - 1u - i; // reverse sort: heavier tiles first
    _bucketOffsets[idx] = offset;
    offset += _buckets[idx].tileCount;
  }
}

`;
