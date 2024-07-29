export const TEXTURE_AO = (binding: number) => /* wgsl */ `

@group(0) @binding(${binding})
var _aoTexture: texture_2d<f32>;

// TODO add blur bass or at least bilinear sampling to smooth AO out
fn sampleAo(viewport: vec2f, positionPx: vec2f) -> f32 {
  let aoTexSize = textureDimensions(_aoTexture);
  let t = positionPx.xy / viewport.xy;
  let aoSamplePx = vec2i(vec2f(aoTexSize) * t);
  return textureLoad(_aoTexture, aoSamplePx, 0).r;
}
`;
