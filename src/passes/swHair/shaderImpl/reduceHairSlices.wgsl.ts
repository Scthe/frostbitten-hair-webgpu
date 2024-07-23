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
) {
  var sliceData: SliceData;
  let boundRectMax = vec2u(tileBoundsPx.zw);
  let boundRectMin = vec2u(tileBoundsPx.xy);

  for (var y: u32 = boundRectMin.y; y < boundRectMax.y; y+=1u) {
  for (var x: u32 = boundRectMin.x; x < boundRectMax.x; x+=1u) {
    var finalColor = vec4f();
    var sliceCount = 0u;
    let px = vec2u(x, y); // pixel coordinates wrt. viewport
    let pxInTile: vec2u = vec2u(px - boundRectMin); // pixel coordinates wrt. tile
    
    // iterate slices front to back
    for (var s: u32 = 0u; s < SLICES_PER_PIXEL; s += 1u) {
      if (finalColor.a >= ALPHA_CUTOFF) { break; }
      var slicePtr = _getSlicesHeadPtr(processorId, pxInTile, s);
      
      // aggregate colors in this slice
      while (_getSliceData(processorId, slicePtr, &sliceData)) {
        if (finalColor.a >= ALPHA_CUTOFF) { break; }
        slicePtr = sliceData.value[2];
        sliceCount += 1u;
        
        let sliceColor = vec4f(
          unpack2x16float(sliceData.value[0]),
          unpack2x16float(sliceData.value[1])
        );
        finalColor += sliceColor * (1.0 - finalColor.a);
      }
    }

    // dbg: color using only head ptrs
    /*var slicePtr = _getSlicesHeadPtr(processorId, pxInTile, 0u);
    if (slicePtr != INVALID_SLICE_DATA_PTR) {
      finalColor.r = 1.0;
      finalColor.a = 1.0;
    }*/
    
    if (dbgSlicesModeMaxSlices == 0u) {
      // the prod value
      _setRasterizerResult(viewportSizeU32, px, finalColor);
    } else {
      // debug value
      let c = saturate(f32(sliceCount) / f32(dbgSlicesModeMaxSlices));
      _setRasterizerResult(viewportSizeU32, px, vec4f(c, 0., 0., 1.0));
    }
  }}
}

`;
