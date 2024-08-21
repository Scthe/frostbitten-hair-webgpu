import { BUFFER_HAIR_DATA } from '../../scene/hair/hairDataBuffer.ts';
import { BUFFER_HAIR_POINTS_POSITIONS } from '../../scene/hair/hairPointsPositionsBuffer.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import * as SHADER_SNIPPETS from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { CONFIG } from '../../constants.ts';
import { BUFFER_HAIR_SHADING } from '../../scene/hair/hairShadingBuffer.ts';
import { SNIPPET_SHADING_PBR_UTILS } from '../_shaderSnippets/pbr.wgsl.ts';
import { SHADER_CODE_MARSCHNER } from './marschner.wgsl.ts';
import { BUFFER_HAIR_TANGENTS } from '../../scene/hair/hairTangentsBuffer.ts';
import { SNIPPET_NOISE } from '../_shaderSnippets/noise.wgsl.ts';
import { SAMPLE_SHADOW_MAP } from '../shadowMapPass/shared/sampleShadows.wgsl.ts';
import { TEXTURE_AO } from '../aoPass/shared/textureAo.wgsl.ts';
import { LINEAR_DEPTH } from '../_shaderSnippets/linearDepth.wgsl.ts';

export const SHADER_PARAMS = {
  workgroupSizeX: 1, // TODO [LOW] adjust
  workgroupSizeY: CONFIG.hairRender.shadingPoints,
  bindings: {
    renderUniforms: 0,
    hairData: 1,
    hairPositions: 2,
    hairTangents: 3,
    hairShading: 4,
    shadowMapTexture: 5,
    shadowMapSampler: 6,
    aoTexture: 7,
    depthTexture: 8,
  },
};

///////////////////////////
/// SHADER CODE
///////////////////////////
const c = SHADER_PARAMS;
const b = SHADER_PARAMS.bindings;

export const SHADER_CODE = () => /* wgsl */ `

${SHADER_SNIPPETS.GET_MVP_MAT}
${SHADER_SNIPPETS.GENERIC_UTILS}
${SNIPPET_SHADING_PBR_UTILS}
${SHADER_CODE_MARSCHNER}
${SNIPPET_NOISE}
${SAMPLE_SHADOW_MAP({
  bindingTexture: b.shadowMapTexture,
  bindingSampler: b.shadowMapSampler,
})}

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}
${BUFFER_HAIR_DATA(b.hairData)}
${BUFFER_HAIR_POINTS_POSITIONS(b.hairPositions)}
${BUFFER_HAIR_TANGENTS(b.hairTangents)}
${BUFFER_HAIR_SHADING(b.hairShading, 'read_write')}
${TEXTURE_AO(b.aoTexture)}
${LINEAR_DEPTH}

@group(0) @binding(${b.depthTexture})
var _depthTexture: texture_depth_2d;


@compute
@workgroup_size(${c.workgroupSizeX}, ${c.workgroupSizeY}, 1)
fn main(
  @builtin(global_invocation_id) global_id: vec3<u32>,
) {
  let strandIdx = global_id.x;
  let shadingPointId = global_id.y;
  let SHADING_POINTS_f32 = f32(SHADING_POINTS);
  let cameraPositionWS = _uniforms.cameraPosition.xyz;
  let viewport = vec2f(_uniforms.viewport.xy);
  let modelMatrix = _uniforms.modelMatrix;
  let vpMatrix = _uniforms.vpMatrix;
  let pointsPerStrand = _hairData.pointsPerStrand;

  var color = vec4f(0., 0., 0., 1.);

  // 0.0 at root, 1.0 at tip
  let t = f32(shadingPointId) / SHADING_POINTS_f32;
  // dbg: 't': // red at root, green at tip
  // color.r = 1.0 - t;
  // color.g = t;

  var segmentIndices: vec2u;
  let tInSegment = remapToIndices(pointsPerStrand, t, &segmentIndices);
  // color.r = select(1., 0., tInSegment > 0.5); // dbg: half of the segment is black, half is red
  // color.r = select(1., 0., (segmentIndices.x & 1) == 1); // dbg: alternate red-black segments

  let segment0_obj: vec3f = _getHairPointPosition(pointsPerStrand, strandIdx, segmentIndices.x).xyz;
  let segment1_obj: vec3f = _getHairPointPosition(pointsPerStrand, strandIdx, segmentIndices.y).xyz;
  let tangent0_obj = normalize(segment1_obj - segment0_obj);
  let tangent1_obj = _getHairTangent(pointsPerStrand, strandIdx, segmentIndices.y).xyz;
  let positionOBJ = mix(segment0_obj, segment1_obj, tInSegment);
  let tangentOBJ = mix(tangent0_obj, tangent1_obj, tInSegment);
  let positionWS = modelMatrix * vec4f(positionOBJ, 1.0);
  let tangentWS = modelMatrix * vec4f(tangentOBJ, 1.0);
  let positionProj = projectVertex(vpMatrix, positionWS);
  let positionPx_0_1 = vec2f( // range: [0, 1]
    (positionProj.x * 0.5 + 0.5),
    (positionProj.y * 0.5 + 0.5),
  );
  // let positionPx = viewport * positionPx_0_1; // range: [0.,  viewportPixels.xy]
  let positionTexSamplePx = viewport * vec2f(positionPx_0_1.x, 1.0 - positionPx_0_1.y); // range: [0.,  viewportPixels.xy]


  // base color
  let baseColor0 = _uniforms.hairMaterial.color0;
  let baseColor1 = _uniforms.hairMaterial.color1;
  var baseColor = mix(baseColor0, baseColor1, t);
  let randStrandColor = randomRGB(strandIdx, 1.0);
  // let randStrandColor = vec3f(0., 1., 0.);
  baseColor = mix(baseColor, randStrandColor, _uniforms.hairMaterial.colorRng);
  let rngBrightness = fract(f32(strandIdx) / 255.0);
  baseColor = mix(baseColor, baseColor * rngBrightness, _uniforms.hairMaterial.lumaRng);
  // baseColor = vec3f(rngBrightness);

  let toCamera: vec3f = normalize(cameraPositionWS - positionWS.xyz);
  let params = MarschnerParams(
    baseColor,
    _uniforms.hairMaterial.specular, // (weight for .r)
    _uniforms.hairMaterial.weightTT,
    _uniforms.hairMaterial.weightTRT,
    _uniforms.hairMaterial.shift,
    _uniforms.hairMaterial.roughness,
  );

  // shadow
  let maxShadowStr = _uniforms.hairMaterial.shadows;
  let mvpShadowSourceMatrix = _uniforms.shadows.sourceMVP_Matrix;
  var shadow = getShadow(
    mvpShadowSourceMatrix,
    positionWS,
    tangentWS.xyz,
  );
  shadow = clamp(shadow, 1.0 - maxShadowStr, 1.0);
  // baseColor = vec3f(shadow); // dbg

  // ao
  var ao = sampleAo(vec2f(viewport.xy), positionTexSamplePx);
  ao = 1.0 - mix(1.0, ao, _uniforms.ao.strength); // 0-unoccluded, 1-occluded
  // baseColor = vec3f(ao); // dbg

  // attenuation
  let attenuation = getAttenuation(
    positionProj,
    positionTexSamplePx,
    _uniforms.hairMaterial.attenuation,
  );
  ao = saturate(ao + attenuation);

  
  // start light/material calc.
  let ambient = _uniforms.lightAmbient.rgb * _uniforms.lightAmbient.a;
  var radianceSum = vec3(0.0);

  radianceSum += hairShading(params, _uniforms.light0, toCamera, tangentWS, positionWS, shadow, ao);
  radianceSum += hairShading(params, _uniforms.light1, toCamera, tangentWS, positionWS, shadow, ao);
  radianceSum += hairShading(params, _uniforms.light2, toCamera, tangentWS, positionWS, shadow, ao);

  // thin-tip alpha.
  let alpha = select(1.0, 0.0, shadingPointId >= SHADING_POINTS - 1);
  color = vec4f(radianceSum, alpha); // TODO [IGNORE] add material.alpha [0.8 .. 1.0]?
  _setShadingPoint(strandIdx, shadingPointId, color);
  // _setShadingPoint(strandIdx, shadingPointId, vec4f(baseColor, 1.0)); // dbg
}

fn hairShading(
  p: MarschnerParams,
  light: Light,
  toCamera: vec3f,
  tangentWS: vec4f,
  positionWS: vec4f,
  shadow: f32,
  aoTerm: f32, // 0-unoccluded, 1-occluded
) -> vec3f {
  let toLight: vec3f = normalize(light.position.xyz - positionWS.xyz);

  let diffuse = KajiyaKayDiffuse(p.baseColor, toLight, tangentWS.xyz);
  let multipleScatter = fakeMultipleScattering(
    toCamera,
    toLight,
    tangentWS,
    p.baseColor,
    shadow
  );
  var diffuseTotal = diffuse * multipleScatter * saturate(dot(tangentWS.xyz, toLight));
  // diffuseTotal *= shadow;
  // return diffuseTotal;

  let marschnerSpec = hairSpecularMarschner(
    p,
    toLight,
    toCamera,
    tangentWS.xyz,
  );

  // TODO [IGNORE] better tune diffuse-specular addition, see:
  //      https://www.fxguide.com/fxfeatured/pixars-renderman-marschner-hair (last section)
  let brdfFinal = diffuseTotal + marschnerSpec;
  // let brdfFinal = pbr_mixDiffuseAndSpecular(material, lambert, specular, F);
  
  let lightAttenuation = 1.0; // hardcoded for this demo
  let radiance = lightAttenuation * light.colorAndEnergy.rgb * light.colorAndEnergy.a; // incoming color from light

  return brdfFinal * radiance * (1.0 - aoTerm);
}


/** https://web.engr.oregonstate.edu/~mjb/cs557/Projects/Papers/HairRendering.pdf#page=12 */
fn KajiyaKayDiffuse(baseColor: vec3f, toLight: vec3f, tangent: vec3f) -> vec3f {
  // diffuse lighting: the lerp shifts the shadow boundary for a softer look
  let diffuse = mix(0.25, 1.0, dot(tangent, toLight));
  return diffuse * baseColor;
}

/** https://blog.selfshadow.com/publications/s2016-shading-course/karis/s2016_pbs_epic_hair.pdf#page=39 */
fn fakeMultipleScattering(
  toCamera: vec3f,
  toLight: vec3f,
  tangentWS: vec4f,
  baseColor: vec3f,
  shadow: f32,
) -> vec3f {
  let fakeNormal: vec3f = normalize(toCamera - tangentWS.xyz * dot(toCamera, tangentWS.xyz));

  // term 2
  let NoL = saturate(dot(fakeNormal, toLight));
  let diffuseScatter = (NoL + 1.0) / (4.0 * PI);
  // term 3
  let luma = toLuma_fromLinear(baseColor);
  let tint: vec3f = pow(baseColor / luma, vec3f(1. - shadow));

  // combine
  return sqrt(baseColor) * diffuseScatter * tint;
}

fn getShadow(
  mvpShadowSourceMatrix: mat4x4f,
  positionWS: vec4f,
  normalWS: vec3f,
) -> f32 {
  let shadowSourcePositionWS = _uniforms.shadows.sourcePosition.xyz;
  let positionShadowSpace = projectToShadowSpace(
    mvpShadowSourceMatrix, positionWS
  );
  return 1.0 - calculateDirectionalShadow(
    _uniforms.shadows.usePCSS > 0u,
    shadowSourcePositionWS,
    positionWS.xyz,
    normalWS,
    positionShadowSpace,
    _uniforms.shadows.PCF_Radius,
    _uniforms.shadows.bias
  );
}

/**
 * Fake attenuation mimicking https://en.wikipedia.org/wiki/Beer%E2%80%93Lambert_law
 */
fn getAttenuation(
  positionProj: vec3f,
  positionTexSamplePx: vec2f,
  attenuationFactor: f32,
) -> f32 {
  let myDepth = linearizeDepth(positionProj.z); // [zNear, zFar]
  let zBufferDepthProj = textureLoad(_depthTexture, vec2u(positionTexSamplePx), 0);
  let zBufferDepth = linearizeDepth(zBufferDepthProj); // [zNear, zFar]
  let depthDiff = abs(myDepth - zBufferDepth); // small value means near front. Bigger values further back
  // If you want, you can call exp() if you want. Not sure this fake impl is "standarized". But it looks nice.
  return depthDiff * attenuationFactor;

  // dbg
  // baseColor = vec3f(depthDiff * 10.0); // dbg
  // var c: f32; let rescale = vec2f(0.002, 0.01); // dbg
  // c = depthDiff * 10.0;
  // c = mapRange(rescale.x, rescale.y, 0., 1., myDepth / (100.0 - 0.1));
  // c = mapRange(rescale.x, rescale.y, 0., 1., zBufferDepth / (100.0 - 0.1));
  // c = positionPx.y / viewport.y;
  // c = mapRange(.2, .4, 0., 1., c);
  // c = select(0., 1., c > .5);
  // baseColor = vec3f(c); // dbg
  // baseColor = vec3f(attenuation); // dbg
}

`;
