/**
 * ```
 *  forEach slice in pixel:
 *    finalColor += sliceColor * (1.0 - finalColor.a)
 * ```
 */
export const SHADER_IMPL_REDUCE_HAIR_SLICES = () => /* wgsl */ `

// TODO remove/restore debugger?
fn reduceHairSlices(
  processorId: u32,
  viewportSizeU32: vec2u,
  dbgSlicesModeMaxSlices: u32,
  tileBoundsPx: vec4u
) -> bool {
  var sliceData: SliceData;
  let posPx = tileBoundsPx.xy + _pixelInTilePos; // pixel coordinates wrt. viewport

  var finalColor = _getRasterizerResult(viewportSizeU32, posPx);
  
  // START: ITERATE SLICES (front to back)
  // We know the start/end slices from 'processHairSegment'. But iterating with consts is -0.4ms faster
  var s: u32 = 0u;
  for (; s < SLICES_PER_PIXEL; s += 1u) {
    if (isPixelDone(finalColor)) {
      // finalColor = vec4f(1., 0., 0., 1.); // dbg: highlight early out
      break;
    }

    var requiresSliceHeadClear = false;
    var slicePtr = _getSlicesHeadPtr(processorId, _pixelInTilePos, s);
    
    // aggregate colors in this slice
    while (_getSliceData(processorId, slicePtr, &sliceData)) {
      requiresSliceHeadClear = true;
      if (isPixelDone(finalColor)) { break; }
      slicePtr = sliceData.value[2];
      
      let sliceColor = vec4f(
        unpack2x16float(sliceData.value[0]),
        unpack2x16float(sliceData.value[1])
      );
      finalColor += sliceColor * (1.0 - finalColor.a);
    }

    if (requiresSliceHeadClear) {
      _clearSliceHeadPtr(processorId, _pixelInTilePos, s);
    }

    // dbg: color using only head ptrs
    /*if (slicePtr != INVALID_SLICE_DATA_PTR) {
      finalColor.g = 1.0;
      finalColor.a = 1.0;
      break;
    }*/
  } // END: ITERATE SLICES
  

  // finish remaining iterations if we "break;" early
  for(; s < SLICES_PER_PIXEL; s += 1u) {
    _clearSliceHeadPtr(processorId, _pixelInTilePos, s);
  }

  _setRasterizerResult(viewportSizeU32, posPx, finalColor);

  return isPixelDone(finalColor);
}

/** Returns true if any subsequent hair segments/slices do not matter. */
fn isPixelDone (finalColor: vec4f) -> bool {
  return finalColor.a >= ALPHA_CUTOFF;
}
`;
