/**
 * # Marschner
 *
 * - [Marschner03] http://www.graphics.stanford.edu/papers/hair/hair-sg03final.pdf
 * - [Karis16] https://blog.selfshadow.com/publications/s2016-shading-course/karis/s2016_pbs_epic_hair.pdf
 * - [Chiang16] https://benedikt-bitterli.me/pchfm/pchfm.pdf
 * - [Tafuri19] https://advances.realtimerendering.com/s2019/hair_presentation_final.pdf
 * - [Sadeghi10] http://graphics.ucsd.edu/~henrik/papers/artist_hair.pdf
 * - GPU gems chapter 23
 *
 * Additional series of posts by Voicu Alexandru–Teodor:
 * - https://hairrendering.wordpress.com/2010/06/26/marschner-shader-part-i/
 * - https://hairrendering.wordpress.com/2010/06/27/marschner-shader-part-ii/
 * - https://hairrendering.wordpress.com/2010/07/05/marschner-shader-part-iii/
 *
 */
export const SHADER_CODE_MARSCHNER = /* wgsl */ `

struct MarschnerParams {
  // https://blog.selfshadow.com/publications/s2016-shading-course/karis/s2016_pbs_epic_hair.pdf#page=44
  baseColor: vec3f,
  // scales the R term
  specular: f32,
  // shift - based on the tilt of the cuticle scales
  // \alpha_R = -2*s; \alpha_{TT} = s; \alpha_{TRT} = 4 * s
  weightTT: f32,
  weightTRT: f32,
  shift: f32,
  // hair roughness
  // \beta_R = r^2; \beta_{TT} = 0.5 * (r^2); \beta_{TRT} = 2 * (r^2)
  roughness: f32
}

fn hairSpecularMarschner(
  p: MarschnerParams,
  toLight: vec3f, // L
  toCamera: vec3f, // V
  tangent: vec3f,
) -> vec3f {
  // from [Marschner03]
  // w_i - direction of illumination (w Illumination/Incoming)
  // w_r - direction in which scattered light is being computed (w Result)
  // theta_d - difference angle (theta_r − theta_i) / 2
  // There is also 5.2.3 'Approximation for eccentricity' if you are not as lazy as me (not implemented)


  // For derivation we are following GPU gems chapter 23.
  let sin_theta_i = dot(tangent, toLight);
  let sin_theta_r = dot(tangent, toCamera);
  // TODO [MEDIUM] does sign of cos matter for us?
	let cos_theta_i = sqrt(max(0., 1. - sin_theta_i * sin_theta_i)); // Pythagorean Identity
	let cos_theta_r = sqrt(max(0., 1. - sin_theta_r * sin_theta_r));
  // Cosine-difference formula: cos(α−β) = cosα ⋅ cosβ + sinα ⋅ sinβ 
	let cos_theta_d_fullAngle = cos_theta_i * cos_theta_r + sin_theta_i * sin_theta_r;
  let cos_theta_d = cosOfHalfAngle(cos_theta_d_fullAngle); // theta_d is half angle, see above
  // GPU gems chapter 23, page 374
  let lightPerp = toLight - sin_theta_i * tangent;
	let cameraPerp = toCamera - sin_theta_r * tangent;
  let cos_phi = dot(lightPerp, cameraPerp) * inverseSqrt(length(lightPerp) * length(cameraPerp) + 1e-4);
  let cos_half_phi = cosOfHalfAngle(cos_phi);

  // For each lobe (R, TT, TRT):
  // M_p(theta_i, theta_r) - longitudinal scattering function
  // N_p(theta_i, theta_r, phi) - azimuthal scattering function

  // R: The light ray **REFLECTS** off the front of the hair fiber.
  // Not much color (smth. like specular), as the light does not penetrate strand.
  var alpha = -2.0 * p.shift;
  var beta = p.roughness * p.roughness;
  let M_r = longitudinalScattering_Gaussian(sin_theta_i, sin_theta_r, alpha, beta);
  let N_r = azimuthalScattering_R(cos_theta_d, cos_half_phi);
  // TT: The light ray **TRANSMITS THROUGH** the front of the fiber,
  // passes through the interior which colors it due to absorption
  // and then transmits through the other side.
  // Some color. Light goes through the strand once.
  alpha = p.shift;
  beta = 0.5 * p.roughness * p.roughness;
  let M_tt = longitudinalScattering_Gaussian(sin_theta_i, sin_theta_r, alpha, beta);
  let N_tt = azimuthalScattering_TT(p.baseColor, cos_theta_d, cos_phi, cos_half_phi);
  // TRT: The light ray transmits through the front of the fiber,
  // 1. **PASSES THROUGH** the colored interior.
  // 2. **REFLECTS** off the opposite side.
  // 3. **PASSES THROUGH** the interior again and transmits out the front.
  // A LOT of color. Light goes through the strand twice.
  alpha = 4.0 * p.shift;
  beta = 2.0 * p.roughness * p.roughness;
  let M_trt = longitudinalScattering_Gaussian(sin_theta_i, sin_theta_r, alpha, beta);
  let N_trt = azimuthalScattering_TRT(p.baseColor, cos_theta_d, cos_phi);

  return (p.specular * M_r * N_r) + (p.weightTT * M_tt * N_tt) + (p.weightTRT * M_trt * N_trt);
  // DBG:
  // let r = (specular * M_r * N_r);
  // return vec3f(r, 0.0, 0.0); // dbg: r
  // return M_tt * N_tt; // dbg: tt
  // return M_trt * N_trt; // dbg: trt
}

/** https://blog.selfshadow.com/publications/s2016-shading-course/karis/s2016_pbs_epic_hair.pdf#page=20 */
fn cosOfHalfAngle(cosAngle: f32) -> f32 {
  return sqrt(saturate(0.5 + 0.5 * cosAngle));
}

const SQRT_TWO_PI: f32 = ${Math.sqrt(2 * Math.PI)};
/** Index of refraction for human hair */
const ETA = 1.55;
const HAIR_F0 = (1. - ETA) * (1. - ETA) / ((1. + ETA) * (1. + ETA));

// Beta is based on the roughness of the fiber
// Alpha is based on the tilt of the cuticle scales
/** https://blog.selfshadow.com/publications/s2016-shading-course/karis/s2016_pbs_epic_hair.pdf#page=18 */
fn longitudinalScattering_Gaussian(
  sin_theta_i: f32, sin_theta_r: f32,
  alpha: f32, beta: f32
) -> f32 {
  let a = sin_theta_i + sin_theta_r - alpha; // sin(theta_i) + sin(theta_r) - alpha;
  let b = -(a * a) / (2.0 * beta * beta);
  return exp(b) / (beta * SQRT_TWO_PI);
}

/** https://blog.selfshadow.com/publications/s2016-shading-course/karis/s2016_pbs_epic_hair.pdf#page=20 */
fn azimuthalScattering_R(cos_theta_d: f32, cos_half_phi: f32) -> f32 {
  let attenuation = FresnelSchlick1(cos_theta_d, HAIR_F0);
  return 0.25 * cos_half_phi * attenuation;
}

/** https://blog.selfshadow.com/publications/s2016-shading-course/karis/s2016_pbs_epic_hair.pdf#page=23 */
fn azimuthalScattering_TT(
  baseColor: vec3f,
  cos_theta_d: f32, 
  cos_phi: f32,
  cos_half_phi: f32,
) -> vec3f {
  let eta_prime = (1.19 / cos_theta_d) + (0.36 * cos_theta_d); // slide 26
  let a = 1.0 / eta_prime; // slide 25, should be an alpha, but 'a' is less confusing
  let h_TT = (1.0 + a * (0.6 - 0.8 * cos_phi)) * cos_half_phi; // slide 25

  // slide 28: absorption term
  let T_powNum = sqrt(1.0 - h_TT * h_TT * a * a);
  let T_powDenum = 2.0 * cos_theta_d;
  let T_TT = pow(baseColor, vec3f(T_powNum / T_powDenum));
  // slide 29: distribution
  let D_TT = exp(-3.65 * cos_phi - 3.98);
  // slide 25
  let f_angle = cos_theta_d * sqrt(saturate(1.0 - h_TT * h_TT));
	let f = FresnelSchlick1(f_angle, HAIR_F0);
	let f_TT = (1.0 - f) * (1.0 - f); // there is also F(...)^{p-1}, but we can skip
	
	return f_TT * T_TT * D_TT; // slide 23
}

/** https://blog.selfshadow.com/publications/s2016-shading-course/karis/s2016_pbs_epic_hair.pdf#page=32 */
fn azimuthalScattering_TRT(
  baseColor: vec3f,
  cos_theta_d: f32, 
  cos_phi: f32,
) -> vec3f {
  // slide 32: absorption term
  let T_TRT = pow(baseColor, vec3f(0.8 / cos_theta_d));
  // slide 32: distribution
  let D_TRT = exp(17.0 * cos_phi - 16.78);
  // slide 32
  // const h_TRT = ${Math.sqrt(3) / 2.0}; // slide 32
  // const f_angleMod_TRT = Math.sqrt(1.0 - h_TRT * h_TRT); // similar as for f_angle in TT
  let f_angle = cos_theta_d * 0.5; // substituted value from f_angleMod_TRT. It's literary 'Math.sqrt(1 - 3/4)'
	let f = FresnelSchlick1(f_angle, HAIR_F0);
  let f_TRT = (1.0 - f) * (1.0 - f) * f; // las multiply by 'f' cause F(...)^{p-1}
	
  return f_TRT * T_TRT * D_TRT; // like slide 23
}

`;
