import { CONFIG } from '../../constants.ts';
import { dgr2rad } from '../../utils/index.ts';

const CAMERA = CONFIG.camera;

const VIEWPORT_HEIGHT_OVER_DISTANCE_TO_CAMERA =
  2.0 * Math.tan(dgr2rad(CAMERA.projection.fovDgr) * 0.5); // 0.5358983848622454
// const clipInfoZ = 720 / VIEWPORT_HEIGHT_OVER_DISTANCE_TO_CAMERA; // 1343.5382907247958
// console.log({ VIEWPORT_HEIGHT_OVER_DISTANCE_TO_CAMERA, clipInfoZ });

/*
https://github.com/asylum2010/Asylum_Tutorials/blob/master/ShaderTutors/54_GTAO/
https://github.com/gkjohnson/threejs-sandbox/blob/master/gtaoPass/src/GTAOShader.js
*/
export const GTAO_SNIPPET = /* wgsl */ `

const Z_FAR: f32 = ${CAMERA.projection.far};
const Z_NEAR: f32 = ${CAMERA.projection.near};
// used to calculate distance from camera to far plane in pixel-ish space
// const VIEWPORT_HEIGHT_OVER_DISTANCE_TO_CAMERA: f32 =  ${VIEWPORT_HEIGHT_OVER_DISTANCE_TO_CAMERA};

fn reprojectPositionToVS(
  projMatrixInv: mat4x4f,
  viewport: vec2f,
  positionPx: vec2f
) -> vec3f {
  // depth
  let depth: f32 = textureLoad(_depthTexture, vec2u(positionPx), 0);

  // get the projected position from pixel coords
  let posXY_0_1 = positionPx / viewport; // XY position in range [0 .. 1]
  let posXY_neg1_1 = posXY_0_1 * 2.0 - 1.0; // XY position in range [-1 .. 1]
  let posProj = vec4f(posXY_neg1_1, depth, 1.0);
  
  // reproject to view space
  var result = projectVertex(projMatrixInv, posProj);
  result.z = linearizeDepth(depth); // range: [zNear, Z_FAR]
  return result;
}

fn gtao(
  projMatrixInv: mat4x4f,
  viewMatrix: mat4x4f,
  /** FULLRES viewport size. If AO is half res, this parameter ignores this. */
  viewport: vec2f,
  /** Position in pixels for normal and depth textures (FULLRES). If AO is half res, this parameter ignores this. */
  positionPx: vec2f,
  normalWS: vec3f,
) -> f32 {
  let params = _uniforms.ao;

  let positionVS: vec3f = reprojectPositionToVS(projMatrixInv, viewport, positionPx);
  var normalVS: vec3f = (viewMatrix * vec4f(normalWS, 1.)).xyz;
  // calculation uses left handed system
  normalVS.z = -normalVS.z;
  
  let toCamera: vec3f	= normalize(-positionVS.xyz);
  
  // test for background
  if (positionVS.z >= (0.999 * Z_FAR)) { return 0.0; } // not perfect, but close enough?
  // return 1.0; // dbg: bg test

  // scale radius with distance. I left orignal code (commented), but we can do it simplier and good enough
  // clipInfoZ := distance from camera where 1px == 1 view space unit.
  // opengl multiplies by 0.5 cause [-1, 1] depth. WebGPU has [0, 1].
  // let clipInfoZ = viewport.y / VIEWPORT_HEIGHT_OVER_DISTANCE_TO_CAMERA; // 1343.5
  // var radius = params.radius * (clipInfoZ / positionVS.z);
  // radius = max(f32(params.numSteps), radius);
  let radius = max(f32(params.numSteps), params.radius * (positionVS.z / Z_FAR));
  // return radius / (f32(params.numSteps));
  
  let stepSize = radius / f32(params.numSteps);
  var ao = 0.0;
  
  // Rotation jitter approach from
  // https://github.com/MaxwellGengYF/Unity-Ground-Truth-Ambient-Occlusion/blob/9cc30e0f31eb950a994c71866d79b2798d1c508e/Shaders/GTAO_Common.cginc#L152-L155
  let rotJitterOffset = PI * fract(52.9829189 * fract(dot(positionPx, vec2(0.06711056, 0.00583715))));
  let jitterMod = (positionPx.x + positionPx.y) * 0.25;
  let radiusJitterOffset = fract(jitterMod) * stepSize * 0.25;
  
  
  for (var i = 0u; i < params.numDirections; i++) {
    var phi = f32(i) * (PI / f32(params.numDirections)) + params.directionOffset * PI;
    phi += rotJitterOffset;
    
    var currStep = 1.0 + 0.25 * stepSize; // * STEP_OFFSET;
    currStep += radiusJitterOffset;
    
    let dir = vec3(cos(phi), sin(phi), 0.0); // sample direction in pixel space
    var horizons = vec2(-1.0);
    
    // calculate horizon angles
    for (var j = 0u; j < params.numSteps; j++) {
      let offset = round_2f(dir.xy * currStep);

      // h1
      var s = reprojectPositionToVS(projMatrixInv, viewport, positionPx + offset); // sample point
      var ws = s.xyz - positionVS.xyz; // from fragment to sample point
      var dist2 = length(ws); // distance between fragment and sample
      var cosh = dot(ws, toCamera) * inverseSqrt(dist2); // just read the HBAO paper..
      var falloff = gtaoFalloff(dist2, params.falloffStart2, params.falloffEnd2);
      horizons.x = max(horizons.x, cosh - falloff);

      // h2
      s = reprojectPositionToVS(projMatrixInv, viewport, positionPx - offset);
      ws = s.xyz - positionVS.xyz;
      dist2 = length(ws);
      cosh = dot(ws, toCamera) * inverseSqrt(dist2);
      falloff = gtaoFalloff(dist2, params.falloffStart2, params.falloffEnd2);
      horizons.y = max(horizons.y, cosh - falloff);

      // increment
      currStep += stepSize;
    }

    horizons = acos(horizons);
    
    // calculate gamma angle
    let bitangent: vec3f = normalize(cross(dir, toCamera));
    let tangent: vec3f = cross(toCamera, bitangent);
    let nx: vec3f = normalVS - bitangent * dot(normalVS, bitangent);
    
    let nnx = length(nx);
    let nnxInv = 1.0 / (nnx + 1e-6); // to avoid division with zero
    let cosxi = dot(nx, tangent) * nnxInv; // xi = gamma + HALF_PI
    let gamma = acos(cosxi) - HALF_PI;
    let cosgamma = dot(nx, toCamera) * nnxInv;
    let singamma2 = -2.0 * cosxi; // cos(x + HALF_PI) = -sin(x)
    
    // clamp to normal hemisphere
    horizons.x = gamma + max(-horizons.x - gamma, -HALF_PI);
    horizons.y = gamma + min( horizons.y - gamma,  HALF_PI);

    // Riemann integral is additive
    ao += nnx * 0.25 * (
      (horizons.x * singamma2 + cosgamma - cos(2.0 * horizons.x - gamma)) +
      (horizons.y * singamma2 + cosgamma - cos(2.0 * horizons.y - gamma))
    );
  }

  return ao / f32(params.numDirections);
}

// Who tf wrote this docs: https://www.w3.org/TR/WGSL/#round-builtin ?
fn round_f(v: f32) -> f32 { return select(ceil(v), floor(v), v < 0.5); }
fn round_2f(v: vec2f) -> vec2f {
  return vec2f(round_f(v.x), round_f(v.y));
}

fn gtaoFalloff(dist: f32, falloffStart2: f32, falloffEnd2: f32) -> f32 {
  return 2.0 * saturate(
    (dist - falloffStart2) / (falloffEnd2 - falloffStart2)
  );
}

`;
