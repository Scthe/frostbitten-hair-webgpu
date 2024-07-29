import { FULLSCREEN_TRIANGLE_POSITION } from '../_shaderSnippets/fullscreenTriangle.wgsl.ts';
import { LINEAR_DEPTH } from '../_shaderSnippets/linearDepth.wgsl.ts';
import { GENERIC_UTILS } from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import * as SHADER_SNIPPETS from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { CONFIG } from '../../constants.ts';
import { GTAO_SNIPPET } from './gtao.wgsl.ts';

export const SHADER_PARAMS = {
  bindings: {
    renderUniforms: 0,
    depthTexture: 1,
    normalsTexture: 2,
  },
};

///////////////////////////
/// SHADER CODE
///////////////////////////
const b = SHADER_PARAMS.bindings;

export const SHADER_CODE = () => /* wgsl */ `

${FULLSCREEN_TRIANGLE_POSITION}
${LINEAR_DEPTH}
${GENERIC_UTILS}
${SHADER_SNIPPETS.NORMALS_UTILS}
${GTAO_SNIPPET}

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}

@group(0) @binding(${b.depthTexture})
var _depthTexture: texture_depth_2d;

@group(0) @binding(${b.normalsTexture})
var _normalsTexture: texture_2d<f32>;


@vertex
fn main_vs(
  @builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4f {
  return getFullscreenTrianglePosition(VertexIndex);
}

const AO_TEXTURE_SCALE = ${CONFIG.ao.textureSizeMul};

@fragment
fn main_fs(
  @builtin(position) fragPositionPxF32_halfRes: vec4<f32>
) -> @location(0) f32 {
  let projMatrixInv = _uniforms.projMatrixInv;
  let viewMatrix = _uniforms.viewMatrix;
  let viewport = vec2f(_uniforms.viewport.xy);

  // pixel position
  let fragPositionPxF32_fullRes = fragPositionPxF32_halfRes.xy / AO_TEXTURE_SCALE; // in [0, viewportPx.xy]
  let fragPositionPx_fullRes: vec2u = vec2u(fragPositionPxF32_fullRes); // in [0, viewportPx.xy]
 
  // normals
  let normalsOct: vec2f = textureLoad(_normalsTexture, fragPositionPx_fullRes, 0).xy;
  let normal = decodeOctahedronNormal(normalsOct);

  // depth
  let depth: f32 = textureLoad(_depthTexture, fragPositionPx_fullRes, 0);
  
  // get the projected position from pixel coords
  let posXY_0_1 = fragPositionPxF32_fullRes / viewport; // XY position in range [0 .. 1]
  let posXY_neg1_1 = posXY_0_1 * 2.0 - 1.0; // XY position in range [-1 .. 1]
  let positionProj = vec4f(posXY_neg1_1, depth, 1.0);

  return gtao(
    projMatrixInv,
    viewMatrix,
    viewport,
    fragPositionPxF32_fullRes,
    normal
  );
}

`;
