import { SNIPPET_ACES } from '../_shaderSnippets/aces.wgsl.ts';
import { SNIPPET_DITHER } from '../_shaderSnippets/dither.wgsl.ts';
import { FULLSCREEN_TRIANGLE_POSITION } from '../_shaderSnippets/fullscreenTriangle.wgsl.ts';
import { LINEAR_DEPTH } from '../_shaderSnippets/linearDepth.wgsl.ts';
import { GENERIC_UTILS } from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import * as SHADER_SNIPPETS from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { TEXTURE_AO } from '../aoPass/shared/textureAo.wgsl.ts';

export const SHADER_PARAMS = {
  bindings: {
    renderUniforms: 0,
    resultHDR_Texture: 1,
    depthTexture: 2,
    normalsTexture: 3,
    aoTexture: 4,
  },
};

///////////////////////////
/// SHADER CODE
///////////////////////////
const b = SHADER_PARAMS.bindings;

export const SHADER_CODE = () => /* wgsl */ `

${FULLSCREEN_TRIANGLE_POSITION}
${SNIPPET_DITHER}
${SNIPPET_ACES}
${LINEAR_DEPTH}
${GENERIC_UTILS}
${SHADER_SNIPPETS.NORMALS_UTILS}

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}
${TEXTURE_AO(b.aoTexture)}

@group(0) @binding(${b.resultHDR_Texture})
var _resultHDR_Texture: texture_2d<f32>;

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

fn doGamma (color: vec3f, gammaValue: f32) -> vec3f {
  return pow(color, vec3f(1.0 / gammaValue));
}

@fragment
fn main_fs(
  @builtin(position) positionPxF32: vec4<f32>
) -> @location(0) vec4<f32> {
  let gamma = _uniforms.colorMgmt.x;
  let exposure = _uniforms.colorMgmt.y;
  let ditherStr = _uniforms.colorMgmt.z;

  let fragPositionPx = vec2u(positionPxF32.xy);
  var color = vec3f(0.0);
  let resultColor = textureLoad(_resultHDR_Texture, fragPositionPx, 0).rgb;
  let displayMode = getDisplayMode();
  
  if (
    displayMode == DISPLAY_MODE_FINAL || 
    displayMode == DISPLAY_MODE_HW_RENDER
  ) {
    color = resultColor;
    color = ditherColor(fragPositionPx, color, ditherStr);
    color = color * exposure;
    color = saturate(doACES_Tonemapping(color));
    color = doGamma(color, gamma);

  } else if (displayMode == DISPLAY_MODE_DEPTH) {
    let depth: f32 = textureLoad(_depthTexture, fragPositionPx, 0);
    var c = linearizeDepth_0_1(depth);
    // let rescale = vec2f(0.005, 0.009);
    let rescale = vec2f(0.002, 0.01);
    c = mapRange(rescale.x, rescale.y, 0., 1., c);
    color = vec3f(c);
  
  } else if (displayMode == DISPLAY_MODE_NORMALS) {
    let normalsOct: vec2f = textureLoad(_normalsTexture, fragPositionPx, 0).xy;
    let normal = decodeOctahedronNormal(normalsOct);
    color = vec3f(abs(normal.xyz));

  } else if (displayMode == DISPLAY_MODE_AO) {
    let ao = sampleAo(vec2f(_uniforms.viewport.xy), positionPxF32.xy);
    color = vec3f(ao);
  
  } else {
    color = resultColor;
  }

  return vec4(color.xyz, 1.0);
}

`;
