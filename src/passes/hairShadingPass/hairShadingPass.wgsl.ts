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
  let lightPositionWS = _uniforms.light0.position.xyz;
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

  let toLight: vec3f = normalize(lightPositionWS - positionWS.xyz);
  let toCamera: vec3f = normalize(cameraPositionWS - positionWS.xyz);
  let baseColor: vec3f = vec3f(0., 0., 1.0);
  let specular: f32 = f32(2.0); // weight for .r
  let shift: f32 = f32(0.0); // TODO
  let roughness: f32 = f32(0.2); // TODO
  let marschnerSpec = hairSpecularMarschner(
    toLight,
    toCamera,
    tangentWS.xyz,
    baseColor,
    specular,
    shift,
    roughness
  );

  let diffuse = KajiyaKayDiffuse(baseColor, toLight, tangentWS.xyz);
  // TODO many lights
  color = vec4f(marschnerSpec.rgb + diffuse, 1.0);
  // color = vec4f(diffuse, 1.0);
  // (diffuse + specular) * light.color

  

  _setShadingPoint(strandIdx, shadingPointId, color);
}

/** https://web.engr.oregonstate.edu/~mjb/cs557/Projects/Papers/HairRendering.pdf#page=12 */
fn KajiyaKayDiffuse(baseColor: vec3f, toLight: vec3f, tangent: vec3f) -> vec3f {
  // diffuse lighting: the lerp shifts the shadow boundary for a softer look
  let diffuse = mix(0.25, 1.0, dot(tangent, toLight));
  return diffuse * baseColor;
}

`;
