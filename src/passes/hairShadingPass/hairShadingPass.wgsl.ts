import { BUFFER_HAIR_DATA } from '../../scene/hair/hairDataBuffer.ts';
import { BUFFER_HAIR_POINTS_POSITIONS } from '../../scene/hair/hairPointsPositionsBuffer.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import * as SHADER_SNIPPETS from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { CONFIG } from '../../constants.ts';
import { BUFFER_HAIR_SHADING } from '../../scene/hair/hairShadingBuffer.ts';
import { SNIPPET_SHADING_PBR_UTILS } from '../_shaderSnippets/pbr.wgsl.ts';
import { SHADER_CODE_MARSCHNER } from './marschner.wgsl.ts';
import { BUFFER_HAIR_TANGENTS } from '../../scene/hair/hairTangentsBuffer.ts';

export const SHADER_PARAMS = {
  workgroupSizeX: 1, // TODO [LOW] adjust
  workgroupSizeY: CONFIG.hairRender.shadingPoints,
  bindings: {
    renderUniforms: 0,
    hairData: 1,
    hairPositions: 2,
    hairTangents: 3,
    hairShading: 4,
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

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}
${BUFFER_HAIR_DATA(b.hairData)}
${BUFFER_HAIR_POINTS_POSITIONS(b.hairPositions)}
${BUFFER_HAIR_TANGENTS(b.hairTangents)}
${BUFFER_HAIR_SHADING(b.hairShading, 'read_write')}



@compute
@workgroup_size(${c.workgroupSizeX}, ${c.workgroupSizeY}, 1)
fn main(
  @builtin(global_invocation_id) global_id: vec3<u32>,
) {
  let strandIdx = global_id.x;
  let shadingPointId = global_id.y;
  let SHADING_POINTS_f32 = f32(SHADING_POINTS);
  let cameraPositionWS = _uniforms.cameraPosition.xyz;
  let modelMatrix = _uniforms.modelMatrix;
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

  let toCamera: vec3f = normalize(cameraPositionWS - positionWS.xyz);
  let params = MarschnerParams(
    _uniforms.hairMaterial.color, // vec3f(0., 0., 1.0), // baseColor
    _uniforms.hairMaterial.specular, // (weight for .r)
    _uniforms.hairMaterial.weightTT,
    _uniforms.hairMaterial.weightTRT,
    _uniforms.hairMaterial.shift,
    _uniforms.hairMaterial.roughness,
  );
  
  let ambient = _uniforms.lightAmbient.rgb * _uniforms.lightAmbient.a;
  var radianceSum = vec3(0.0);

  radianceSum += hairShading(params, _uniforms.light0, toCamera, tangentWS, positionWS);
  radianceSum += hairShading(params, _uniforms.light1, toCamera, tangentWS, positionWS);
  radianceSum += hairShading(params, _uniforms.light2, toCamera, tangentWS, positionWS);

  color = vec4f(radianceSum, 1.0); // TODO add alpha?
  _setShadingPoint(strandIdx, shadingPointId, color);
}

fn hairShading(
  p: MarschnerParams,
  light: Light,
  toCamera: vec3f,
  tangentWS: vec4f,
  positionWS: vec4f,
) -> vec3f {
  let toLight: vec3f = normalize(light.position.xyz - positionWS.xyz);
  // TODO add ambient occlusion and shadows
  let shadow = 0.0;
  let aoTerm = 0.0; // 0-unoccluded, 1-occluded

  let diffuse = KajiyaKayDiffuse(p.baseColor, toLight, tangentWS.xyz);
  let multipleScatter = fakeMultipleScattering(
    toCamera,
    toLight,
    tangentWS,
    p.baseColor,
    shadow
  );
  let diffuseTotal = diffuse * multipleScatter * saturate(dot(tangentWS.xyz, toLight));

  let marschnerSpec = hairSpecularMarschner(
    p,
    toLight,
    toCamera,
    tangentWS.xyz,
  );

  // TODO better tune diffuse-specular addition
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

`;
