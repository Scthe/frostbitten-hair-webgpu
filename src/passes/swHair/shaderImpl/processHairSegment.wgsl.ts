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
  fiberRadiusPx: ptr<function, f32>,
  strandIdx: u32, segmentIdx: u32
) -> u32 {
  var writtenSliceDataCount: u32 = 0u;

  // project segment's start and end points
  let segment0_obj: vec3f = _getHairPointPosition(p.pointsPerStrand, strandIdx, segmentIdx    ).xyz;
  let segment1_obj: vec3f = _getHairPointPosition(p.pointsPerStrand, strandIdx, segmentIdx + 1).xyz;
  let segment0_proj: vec3f = projectVertex(p.mvpMat, vec4f(segment0_obj, 1.0));
  let segment1_proj: vec3f = projectVertex(p.mvpMat, vec4f(segment1_obj, 1.0));
  let segment0_px: vec2f = ndc2viewportPx(p.viewportSize, segment0_proj);
  let segment1_px: vec2f = ndc2viewportPx(p.viewportSize, segment1_proj);
  let segmentLength = length(segment1_px - segment0_px);
  let tangent_proj = safeNormalize2(segment1_px - segment0_px);

 if ((*fiberRadiusPx) < 0.0) {
  *fiberRadiusPx = calculateFiberRadius(p, segment0_obj, segment0_px);
 }

  // fix subpixel projection errors at the start/end of the segment.
  // there are tiny edge cases where valid pixel will be projected 'outside' the 0-1
  // so we enlarge segment near start-end. Unless it's strand tip
  let segmentCount = p.pointsPerStrand - 1;
  let isLastSegment = segmentIdx >= (segmentCount - 1);
  let rasterErrMarginStart = 3.0;
  let rasterErrMarginEnd = select(rasterErrMarginStart, 0.0, isLastSegment);

  // bounds
  // TODO optimize bounds. Scissor based on segment0_px, segment1_px.
  // let segmentRectMax = ceil(max(segment0_px, segment1_px));
  // let segmentRectMin = floor(min(segment0_px, segment1_px));
  // scissor
  // let segmentScissorRectMax = min(segmentRectMax, tileBoundsPx.zw);
  // let segmentScissorRectMin = max(segmentRectMin, tileBoundsPx.xy);
  let boundRectMax = vec2f(tileBoundsPx.zw);
  let boundRectMin = vec2f(tileBoundsPx.xy);

  for (var y: f32 = boundRectMin.y; y < boundRectMax.y; y += 1.0) {
  for (var x: f32 = boundRectMin.x; x < boundRectMax.x; x += 1.0) {
    // stop if there is no space inside processor's sliceData linked list.
    let nextSliceDataPtr: u32 = sliceDataOffset + writtenSliceDataCount; 
    if (!_hasMoreSliceDataSlots(nextSliceDataPtr)) { return writtenSliceDataCount; } // TODO this 'optimization' is slow? +0.5ms ..

    // get pixel coordinates
    let px = vec2f(x, y); // pixel coordinates wrt. viewport
    let px_u32 = vec2u(u32(x), u32(y));
    let pxInTile: vec2u = vec2u(px - boundRectMin); // pixel coordinates wrt. tile

    // project the pixel onto a line between segment's start and end points
    let pxOnSegment = projectPointToLine(segment0_px, segment1_px, px);
    
    // find the 't' where: 'pxOnSegment = segmentStart + t * tangent'.
    // Just like in ray tracing's ray definition
    let segmentStartTowardPixel: vec2f = pxOnSegment - segment0_px.xy;
    let segmentEndTowardPixel: vec2f = pxOnSegment - segment1_px.xy;
    // TBH no point normalizing tangent_proj if we divide by 'segmentLength' here
    let t: f32 = saturate(max(
      segmentStartTowardPixel.x / tangent_proj.x,
      segmentStartTowardPixel.y / tangent_proj.y
    ) / segmentLength);
    var isInsideSegment = (t >= 0 && t <= 1.0) ||
      length(segmentStartTowardPixel) < rasterErrMarginStart || 
      length(segmentEndTowardPixel  ) < rasterErrMarginEnd;

    let distToStrandPx = length(pxOnSegment - px);
    // let distToStrand_0_1 = distToStrandPx / f32(TILE_SIZE); // dbg
    let alpha = saturate(1.0 - distToStrandPx / (*fiberRadiusPx));
    
    if (!isInsideSegment || alpha <= (1.0 - ALPHA_CUTOFF)){
      continue;
    }
      
    let hairDepth: f32 = mix(segment0_proj.z, segment1_proj.z, t);

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

    // dbg
    // _setRasterizerResult(p.viewportSizeU32, px_u32, vec4f(1.0, 0.0, 0.0, 1.0));
    // _setRasterizerResult(p.viewportSizeU32, px_u32, vec4f(1.0, 0.0, 0.0, alpha));
    // _setRasterizerResult(p.viewportSizeU32, px_u32, vec4f(t, 0.0, 0.0, 1.0));
    // _setRasterizerResult(p.viewportSizeU32, px_u32, vec4f(distToStrand_0_1, 0.0, 0.0, 1.0));
    // _setRasterizerResult(p.viewportSizeU32, px_u32, vec4f(-tangent_proj.xy, 0.0, 1.0));

    // insert into per-slice linked list
    // WARNING: Both lines below can be slow!
    let previousPtr: u32 = _setSlicesHeadPtr(p.processorId, pxInTile, sliceIdx, nextSliceDataPtr);
    _setSliceData(p.processorId, nextSliceDataPtr, color, previousPtr);
    writtenSliceDataCount += 1u;
  }}

  // debugColorPointInTile(tileBoundsPx, segment0_px, vec4f(0.0, 1.0, 0.0, 1.0));
  // debugColorPointInTile(tileBoundsPx, segment1_px, vec4f(0.0, 0.0, 1.0, 1.0));
  return writtenSliceDataCount;
}

fn getSliceIdx(
  tileDepth: vec2f,
  pixelDepth: f32,
) -> u32 {
  let tileDepthSpan = tileDepth.y - tileDepth.x;
  let t = (pixelDepth - tileDepth.x) / tileDepthSpan;
  return u32(clamp(t * SLICES_PER_PIXEL_f32, 0.0, SLICES_PER_PIXEL_f32));
}

fn calculateFiberRadius(
  p: FineRasterParams,
  point0_obj: vec3f,
  point0_px: vec2f,
) -> f32 {
  // We measure difference in pixels between original point and one $fiberRadius afar from it
  var radiusTestVP =  p.modelViewMat * vec4f(point0_obj, 1.0);
  radiusTestVP.y = radiusTestVP.y + p.fiberRadius;
  let radiusTest_proj = projectVertex(p.projMat, radiusTestVP);
  let radiusTest_px: vec2f = ndc2viewportPx(p.viewportSize, radiusTest_proj); // projected $fiberRadius's pixel
  
  // difference. It's one dimensional (we moved in Y-axis), so no need for length, just abs()
  return abs(radiusTest_px.y - point0_px.y);
}

`;
