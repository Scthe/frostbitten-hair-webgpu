import { SNIPPET_SHADING_PBR } from '../_shaderSnippets/pbr.wgsl.ts';
import * as SHADER_SNIPPETS from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { SNIPPET_SHADING } from '../_shaderSnippets/shading.wgsl.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import { SAMPLE_SHADOW_MAP } from '../shadowMapPass/shared/sampleShadows.wgsl.ts';

export const SHADER_PARAMS = {
  bindings: {
    renderUniforms: 0,
    shadowMapTexture: 1,
    shadowMapSampler: 2,
  },
};

///////////////////////////
/// SHADER CODE
///////////////////////////
const b = SHADER_PARAMS.bindings;

export const SHADER_CODE = () => /* wgsl */ `

${SHADER_SNIPPETS.GET_MVP_MAT}
${SHADER_SNIPPETS.GENERIC_UTILS}
${SHADER_SNIPPETS.NORMALS_UTILS}
${SNIPPET_SHADING_PBR}
${SNIPPET_SHADING}
${SAMPLE_SHADOW_MAP}

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}


@group(0) @binding(${b.shadowMapTexture})
var _shadowMapTexture: texture_depth_2d;

@group(0) @binding(${b.shadowMapSampler})
// var _shadowMapSampler: sampler_comparison;
var _shadowMapSampler: sampler;


struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) positionWS: vec4f,
  @location(1) normalWS: vec3f,
  @location(2) uv: vec2f,
  // vertex transformed by shadow source's MVP matrix
  @location(3) positionShadowSpace: vec3f,
};


@vertex
fn main_vs(
  @location(0) inWorldPos : vec3f,
  @location(1) inNormal : vec3f,
  @location(2) inUV : vec2f,
) -> VertexOutput {
  var result: VertexOutput;
  let mvpMatrix = _uniforms.mvpMatrix;
  let modelMat = _uniforms.modelMatrix;
  let mvpShadowSourceMatrix = _uniforms.mvpShadowSourceMatrix;

  let vertexPos = vec4<f32>(inWorldPos.xyz, 1.0);
  result.position = mvpMatrix * vertexPos;
  result.positionWS = vertexPos;
  result.normalWS = transformNormalToWorldSpace(modelMat, inNormal);
  result.uv = inUV;

  // XY is in (-1, 1) space, Z is in (0, 1) space
  let posFromLight = mvpShadowSourceMatrix * vertexPos;
  // Convert XY to (0, 1)
  result.positionShadowSpace = vec3f(
    posFromLight.x * 0.5 + 0.5,
    1.0 - (posFromLight.y * 0.5 + 0.5), // Y is flipped because texture coords are Y-down.
    posFromLight.z
  );

  return result;
}


@fragment
fn main_fs(fragIn: VertexOutput) -> @location(0) vec4<f32> {
  // material
  var material: Material;
  createDefaultMaterial(&material, fragIn.positionWS, normalize(fragIn.normalWS));
  // material.albedo = textureSample(_diffuseTexture, _sampler, fragIn.uv).rgb;
  
  // shading
  let color = doShading(material);

  let shadowSourcePositionWS = _uniforms.shadowSourcePosition.xyz;
  let shadow = 1.0 - calculateDirectionalShadow(
    shadowSourcePositionWS,
    fragIn.positionWS.xyz,
    normalize(fragIn.normalWS),
    fragIn.positionShadowSpace,
    0u, // sampleRadius, TODO hardcoded
    0.0005, // bias:  TODO hardcoded
  );

  // return vec4(color.xyz, 1.0);
  return vec4(shadow, shadow, shadow, 1.0);
}
`;
