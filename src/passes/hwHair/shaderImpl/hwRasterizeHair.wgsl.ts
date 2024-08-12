/**
 * Access the current line segment
 * We will move vertices left or right by hair thickness:
 *   - odd vertices are moved left,
 *   - even are moved right.
 * And by 'left' and 'right' we mean cross(toCamera, tangent).
 */
export const HW_RASTERIZE_HAIR = /* wgsl */ `

struct HwHairRasterizeParams {
  modelViewMatrix: mat4x4f,
  projMatrix: mat4x4f,
  fiberRadius: f32,
  inVertexIndex: u32,
}

struct HwRasterizedHair {
  position: vec4f,
  tangentOBJ: vec3f,
}

/** NOTE: all the comments assume you have 32 verts per strand */
fn hwRasterizeHair(
  p: HwHairRasterizeParams,
) -> HwRasterizedHair {
  var result: HwRasterizedHair;

  let index: u32 = p.inVertexIndex / 2u; // each segment is 2 triangles, so we get same strand data twice.
  let isOdd = (p.inVertexIndex & 0x01u) > 0u;
  let positionOrg = _hairPointPositions[index].xyz;
  let tangentOrg = _hairTangents[index].xyz;
  let positionVS = p.modelViewMatrix * vec4f(positionOrg, 1.0);
  let tangentVS  = p.modelViewMatrix * vec4f(tangentOrg, 1.0);

  // Calculate bitangent vectors
  let right: vec3f = safeNormalize3(cross(tangentVS.xyz, vec3f(0., 0., 1.)));
  
  // Calculate the negative and positive offset screenspace positions
  // 0 is for odd vertexId, 1 is for even vertexId
  let thicknessVector: vec3f = right * p.fiberRadius;
  let hairEdgePositionsOdd  = vec4f(positionVS.xyz - thicknessVector, 1.0); // position 'left'
  let hairEdgePositionsEven = vec4f(positionVS.xyz + thicknessVector, 1.0); // position 'right'
  let hairEdgePosition = select( // DO NOT QUESTION THE ORDER OF PARAMS!
    hairEdgePositionsEven,
    hairEdgePositionsOdd,
    isOdd
  );
  
  result.position = p.projMatrix * hairEdgePosition;
  result.tangentOBJ = tangentOrg;
  return result;
}

struct HairStrandData {
  strandIdx: u32,
  tFullStrand: f32,
}

fn getHairStrandData(
  pointsPerStrand: u32,
  inVertexIndex : u32,
) -> HairStrandData {
  let pointIdx = inVertexIndex / 2u;
  let strandIdx = pointIdx / pointsPerStrand;
  let pointInStrandIdx = pointIdx % pointsPerStrand;
  let tFullStrand = f32(pointInStrandIdx) / f32(pointsPerStrand);
  return HairStrandData(strandIdx, tFullStrand);
}

`;
