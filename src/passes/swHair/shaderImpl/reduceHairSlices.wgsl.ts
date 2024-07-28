/**
 * ```
 * forEach pixel in tile:
 *    forEach slice in pixel:
 *        finalColor += sliceColor * (1.0 - finalColor.a)
 * ```
 */
export const SHADER_IMPL_REDUCE_HAIR_SLICES = () => /* wgsl */ `

fn reduceHairSlices(
  processorId: u32,
  viewportSizeU32: vec2u,
  dbgSlicesModeMaxSlices: u32,
  tileBoundsPx: vec4u
) -> bool {
  let isDbgSliceCnt = dbgSlicesModeMaxSlices != 0u;
  var sliceData: SliceData;
  var allPixelsDone = true;
  let boundRectMax = vec2u(tileBoundsPx.zw);
  let boundRectMin = vec2u(tileBoundsPx.xy);

  for (var y: u32 = boundRectMin.y; y < boundRectMax.y; y += 1u) {
  for (var x: u32 = boundRectMin.x; x < boundRectMax.x; x += 1u) {
    let px = vec2u(x, y); // pixel coordinates wrt. viewport
    let pxInTile: vec2u = vec2u(px - boundRectMin); // pixel coordinates wrt. tile

    var finalColor = _getRasterizerResult(viewportSizeU32, px);
    var sliceCount = select(0u, u32(finalColor.r * f32(dbgSlicesModeMaxSlices)), isDbgSliceCnt); // debug value
    
    // START: ITERATE SLICES (front to back)
    var s: u32 = 0u;
    for (; s < SLICES_PER_PIXEL; s += 1u) {
      if (isPixelDone(finalColor) && !isDbgSliceCnt) {
        // finalColor = vec4f(1., 0., 0., 1.);
        break;
      }

      var requiresSliceHeadClear = false;
      var slicePtr = _getSlicesHeadPtr(processorId, pxInTile, s);
      
      // aggregate colors in this slice
      while (_getSliceData(processorId, slicePtr, &sliceData)) {
        requiresSliceHeadClear = true;
        if (isPixelDone(finalColor)) { break; }
        slicePtr = sliceData.value[2];
        sliceCount += 1u;
        
        let sliceColor = vec4f(
          unpack2x16float(sliceData.value[0]),
          unpack2x16float(sliceData.value[1])
        );
        finalColor += sliceColor * (1.0 - finalColor.a);
      }

      if (requiresSliceHeadClear) {
        _clearSliceHeadPtr(processorId, pxInTile, s);
      }
    } // END: ITERATE SLICES
    
    // finish remaining iterations if we break; early
    for(; s < SLICES_PER_PIXEL; s += 1u) {
      _clearSliceHeadPtr(processorId, pxInTile, s);
    }

    // dbg: color using only head ptrs
    /*var slicePtr = _getSlicesHeadPtr(processorId, pxInTile, 0u);
    if (slicePtr != INVALID_SLICE_DATA_PTR) {
      finalColor.r = 1.0;
      finalColor.a = 1.0;
    }*/

    allPixelsDone = allPixelsDone && isPixelDone(finalColor);
    
    // final write
    if (isDbgSliceCnt) { // debug value
      let c = saturate(f32(sliceCount) / f32(dbgSlicesModeMaxSlices));
      finalColor = vec4f(c, 0., 0., 1.0);
    }
    _setRasterizerResult(viewportSizeU32, px, finalColor);
  }}

  return allPixelsDone;
}

/** Returns true, if any subsequent hair segments/slices do not matter. */
fn isPixelDone (finalColor: vec4f) -> bool {
  return finalColor.a >= ALPHA_CUTOFF;
}
`;
