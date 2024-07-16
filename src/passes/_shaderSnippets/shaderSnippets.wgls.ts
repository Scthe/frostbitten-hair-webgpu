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
