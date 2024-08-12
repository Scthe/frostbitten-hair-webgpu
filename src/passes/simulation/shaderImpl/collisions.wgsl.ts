export const HAIR_SIM_IMPL_COLLISIONS = /* wgsl */ `

// assumes sphere is in object space!
fn applyCollisionsSphere (
  stiffness: f32,
  sphere: vec4f,
  pos: ptr<function, vec4f>,
) {
  let p = (*pos).xyz;
  let v = p - sphere.xyz; // from sphere to point

  // calculate distance from sphere shell to the point
  // if POSITIVE: point does not collide
  // if NEGATIVE: point inside the sphere, resolve collision
  let dist = length(v) - sphere.w;
  let distToShell = max(0.0, -dist);

  // apply resolution
  (*pos) += vec4f(normalize(v) * distToShell * stiffness , 0.0);
}

// We could get these from uniforms, but why bother?
const SDF_CELL_SIZE = 0.0033918858971446753;
const SDF_SAMPLE_GRAD_OFFSET = SDF_CELL_SIZE * 0.1;

fn applyCollisionsSdf (
  stiffness: f32,
  sdfBoundsMin: vec3f,
  sdfBoundsMax: vec3f,
  sdfOffset: f32,
  pos: ptr<function, vec4f>,
) {
  let p = (*pos).xyz;

  // negative distance - collision. Positive distance - OK.
  let sdfDistance = sampleSDFCollider(sdfBoundsMin, sdfBoundsMax, p.xyz);
  let sdfDistanceWithOffset = sdfDistance + sdfOffset;
  if (sdfDistanceWithOffset >= 0) { return; }

  // calculate gradient
  // https://github.com/GPUOpen-Effects/TressFX/blob/ba0bdacdfb964e38522fda812bf23169bc5fa603/src/Shaders/TressFXSDFCollision.hlsl#L559
  // let correctionDir = vec3f(0., 0., 1.); // dbg: hardcoded forward
  var correctionDir = vec3f(0., 0., 0.);
  correctionDir.x = sampleSDFCollider(
    sdfBoundsMin, sdfBoundsMax,
    p.xyz + SDF_SAMPLE_GRAD_OFFSET * vec3f(1., 0., 0.)
  );
  correctionDir.y = sampleSDFCollider(
    sdfBoundsMin, sdfBoundsMax,
    p.xyz + SDF_SAMPLE_GRAD_OFFSET * vec3f(0., 1., 0.)
  );
  correctionDir.z = sampleSDFCollider(
    sdfBoundsMin, sdfBoundsMax,
    p.xyz + SDF_SAMPLE_GRAD_OFFSET * vec3f(0., 0., 1.)
  );
  correctionDir = correctionDir - vec3f(sdfDistance, sdfDistance, sdfDistance);
  
  // apply resolution
  let correction: vec3f = -sdfDistanceWithOffset * normalize(correctionDir);
  (*pos) += vec4f(correction * stiffness , 0.0);
}

`;
