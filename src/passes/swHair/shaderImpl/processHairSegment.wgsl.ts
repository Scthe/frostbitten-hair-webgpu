/*
// ALT. pixels-in-tile iter for doublechecking
for (var y: u32 = 0u; y < TILE_SIZE; y += 1u) { 
for (var x: u32 = 0u; x < TILE_SIZE; x += 1u) {
  let px = vec2f(boundRectMin + vec2f(f32(x), f32(y))); // pixel coordinates wrt. viewport
  let px_u32 = vec2u(px);
  let pxInTile: vec2u = vec2u(x, y); // pixel coordinates wrt. tile
  (continues as normal)
}}
*/

export const SHADER_IMPL_PROCESS_HAIR_SEGMENT = () => /* wgsl */ `

fn processHairSegment(
  p: FineRasterParams,
  tileBoundsPx: vec4u, tileDepth: vec2f,
  sliceDataOffset: u32,
  strandIdx: u32, segmentIdx: u32
) -> u32 {
  var writtenSliceDataCount: u32 = 0u;
  let segmentCount = p.pointsPerStrand - 1;

  let swHairRasterizeParams = SwHairRasterizeParams(
    p.pointsPerStrand,
    p.viewportSize,
    p.fiberRadius,
  );
  let sw = swRasterizeHair(
    swHairRasterizeParams,
    strandIdx,
    segmentIdx
  );

  // bounds
  // TODO [NOW] optimize bounds. Scissor based on segment0_px, segment1_px.
  let boundRectMax = vec2f(tileBoundsPx.zw);
  let boundRectMin = vec2f(tileBoundsPx.xy);

  // edgeFunction() as series of additions
  let CC0 = edgeC(sw.v01, sw.v00);
  let CC1 = edgeC(sw.v11, sw.v01);
  let CC2 = edgeC(sw.v10, sw.v11);
  let CC3 = edgeC(sw.v00, sw.v10);
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
    let px = vec2f(x, y); // pixel coordinates wrt. viewport
    let px_u32 = vec2u(u32(x), u32(y));
    let pxInTile: vec2u = vec2u(px - boundRectMin); // pixel coordinates wrt. tile

    let isOutside = CX0 < 0 || CX1 < 0 || CX2 < 0 || CX3 < 0;
    CX0 += CC0.A;
    CX1 += CC1.A;
    CX2 += CC2.A;
    CX3 += CC3.A;

    if (isOutside) {
      continue;
    }

    let interpW = interpolateQuad(sw, px);
    let t = interpW.y; // 0 .. 1
    let hairDepth: f32 = interpolateHairF32(interpW, sw.depthsProj);
    // TODO [IGNORE] instead of linear, have quadratic interp? It makes strands "fatter", so user would provide lower fiber radius. Which is good for us.
    let alpha = 1.0 - abs(interpW.x * 2. - 1.); // interpW.x is in 0..1. Turn it so strand middle is 1.0 and then 0.0 at edges.

    // sample depth buffer, depth test with GL_LESS
    let depthTextSamplePx: vec2i = vec2i(i32(px_u32.x), i32(p.viewportSize.y - y)); // wgpu's naga requiers vec2i..
    let depthBufferValue: f32 = textureLoad(_depthTexture, depthTextSamplePx, 0);
    if (hairDepth >= depthBufferValue) {
      continue;
    }

    // calculate final color
    let tFullStrand = (f32(segmentIdx) + t) / f32(segmentCount);
    // let color = vec4f(1.0 - t, t, 0.0, alpha); // red at root, green at tip
    var color = _sampleShading(strandIdx, tFullStrand);
    color.a = color.a * alpha;
    let sliceIdx = getSliceIdx(tileDepth, hairDepth);

    // insert into per-slice linked list
    // WARNING: Both lines below can be slow!
    let previousPtr: u32 = _setSlicesHeadPtr(p.processorId, pxInTile, sliceIdx, nextSliceDataPtr);
    _setSliceData(p.processorId, nextSliceDataPtr, color, previousPtr);
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
