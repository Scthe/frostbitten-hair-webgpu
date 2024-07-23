import { BUFFER_HAIR_DATA } from '../../scene/hair/hairDataBuffer.ts';
import { BUFFER_HAIR_POINTS_POSITIONS } from '../../scene/hair/hairPointsPositionsBuffer.ts';
import { BUFFER_HAIR_TANGENTS } from '../../scene/hair/hairTangentsBuffer.ts';
import { SNIPPET_SHADING_PBR } from '../_shaderSnippets/pbr.wgsl.ts';
import * as SHADER_SNIPPETS from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { SNIPPET_SHADING } from '../_shaderSnippets/shading.wgsl.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';

export const SHADER_PARAMS = {
  bindings: {
    renderUniforms: 0,
    hairData: 1,
    hairPositions: 2,
    hairTangents: 3,
  },
};

///////////////////////////
/// SHADER CODE
///////////////////////////
const b = SHADER_PARAMS.bindings;

export const SHADER_CODE = () => /* wgsl */ `

${SHADER_SNIPPETS.GET_MVP_MAT}
${SHADER_SNIPPETS.NORMALS_UTILS}
${SHADER_SNIPPETS.GENERIC_UTILS}
${SNIPPET_SHADING_PBR}
${SNIPPET_SHADING}

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}
${BUFFER_HAIR_DATA(b.hairData)}
${BUFFER_HAIR_POINTS_POSITIONS(b.hairPositions)}
${BUFFER_HAIR_TANGENTS(b.hairTangents)}


struct VertexOutput {
  @builtin(position) position: vec4<f32>,
};

// Access the current line segment
// We will move vertices left or right by hair thickness:
//   - odd vertices are moved left,
//   - even are moved right.
// And by 'left' and 'right' we mean according to normal&tangent.
// And by normal we mean (hair_pos - camera_pos)


@vertex
fn main_vs(
  @builtin(vertex_index) inVertexIndex : u32 // [0, 5]
) -> VertexOutput {
  let strandsCount: u32 = _hairData.strandsCount;
  let pointsPerStrand: u32 = _hairData.pointsPerStrand;
  let modelMatrix = _uniforms.modelMatrix;
  let vpMatrix = _uniforms.vpMatrix;
  let cameraPosition = _uniforms.cameraPosition;
  
  let fiberRadius = _uniforms.fiberRadius;
  // let strandId: u32 = inVertexIndex / 2u / pointsPerStrand;
  let index: u32 = inVertexIndex / 2u; // each segment is 2 triangles, so we get same strand data twice.
  let isOdd = (inVertexIndex & 0x01u) > 0u;
  let positionOrg = _hairPointPositions[index].xyz;
  let tangentOrg = _hairTangents[index].xyz;
  let positionWS = modelMatrix * vec4f(positionOrg, 1.0);
  let tangentWS = modelMatrix * vec4f(tangentOrg, 1.0);

  // Calculate bitangent vectors
  let towardsCamera: vec3f = safeNormalize3(cameraPosition.xyz - positionWS.xyz);
  let right: vec3f = safeNormalize3(cross(tangentWS.xyz, towardsCamera));
  
  // Calculate the negative and positive offset screenspace positions
  // 0 is for odd vertexId, 1 is for even vertexId
  let thicknessVector: vec3f = right * fiberRadius;
  let hairEdgePositionsOdd  = vec4f(positionWS.xyz - thicknessVector, 1.0); // position 'left'
  let hairEdgePositionsEven = vec4f(positionWS.xyz + thicknessVector, 1.0); // position 'right'
  var hairEdgePosition = select( // DO NOT QUESTION THE ORDER OF PARAMS!
    hairEdgePositionsEven,
    hairEdgePositionsOdd,
    isOdd
  );


  var result: VertexOutput;
  result.position = vpMatrix * hairEdgePosition;
  return result;
}


@fragment
fn main_fs(fragIn: VertexOutput) -> @location(0) vec4<f32> {
  let color = vec3(1.0, 0.0, 0.0);
  return vec4(color.xyz, 1.0);
}
`;
