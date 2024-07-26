/** https://github.com/Scthe/WebFX/blob/09713a3e7ebaa1484ff53bd8a007908a5340ca8e/src/shaders/_shadows.glsl */
export const SAMPLE_SHADOW_MAP = /* wgsl */ `

const IN_SHADOW = 1.0;
const NOT_IN_SHADOW = 0.0;

// TODO PCSS

/*var shadowMapDepth : f32 = textureSample(
    _shadowMapTexture,
    _shadowMapSampler,
    postionShadowSourceSpace.xy
  );
  let isInShadow = postionShadowSourceSpace.z - bias > shadowMapDepth;
  return select(NOT_IN_SHADOW, IN_SHADOW, isInShadow);*/

fn calculateDirectionalShadow(
  shadowSourcePositionWS: vec3f,
  positionWS: vec3f,
  normalWS: vec3f,
  /** positionWS that was multiplied by shadow sources $mvpMatrix
   * AKA position of fragment as rendered from light POV */
  postionShadowSourceSpace: vec3f,
  sampleRadius: u32,
  bias: f32,
) -> f32 {
  // GDC_Poster_NormalOffset.png
  let toShadowSource = normalize(shadowSourcePositionWS - positionWS);
  let actualBias: f32 = max(abs(bias) * (1.0 - dot(normalWS, toShadowSource)), 0.0005);

  // for special cases we cannot early return cause:
  // "error: 'textureSampleCompare' must only be called from uniform control flow".
  // So do the samples ALWAYS, regardless of everything
  let result = _sampleShadowMap(i32(sampleRadius), postionShadowSourceSpace, actualBias);
  
  // Special case if we went beyond the far plane of the frustum.
  // Mark no shadow, cause it's better than dark region
  // far away (or whatever relative light-camera postion is)
  if (postionShadowSourceSpace.z > 1.0) {
    return NOT_IN_SHADOW;
  }
  // would cause 'invalid' sampling, mark as no shadow too.
  if (outOfScreen(postionShadowSourceSpace.xy)) {
    return NOT_IN_SHADOW;
  }
  return result;
}

// There are following cases:
//  * fragmentDepth > shadowMapDepth
//      there exist some object that is closer to shadow source than object
//      Means object is IN SHADOW
//  * fragmentDepth == shadowMapDepth
//      this is the object that casts the shadow
//      Means NO SHADOW
//  * fragmentDepth < shadowMapDepth
//      would probably happen if object is not shadow-caster
//      Means NO SHADOW
fn _sampleShadowMap(sampleRadius: i32, lightPosProj: vec3f, bias: f32) -> f32 {
  // depth of current fragment (we multiplied by light-shadow matrix
  // in vert. shader, did w-divide here)
  let fragmentDepth = lightPosProj.z;
  let shadowTextureSize = textureDimensions(_shadowMapTexture, 0).x;
  let texelSize: vec2f = vec2f(1. / f32(shadowTextureSize));
  var shadow = 0.0;

  for (var x: i32 = -sampleRadius; x <= sampleRadius; x++) {
  for (var y: i32 = -sampleRadius; y <= sampleRadius; y++) {
    let offset = vec2f(f32(x), f32(y)) * texelSize;
    /* // The docs for this fn are even worse than for OpenGL. And that's saying something..
    let shadowMapDepth = textureSampleCompare(
      _shadowMapTexture,
      _shadowMapSampler,
      lightPosProj.xy + offset,
      fragmentDepth - bias
    );
    shadow += shadowMapDepth;*/

    var shadowMapDepth : f32 = textureSample(
      _shadowMapTexture,
      _shadowMapSampler,
      lightPosProj.xy + offset
    );
    let isInShadow = fragmentDepth - bias > shadowMapDepth;
    shadow += select(NOT_IN_SHADOW, IN_SHADOW, isInShadow);
  }
  }

  let pcfSize = f32(sampleRadius * 2 + 1);
  return shadow / (pcfSize * pcfSize);
}

`;
