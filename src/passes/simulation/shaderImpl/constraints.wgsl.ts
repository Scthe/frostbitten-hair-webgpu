export const HAIR_SIM_IMPL_CONSTRANTS = /* wgsl */ `

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
`;
