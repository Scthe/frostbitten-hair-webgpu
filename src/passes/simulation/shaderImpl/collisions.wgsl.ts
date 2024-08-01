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
`;
