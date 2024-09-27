import { CONFIG } from '../../../constants.ts';

export const SHADER_IMPL_PROCESS_HAIR_SEGMENT = () => /* wgsl */ `

fn processHairSegment(
  params: FineRasterParams,
  tileBoundsPx: vec4u, tileDepth: vec2f,
  strandIdx: u32, segmentIdx: u32
) {
  // get pixel coordinates
  // Half-of-the-pixel offset not added as it causes problems (small random pixels around the strand)
  // https://www.sctheblog.com/blog/hair-software-rasterize/#half-of-the-pixel-offset
  let posPx = vec2f(tileBoundsPx.xy + _pixelInTilePos); // pixel coordinates wrt. viewport
  let CX0 = edgeFunction(_wkgrp_hairSegment.v01, _wkgrp_hairSegment.v00, posPx);
  let CX1 = edgeFunction(_wkgrp_hairSegment.v11, _wkgrp_hairSegment.v01, posPx);
  let CX2 = edgeFunction(_wkgrp_hairSegment.v10, _wkgrp_hairSegment.v11, posPx);
  let CX3 = edgeFunction(_wkgrp_hairSegment.v00, _wkgrp_hairSegment.v10, posPx);
  
  let isOutside = CX0 < 0 || CX1 < 0 || CX2 < 0 || CX3 < 0;
  if (isOutside) {
    return;
  }

  // https://www.sctheblog.com/blog/hair-software-rasterize/#segment-space-coordinates
  let interpW = interpolateHairQuad(_wkgrp_hairSegment, posPx);
  let t = interpW.y; // 0..1 wrt. to hair segment length: 0 is start, 1 is end
  let hairDepth: f32 = interpolateHairF32(interpW, _wkgrp_hairSegment.depthsProj);
  
  // sample depth buffer, depth test with GL_LESS
  let depthTextSamplePx: vec2i = vec2i(i32(posPx.x), i32(params.viewportSize.y - posPx.y)); // wgpu's naga requires vec2i..
  let depthBufferValue: f32 = textureLoad(_depthTexture, depthTextSamplePx, 0);
  if (hairDepth >= depthBufferValue) {
    return;
  }

  // allocate data pointer
  let nextSliceDataPtr = atomicAdd(&_wkgrp.sliceDataOffset, 1u);
  if (!_hasMoreSliceDataSlots(nextSliceDataPtr)) {
    return;
  }

  // calculate final color
  let alpha = getAlphaCoverage(interpW);
  let segmentCount = params.pointsPerStrand - 1;
  let tFullStrand = (f32(segmentIdx) + t) / f32(segmentCount);
  // var color = vec4f(1.0 - t, t, 0.0, alpha); // dbg: red at root, green at tip
  var color = _sampleShading(strandIdx, tFullStrand);
  color.a = color.a * alpha;
  
  // insert into per-slice linked list
  let sliceIdx = getSliceIdx(tileDepth, hairDepth);
  let previousPtr: u32 = _setSlicesHeadPtr(params.processorId, _pixelInTilePos, sliceIdx, nextSliceDataPtr);
  _setSliceData(params.processorId, nextSliceDataPtr, color, previousPtr);
}

fn getSliceIdx(tileDepth: vec2f, pixelDepth: f32) -> u32 {
  // reuse fn. Ignore the name
  return getDepthBin(SLICES_PER_PIXEL, tileDepth, pixelDepth);
}

fn getAlphaCoverage(interpW: vec2f) -> f32 {
  // interpW.x is in 0..1. Transform it so strand middle is 1.0 and then 0.0 at edges.
  var alpha = 1.0 - abs(interpW.x * 2. - 1.);
  if (${CONFIG.hairRender.alphaQuadratic}) { // see CONFIG docs
    alpha = sqrt(alpha);
  }
  // optimization: -0.5ms with x1.1 'fatter' strands. Fills the pixel/tiles faster
  alpha = saturate(alpha * ${CONFIG.hairRender.alphaMultipler});
  return alpha;
}

`;
