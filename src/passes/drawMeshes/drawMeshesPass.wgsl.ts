import { SNIPPET_SHADING_PBR } from '../_shaderSnippets/pbr.wgsl.ts';
import * as SHADER_SNIPPETS from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { TEXTURE_AO } from '../aoPass/shared/textureAo.wgsl.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import { SAMPLE_SHADOW_MAP } from '../shadowMapPass/shared/sampleShadows.wgsl.ts';

export const SHADER_PARAMS = {
  firstInstance: {
    sintel: 0,
    colliderPreview: 1,
  },
  bindings: {
    renderUniforms: 0,
    shadowMapTexture: 1,
    shadowMapSampler: 2,
    aoTexture: 3,
  },
};

export const DEFAULT_COLOR: [number, number, number] = [0.9, 0.9, 0.9];

///////////////////////////
/// SHADER CODE
///
/// https://github.com/Scthe/WebFX/blob/master/src/shaders/sintel.frag.glsl#L135
///////////////////////////
const c = SHADER_PARAMS;
const b = SHADER_PARAMS.bindings;

export const SHADER_CODE = () => /* wgsl */ `

${SHADER_SNIPPETS.GET_MVP_MAT}
${SHADER_SNIPPETS.GENERIC_UTILS}
${SHADER_SNIPPETS.NORMALS_UTILS}
${SNIPPET_SHADING_PBR}
${SAMPLE_SHADOW_MAP({
  bindingTexture: b.shadowMapTexture,
  bindingSampler: b.shadowMapSampler,
})}

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}
${TEXTURE_AO(b.aoTexture)}


struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) positionWS: vec4f,
  @location(1) normalWS: vec3f,
  @location(2) uv: vec2f,
  // vertex transformed by shadow source's MVP matrix
  @location(3) positionShadowSpace: vec3f,
  @location(4) @interpolate(flat) isColliderPreview: u32,
};


@vertex
fn main_vs(
  @builtin(instance_index) instanceIdx: u32,
  @location(0) inWorldPos : vec3f,
  @location(1) inNormal : vec3f,
  @location(2) inUV : vec2f,
) -> VertexOutput {
  var result: VertexOutput;
  var mvpMatrix = _uniforms.mvpMatrix;
  var mvpShadowSourceMatrix = _uniforms.shadows.sourceMVP_Matrix;
  var modelMat = _uniforms.modelMatrix;
  
  if (instanceIdx == ${c.firstInstance.colliderPreview}u) {
    modelMat = _uniforms.collisionSphereModelMatrix;
    mvpMatrix = getMVP_Mat(modelMat, _uniforms.viewMatrix, _uniforms.projMatrix);
    mvpShadowSourceMatrix = mat4x4<f32>();
    result.isColliderPreview = 1u;
  }

  let vertexPos = vec4<f32>(inWorldPos.xyz, 1.0);
  result.position = mvpMatrix * vertexPos;
  result.positionWS = vertexPos;
  result.normalWS = transformNormalToWorldSpace(modelMat, inNormal);
  result.uv = inUV;
  result.positionShadowSpace = projectToShadowSpace(
    mvpShadowSourceMatrix, vertexPos
  );

  return result;
}


struct FragmentOutput {
  @location(0) color: vec4<f32>,
  @location(1) normals: vec2<f32>,
};


@fragment
fn main_fs(fragIn: VertexOutput) -> FragmentOutput {
  // https://github.com/Scthe/WebFX/blob/09713a3e7ebaa1484ff53bd8a007908a5340ca8e/src/shaders/sintel.frag.glsl
  // material
  var material: Material;
  createDefaultMaterial(&material, fragIn.positionWS, normalize(fragIn.normalWS));
  
  // shadow
  let shadowSourcePositionWS = _uniforms.shadows.sourcePosition.xyz;
  material.shadow = 1.0 - calculateDirectionalShadow(
    _uniforms.shadows.usePCSS > 0u,
    shadowSourcePositionWS,
    fragIn.positionWS.xyz,
    normalize(fragIn.normalWS),
    fragIn.positionShadowSpace,
    _uniforms.shadows.PCF_Radius,
    _uniforms.shadows.bias
  );
  var c = material.shadow;

  // ao
  let ao = sampleAo(vec2f(_uniforms.viewport.xy), fragIn.position.xy);
  material.ao = mix(1.0, ao, _uniforms.ao.strength);
  // c = material.ao;

  // collider
  if (fragIn.isColliderPreview > 0u) {
    material.albedo = vec3f(0.3, 0.3, 0.0);
    material.shadow = 1.0;
    material.ao = 1.0;
    material.roughness = 1.0;
    material.isMetallic = 0.0;
  }

  // shading
  let color = doShading(material);

  var result: FragmentOutput;
  result.color = vec4f(color.xyz, 1.0);
  // result.color = vec4f(c,c,c, 1.0); // dbg
  result.normals = encodeOctahedronNormal(material.normal);
  return result;
}


fn doShading(material: Material) -> vec3f {
  let ambient = _uniforms.lightAmbient.rgb * _uniforms.lightAmbient.a;
  var radianceSum = vec3(0.0);

  radianceSum += disneyPBR(material, _uniforms.light0);
  radianceSum += disneyPBR(material, _uniforms.light1);
  radianceSum += disneyPBR(material, _uniforms.light2);

  radianceSum *= saturate(material.ao);
  let maxShadowStr = _uniforms.shadows.strength;
  radianceSum *= clamp(material.shadow, 1.0 - maxShadowStr, 1.0);

  return ambient + radianceSum;
}

fn createDefaultMaterial(
  material: ptr<function, Material>,
  positionWS: vec4f,
  normalWS: vec3f
){
  let cameraPos = _uniforms.cameraPosition.xyz;
  
  (*material).positionWS = positionWS.xyz;
  (*material).normal = normalWS;
  (*material).toEye = normalize(cameraPos - positionWS.xyz);
  // brdf params:
  (*material).albedo = vec3f(
    ${DEFAULT_COLOR[0]},
    ${DEFAULT_COLOR[1]},
    ${DEFAULT_COLOR[2]});
  (*material).roughness = 0.8;
  (*material).isMetallic = 0.0;
  (*material).ao = 1.0;
  (*material).shadow = 1.0;
}
`;
