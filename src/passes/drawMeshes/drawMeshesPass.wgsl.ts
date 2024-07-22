import { SNIPPET_SHADING_PBR } from '../_shaderSnippets/pbr.wgsl.ts';
import * as SHADER_SNIPPETS from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { SNIPPET_SHADING } from '../_shaderSnippets/shading.wgsl.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';

export const SHADER_PARAMS = {
  bindings: {
    renderUniforms: 0,
  },
};

///////////////////////////
/// SHADER CODE
///////////////////////////
const b = SHADER_PARAMS.bindings;

export const SHADER_CODE = () => /* wgsl */ `

${SHADER_SNIPPETS.GET_MVP_MAT}
${SHADER_SNIPPETS.NORMALS_UTILS}
${SNIPPET_SHADING_PBR}
${SNIPPET_SHADING}

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}


struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) positionWS: vec4f,
  @location(1) normalWS: vec3f,
  @location(2) uv: vec2f,
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

  let vertexPos = vec4<f32>(inWorldPos.xyz, 1.0);
  result.position = mvpMatrix * vertexPos;
  result.positionWS = vertexPos;
  result.normalWS = transformNormalToWorldSpace(modelMat, inNormal);
  result.uv = inUV;

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

  return vec4(color.xyz, 1.0);
}
`;
