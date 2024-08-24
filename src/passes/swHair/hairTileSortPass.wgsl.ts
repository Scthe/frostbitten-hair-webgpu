import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import { BUFFER_SEGMENT_COUNT_PER_TILE } from './shared/segmentCountPerTileBuffer.ts';
import { BUFFER_TILE_LIST } from './shared/tileListBuffer.ts';
import * as SHADER_SNIPPETS from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { SHADER_TILE_UTILS } from './shaderImpl/tileUtils.wgsl.ts';

export const SHADER_PARAMS = {
  workgroupSizeX: 256,
  bindings: {
    renderUniforms: 0,
    segmentCountPerTile: 1,
    tileList: 2,
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

var<workgroup> _sortList: array<u32, ${c.workgroupSizeX}>;
var<workgroup> _tileCount: atomic<u32>;
var<workgroup> _tileCount2: u32; // cannot use workgroupUniformLoad() on atomic

@compute
@workgroup_size(${c.workgroupSizeX}, 1, 1)
fn main(
  @builtin(global_invocation_id) global_id: vec3<u32>,
  @builtin(local_invocation_index) local_invocation_index: u32, // threadId inside workgroup
) {
  let tileIdx = global_id.x;
  let viewportSize: vec2f = _uniforms.viewport.xy;

  if (local_invocation_index == 0u) {
    atomicStore(&_tileCount, 0u);
  }
  workgroupBarrier();

  let screenTileCount_2d = getTileCount(vec2u(viewportSize));
  let screenTileCount = screenTileCount_2d.x * screenTileCount_2d.y;
  let isValid = tileIdx < screenTileCount;

  let segmentCount = _hairSegmentCountPerTile[tileIdx];
  if (isValid && segmentCount > 0u) {
    let idx = atomicAdd(&_tileCount, 1u);

    // sort key maxes out at 255 segments per tile
    _sortList[idx] = (
      (min(segmentCount, 255u) << 24) |
      tileIdx
    );
  }
  workgroupBarrier();

  if (local_invocation_index == 0u) {
    _tileCount2 = atomicLoad(&_tileCount);
  }
  workgroupBarrier();

  // sorting
  // TBH pointless, since we write in rng order when using _addTileToTaskQueue()
  // TODO bucket-sort
  let drawnTilesCount = workgroupUniformLoad(&_tileCount2);
  sortLocalTiles(drawnTilesCount, local_invocation_index);
  workgroupBarrier();
    
  if (isValid && local_invocation_index < drawnTilesCount) {
    let tileIdx = _sortList[local_invocation_index] & 0x00ffffff;
    _addTileToTaskQueue(tileIdx);
  }
}

fn sortLocalTiles(arrLen: u32, threadId: u32) {
  // empty tile. No segments, no sorting.
  // Moved into for loop to prevent divergent warning
  // if (arrLen == 0u){ return; }

  for (
    var i = 0u;
    arrLen > 0u && i < arrLen - 1u;
    i += 1u
  ) {
    let isOdd = (i & 1) > 0;
    let offset = 2 * threadId + select(0u, 1u, isOdd);
    let threadLimit = arrLen / 2u - select(0u, 1u, isOdd);

    if ((offset + 1u) < arrLen && _sortList[offset] < _sortList[offset + 1u]) {
      swapElements(offset, offset + 1);
    }

    workgroupBarrier();
  }
}

fn swapElements(i: u32, j: u32) {
  let temp = _sortList[i];
  _sortList[i] = _sortList[j];
  _sortList[j] = temp;
}
`;
