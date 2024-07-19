const MAT4 = 'mat4x4<f32>';

/** I always forget the order. */
export const GET_MVP_MAT = /* wgsl */ `
fn getMVP_Mat(modelMat: ${MAT4}, viewMat: ${MAT4}, projMat: ${MAT4}) -> ${MAT4} {
  let a = viewMat * modelMat;
  return projMat * a;
}
`;

export const NORMALS_UTILS = /* wgsl */ `

// WARNING: This is true only when you do not have scale (only rotation and transpose).
// https://paroj.github.io/gltut/Illumination/Tut09%20Normal%20Transformation.html
fn transformNormalToWorldSpace(modelMat: mat4x4f, normalV: vec3f) -> vec3f {
  let normalMatrix = modelMat; // !
  let normalWS = normalMatrix * vec4f(normalV, 0.0);
  return normalize(normalWS.xyz);
}
`;

export const GENERIC_UTILS = /* wgsl */ `

const FLOAT_EPSILON: f32 = 1e-7;

fn safeNormalize(v: vec3f) -> vec3f {
  return select(
    vec3f(0., 0., 0.), // when not OK
    normalize(v), // when OK
    length(v) >= FLOAT_EPSILON
  );
}

fn divideCeil(a: u32, b: u32) -> u32 {
  return (a + b - 1) / b;
}
`;
