import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import { BUFFER_SEGMENT_COUNT_PER_TILE } from './shared/segmentCountPerTileBuffer.ts';
import * as SHADER_SNIPPETS from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { SHADER_TILE_UTILS } from './shaderImpl/tileUtils.wgsl.ts';
import { u32_type } from '../../utils/webgpu.ts';
import { CONFIG } from '../../constants.ts';

export const SHADER_PARAMS = {
  workgroupSizeX: 256,
  bindings: {
    renderUniforms: 0,
    segmentCountPerTile: 1,
    sortBuckets: 2,
  },
};

///////////////////////////
/// SORT UTILS
///////////////////////////

export const SORT_BUCKETS_BUFFER = (
  bindingIdx: number,
  pass: 'count-tiles' | 'sort'
) => /* wgsl */ `

const SORT_BUCKETS = ${CONFIG.hairRender.sortBuckets}u;
const BUCKET_SIZE = ${CONFIG.hairRender.sortBucketSize}u;

fn calcTileSortBucket(segmentCount: u32) -> u32 {
  let key = segmentCount / BUCKET_SIZE;
  return clamp(key, 0u, SORT_BUCKETS - 1u);
}

struct SortBucket {
  // 1 pass: WRITE: inc for each tile that has segment count in this bucket
  // 2 pass: READ: to get offsets
  tileCount: ${u32_type(pass === 'count-tiles' ? 'read_write' : 'read')},
  // 1 pass: -
  // 2 pass: WRITE: in-bucket offsets
  writeOffset: ${u32_type(pass === 'count-tiles' ? 'read' : 'read_write')},
}

@group(0) @binding(${bindingIdx})
var<storage, read_write> _buckets: array<SortBucket>;
`;

///////////////////////////
/// SHADER CODE
///////////////////////////
const c = SHADER_PARAMS;
const b = SHADER_PARAMS.bindings;

export const SHADER_CODE = () => /* wgsl */ `

${SHADER_SNIPPETS.GENERIC_UTILS}
${SHADER_TILE_UTILS}
${SORT_BUCKETS_BUFFER(b.sortBuckets, 'count-tiles')}

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}
${BUFFER_SEGMENT_COUNT_PER_TILE(b.segmentCountPerTile, 'read')}


@compute
@workgroup_size(${c.workgroupSizeX}, 1, 1)
fn main(
  @builtin(global_invocation_id) global_id: vec3<u32>,
  @builtin(local_invocation_index) local_invocation_index: u32, // threadId inside workgroup
) {
  let tileIdx = global_id.x;
  let viewportSize: vec2f = _uniforms.viewport.xy;

  /*if (local_invocation_index == 0u) {
    for (var i = 0u; i < SORT_BUCKETS; i++) {
      atomicStore(_subResults[i], 0u);
    }
  }
  workgroupBarrier();*/

  let screenTileCount_2d = getTileCount(vec2u(viewportSize));
  let screenTileCount = screenTileCount_2d.x * screenTileCount_2d.y;
  let isValidTile = tileIdx < screenTileCount;

  let segmentCount = _hairSegmentCountPerTile[tileIdx];
  if (isValidTile && segmentCount > 0u) {
    let sortBucket = calcTileSortBucket(segmentCount);
    // atomicAdd(&_subResults[sortBucket], 1u);
    atomicAdd(&_buckets[sortBucket].tileCount, 1u);
  }
  /*workgroupBarrier();

  if (local_invocation_index == 0u) {
    for (var i = 0u; i < SORT_BUCKETS; i++) {
      let bucketValue = atomicLoad(_subResults[i]);
      _segmentsInBucket[i] = bucketValue;
    }
  }*/
}

`;
