import { BUFFER_HAIR_DATA } from '../../scene/hair/hairDataBuffer.ts';
import { BUFFER_HAIR_POINTS_POSITIONS } from '../../scene/hair/hairPointsPositionsBuffer.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import * as SHADER_SNIPPETS from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { CONFIG } from '../../constants.ts';
import { BUFFER_HAIR_SHADING } from '../../scene/hair/hairShadingBuffer.ts';
import { SNIPPET_SHADING_PBR_UTILS } from '../_shaderSnippets/pbr.wgsl.ts';

export const SHADER_PARAMS = {
  workgroupSizeX: 1, // TODO [LOW] adjust
  workgroupSizeY: CONFIG.hairRender.shadingPoints,
  bindings: {
    renderUniforms: 0,
    hairData: 1,
    hairPositions: 2,
    hairShading: 3,
  },
};

///////////////////////////
/// SHADER CODE
///////////////////////////
const c = SHADER_PARAMS;
const b = SHADER_PARAMS.bindings;

/**
 * # Marschner
 *
 * - [Marschner03] http://www.graphics.stanford.edu/papers/hair/hair-sg03final.pdf
 * - [Karis16] https://blog.selfshadow.com/publications/s2016-shading-course/karis/s2016_pbs_epic_hair.pdf
 * - [Chiang16] https://benedikt-bitterli.me/pchfm/pchfm.pdf
 * - [Tafuri19] https://advances.realtimerendering.com/s2019/hair_presentation_final.pdf
 * - [Sadeghi10] http://graphics.ucsd.edu/~henrik/papers/artist_hair.pdf
 *
 * Additional series of posts by Voicu Alexandru–Teodor:
 * - https://hairrendering.wordpress.com/2010/06/26/marschner-shader-part-i/
 * - https://hairrendering.wordpress.com/2010/06/27/marschner-shader-part-ii/
 * - https://hairrendering.wordpress.com/2010/07/05/marschner-shader-part-iii/
 *
 */
export const SHADER_CODE = () => /* wgsl */ `


${SHADER_SNIPPETS.GET_MVP_MAT}
${SHADER_SNIPPETS.GENERIC_UTILS}
${SNIPPET_SHADING_PBR_UTILS}

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}
${BUFFER_HAIR_DATA(b.hairData)}
${BUFFER_HAIR_POINTS_POSITIONS(b.hairPositions)}
${BUFFER_HAIR_SHADING(b.hairShading, 'read_write')}



@compute
@workgroup_size(${c.workgroupSizeX}, ${c.workgroupSizeY}, 1)
fn main(
  @builtin(global_invocation_id) global_id: vec3<u32>,
) {
  let strandId = global_id.x;
  let shadingPointId = global_id.y;
  let SHADING_POINTS_f32 = f32(SHADING_POINTS);

  var color = vec4f(0., 0., 0., 1.);

  let t = f32(shadingPointId) / SHADING_POINTS_f32;
  // dbg: 't': // red at root, green at tip
  color.r = 1.0 - t;
  color.g = t;

  _setShadingPoint(strandId, shadingPointId, color);
}

`;
