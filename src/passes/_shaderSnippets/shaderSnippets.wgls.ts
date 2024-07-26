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

const PI: f32 = ${Math.PI};
const FLOAT_EPSILON: f32 = 1e-7;

fn safeNormalize3(v: vec3f) -> vec3f {
  return select(
    vec3f(0., 0., 0.), // when not OK
    normalize(v), // when OK
    dot(v, v) >= FLOAT_EPSILON
  );
}

fn safeNormalize2(v: vec2f) -> vec2f {
  return select(
    vec2f(0., 0.), // when not OK
    normalize(v), // when OK
    dot(v, v) >= FLOAT_EPSILON
  );
}

fn divideCeil(a: u32, b: u32) -> u32 {
  return (a + b - 1) / b;
}

fn projectVertex(mvpMat: mat4x4f, pos: vec4f) -> vec3f {
  let posClip = mvpMat * pos;
  let posNDC = posClip / posClip.w;
  return posNDC.xyz;
}

/** https://stackoverflow.com/a/64330724 */
fn projectPointToLine(l1: vec2f, l2: vec2f, p: vec2f) -> vec2f {
  let ab = l2 - l1;
  let ac = p - l1;
  let ad = ab * dot(ab, ac) / dot(ab, ab);
  let d = l1 + ad;
  return d;
}

fn ndc2viewportPx(viewportSize: vec2f, pos: vec3f) -> vec2f {
  let pos_0_1 = pos.xy * 0.5 + 0.5; // to [0-1]
  return pos_0_1 * viewportSize.xy;
}

fn dotMax0 (n: vec3f, toEye: vec3f) -> f32 {
  return max(0.0, dot(n, toEye));
}

/**
 * Takes param 't' in range [0.0 .. 1.0] and 'maxIdx'. Returns u32 indices
 * of points before 't' and after 't' as well as the fract between these points.
 * 
 * E.g.
 * When 't=0.6' and 'maxIdx=4', it returns indices 1, 2 and the fract is 0.4.
 */
fn remapToIndices(maxIdx: u32, t: f32, outIdx: ptr<function, vec2u>) -> f32 {
  let a = t * (f32(maxIdx) - 1.);
  let a_u32 = u32(a);
  (*outIdx).x = clamp(a_u32,      0u, maxIdx - 1u);
  (*outIdx).y = clamp(a_u32 + 1u, 0u, maxIdx - 1u);
  return fract(a);
}

/** https://github.com/Scthe/WebFX/blob/09713a3e7ebaa1484ff53bd8a007908a5340ca8e/src/shaders/_utils.glsl#L41 */
fn toLuma_fromLinear(rgbCol: vec3f) -> f32 {
  let toLumaCoef = vec3f(0.2126729,  0.7151522, 0.0721750);
  return dot(toLumaCoef, rgbCol);
}

fn scissorWithViewport(viewportSize: vec2u, posPx: vec2u) -> vec2u {
  return vec2u(
    clamp(posPx.x, 0u, viewportSize.x - 1u),
    clamp(posPx.y, 0u, viewportSize.y - 1u)
  );
}

fn getDepthBin(
  binCount: u32,
  tileDepth: vec2f,
  pixelDepth: f32,
) -> u32 {
  let tileDepthSpan = abs(tileDepth.y - tileDepth.x);
  let t = (pixelDepth - tileDepth.x) / tileDepthSpan;
  return clamp(u32(t * f32(binCount)), 0u, binCount - 1u);
}

`;
