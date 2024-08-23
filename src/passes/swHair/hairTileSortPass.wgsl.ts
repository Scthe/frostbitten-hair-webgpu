import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import { BUFFER_SEGMENT_COUNT_PER_TILE } from './shared/segmentCountPerTileBuffer.ts';
import { BUFFER_TILE_LIST } from './shared/tileListBuffer.ts';
import * as SHADER_SNIPPETS from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { SHADER_TILE_UTILS } from './shaderImpl/tileUtils.wgsl.ts';

export const SHADER_PARAMS = {
  workgroupSizeX: 64, // TODO
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


@compute
@workgroup_size(${c.workgroupSizeX}, 1, 1)
fn main(
  @builtin(global_invocation_id) global_id: vec3<u32>,
) {
  let tileIdx = global_id.x;
  let viewportSize: vec2f = _uniforms.viewport.xy;

  let tileCount2d = getTileCount(vec2u(viewportSize));
  let tileCount = tileCount2d.x * tileCount2d.y;
  if (tileIdx >= tileCount) { return; }

  let segmentCount = _hairSegmentCountPerTile[tileIdx];
  if (segmentCount > 0u) {
    _addTileToTaskQueue(tileIdx);
  }
}

`;
