export const HAIR_SIM_IMPL_CONSTRANTS = /* wgsl */ `

// See [Bender15] "Position-Based Simulation Methods in Computer Graphics"
// Section "5.1. Stretching"
fn applyConstraint_Length (
  stiffness: f32,
  expectedLength: f32,
  pos0: ptr<function, vec4f>,
  pos1: ptr<function, vec4f>,
) {
  let w0 = isMovable(*pos0);
  let w1 = isMovable(*pos1);

  let tangent = (*pos1).xyz - (*pos0).xyz; // from pos0 toward pos1, unnormalized
  let actualLength = length(tangent);
  // if segment is SHORTER: (expectedLength / actualLength) > 1.
  // So we have to elongate it. $correction is negative, proportional to missing length.
  // if segment is LONGER: (expectedLength / actualLength) < 1.
  // So we have to shorten it. $correction is positive, proportional to extra length.
  let correction: f32 = 1.0 - expectedLength / actualLength;
  let deltaFactor: f32 = correction * stiffness / (w0 + w1 + FLOAT_EPSILON);
  let delta: vec3f = deltaFactor * tangent;

  // (*pos0) = getNextPosition((*pos0), (*pos0).xyz + delta);
  // (*pos1) = getNextPosition((*pos1), (*pos1).xyz - delta);
  (*pos0) += vec4f(w0 * delta, 0.0);
	(*pos1) -= vec4f(w1 * delta, 0.0);
}


fn globalConstraintAttenuation(
  globalExtent: f32, globalFade: f32,
  pointsPerStrand: u32,
  pointIdx: u32
) -> f32 {
  let x = f32(pointIdx) / f32(pointsPerStrand - 1u);
  return 1.0 - saturate((x - globalExtent) / globalFade);
}

fn applyConstraint_GlobalShape(
  stiffness: f32,
  posInitial: vec3f,
  pointIdx: u32
) {
  var pos = _positionsWkGrp[wkGrpOffset + pointIdx];
  let deltaVec: vec3f = posInitial.xyz - pos.xyz; // pos -> posInitial
  _positionsWkGrp[wkGrpOffset + pointIdx] += vec4f(deltaVec * pos.w * stiffness, 0.0);
}



// A Triangle Bending Constraint Model for Position-Based Dynamics
fn applyConstraint_LocalShape(
  pointsPerStrand: u32, strandIdx: u32,
  stiffness: f32,
  pointIdx: u32
) {
  let posInitial0 = _getHairPointPositionInitial(pointsPerStrand, strandIdx, pointIdx);
  let posInitial1 = _getHairPointPositionInitial(pointsPerStrand, strandIdx, pointIdx + 1u);
  let posInitial2 = _getHairPointPositionInitial(pointsPerStrand, strandIdx, pointIdx + 2u);
  let cInitial: vec3f = (posInitial0.xyz + posInitial1.xyz + posInitial2.xyz) / 3.;
  let h0 = length(cInitial - posInitial1.xyz);
  
  let pos0 = _positionsWkGrp[wkGrpOffset + pointIdx];
  let pos1 = _positionsWkGrp[wkGrpOffset + pointIdx + 1u];
  let pos2 = _positionsWkGrp[wkGrpOffset + pointIdx + 2u];
  let c: vec3f = (pos0.xyz + pos1.xyz + pos2.xyz) / 3.;
  let hVec = pos1.xyz - c; // from median toward middle point
  let h = length(hVec);

  let wTotal = posInitial0.w + 2. * posInitial1.w + posInitial2.w;
  let w0 = posInitial0.w / wTotal *  2.;
  let w1 = posInitial1.w / wTotal * -4.;
  let w2 = posInitial2.w / wTotal *  2.;

  let delta = hVec * (1.0 - h0 / h);
  _positionsWkGrp[wkGrpOffset + pointIdx + 0u] += vec4f(stiffness * w0 * delta, 0.0);
  _positionsWkGrp[wkGrpOffset + pointIdx + 1u] += vec4f(stiffness * w1 * delta, 0.0);
  _positionsWkGrp[wkGrpOffset + pointIdx + 2u] += vec4f(stiffness * w2 * delta, 0.0);
}


fn applyConstraint_matchTangent(
  pointsPerStrand: u32, strandIdx: u32,
  stiffness: f32,
  pointIdx: u32
) {
  let posInitial0 = _getHairPointPositionInitial(pointsPerStrand, strandIdx, pointIdx - 1u);
  let posInitial1 = _getHairPointPositionInitial(pointsPerStrand, strandIdx, pointIdx);
  let tangentInitial = posInitial1.xyz - posInitial0.xyz;
  
  let pos0 = _positionsWkGrp[wkGrpOffset + pointIdx - 1u];
  let pos1 = _positionsWkGrp[wkGrpOffset + pointIdx];

  let positionProj = pos0.xyz + tangentInitial;
  let delta = positionProj - pos1.xyz; // now -> projected
  let w = posInitial1.w;
  _positionsWkGrp[wkGrpOffset + pointIdx] += vec4f(stiffness * w * delta, 0.0);
}

`;
