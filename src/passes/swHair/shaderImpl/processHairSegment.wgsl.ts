/*
// ALT. pixels-in-tile iter for doublechecking
for (var y: u32 = 0u; y < TILE_SIZE; y += 1u) { 
for (var x: u32 = 0u; x < TILE_SIZE; x += 1u) {
  let px = vec2f(boundRectMin + vec2f(f32(x), f32(y))); // pixel coordinates wrt. viewport
  let posPx_u32 = vec2u(px);
  let pxInTile: vec2u = vec2u(x, y); // pixel coordinates wrt. tile
  (continues as normal)
}}
*/

import { CONFIG } from '../../../constants.ts';

export const SHADER_IMPL_PROCESS_HAIR_SEGMENT = () => /* wgsl */ `

fn processHairSegment(
  params: FineRasterParams,
  tileBoundsPx: vec4u, tileDepth: vec2f,
  sliceDataOffset: u32,
  strandIdx: u32, segmentIdx: u32
) -> u32 {
  var writtenSliceDataCount: u32 = 0u;
  let segmentCount = params.pointsPerStrand - 1;

  let projParams = ProjectHairParams(
    params.pointsPerStrand,
    params.viewportSize,
    params.fiberRadius,
  );
  let projSegm = projectHairSegment(
    projParams,
    strandIdx,
    segmentIdx
  );

  // bounds
  // TODO [MEDIUM] optimize bounds. Scissor based on segment0_px, segment1_px.
  let boundRectMax = vec2f(tileBoundsPx.zw);
  let boundRectMin = vec2f(tileBoundsPx.xy);

  // edgeFunction() as series of additions
  let CC0 = edgeC(projSegm.v01, projSegm.v00);
  let CC1 = edgeC(projSegm.v11, projSegm.v01);
  let CC2 = edgeC(projSegm.v10, projSegm.v11);
  let CC3 = edgeC(projSegm.v00, projSegm.v10);
  var CY0 = boundRectMin.x * CC0.A + boundRectMin.y * CC0.B + CC0.C;
  var CY1 = boundRectMin.x * CC1.A + boundRectMin.y * CC1.B + CC1.C;
  var CY2 = boundRectMin.x * CC2.A + boundRectMin.y * CC2.B + CC2.C;
  var CY3 = boundRectMin.x * CC3.A + boundRectMin.y * CC3.B + CC3.C;

  // for each pixel in tile
  for (var y: f32 = boundRectMin.y; y < boundRectMax.y; y += 1.0) {
    var CX0 = CY0;
    var CX1 = CY1;
    var CX2 = CY2;
    var CX3 = CY3;
  for (var x: f32 = boundRectMin.x; x < boundRectMax.x; x += 1.0) {
    // stop if there is no space inside processor's sliceData linked list.
    let nextSliceDataPtr: u32 = sliceDataOffset + writtenSliceDataCount; 
    
    // WARNING: this 'optimization' is slow
    // if (!_hasMoreSliceDataSlots(nextSliceDataPtr)) { return writtenSliceDataCount; }

    // get pixel coordinates
    // Half-of-the-pixel offset not added as it causes problems (small random pixels around the strand)
    // https://www.sctheblog.com/blog/hair-software-rasterize/#half-of-the-pixel-offset
    let posPx = vec2f(x, y); // pixel coordinates wrt. viewport
    let posPx_u32 = vec2u(u32(x), u32(y));
    let pxInTile: vec2u = vec2u(posPx - boundRectMin); // pixel coordinates wrt. tile

    let isOutside = CX0 < 0 || CX1 < 0 || CX2 < 0 || CX3 < 0;
    CX0 += CC0.A;
    CX1 += CC1.A;
    CX2 += CC2.A;
    CX3 += CC3.A;

    if (isOutside) {
      continue;
    }

    // https://www.sctheblog.com/blog/hair-software-rasterize/#segment-space-coordinates
    let interpW = interpolateHairQuad(projSegm, posPx);
    let t = interpW.y; // 0 .. 1
    let hairDepth: f32 = interpolateHairF32(interpW, projSegm.depthsProj);
    
    // interpW.x is in 0..1. Transform it so strand middle is 1.0 and then 0.0 at edges.
    var alpha = 1.0 - abs(interpW.x * 2. - 1.);
    if (${CONFIG.hairRender.alphaQuadratic}) { // see CONFIG docs
      alpha = sqrt(alpha);
    }
    // optimization: -0.5ms with x1.1 'fatter' strands. Fills the pixel/tiles faster
    alpha = saturate(alpha * ${CONFIG.hairRender.alphaMultipler});

    // sample depth buffer, depth test with GL_LESS
    let depthTextSamplePx: vec2i = vec2i(i32(posPx_u32.x), i32(params.viewportSize.y - y)); // wgpu's naga requiers vec2i..
    let depthBufferValue: f32 = textureLoad(_depthTexture, depthTextSamplePx, 0);
    if (hairDepth >= depthBufferValue) {
      continue;
    }

    // calculate final color
    let tFullStrand = (f32(segmentIdx) + t) / f32(segmentCount);
    // let color = vec4f(1.0 - t, t, 0.0, alpha); // red at root, green at tip
    // Either shade here and store RGBA per slice or at least
    // (strandIdx: u32, tFullStrand: f16, alpha: f16).
    // Either way it's u32 for nextSlicePtr and 2*u32 for payload.
    var color = _sampleShading(strandIdx, tFullStrand);
    color.a = color.a * alpha;
    
    // insert into per-slice linked list
    let sliceIdx = getSliceIdx(tileDepth, hairDepth);
    let previousPtr: u32 = _setSlicesHeadPtr(params.processorId, pxInTile, sliceIdx, nextSliceDataPtr);
    _setSliceData(params.processorId, nextSliceDataPtr, color, previousPtr);
    writtenSliceDataCount += 1u;
  }
  CY0 += CC0.B;
  CY1 += CC1.B;
  CY2 += CC2.B;
  CY3 += CC3.B;
  }


  // END
  return writtenSliceDataCount;
}

fn getSliceIdx(
  tileDepth: vec2f,
  pixelDepth: f32,
) -> u32 {
  return getDepthBin(SLICES_PER_PIXEL, tileDepth, pixelDepth);
}

`;
