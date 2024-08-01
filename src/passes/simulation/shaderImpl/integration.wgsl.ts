export const HAIR_SIM_IMPL_INTEGRATION = /* wgsl */ `

// Positions have .w as isMovable flag. 1.0 if isMovable, 0.0 if is not (strand root).
// Returned as float to avoid branching. Just multiply delta instead.
fn isMovable(p: vec4f) -> f32 { return p.w; }

/** https://en.wikipedia.org/wiki/Verlet_integration */
fn verletIntegration (
  dt: f32,
  posPrev: vec4f,
  posNow: vec4f,
  acceleration: vec3f,
) -> vec4f {
  let posNext: vec3f = (2. * posNow.xyz - posPrev.xyz) + acceleration * dt * dt;
  return vec4f(
    mix(posPrev.xyz, posNext, isMovable(posNow)),
    posNow.w
  );
}
`;
