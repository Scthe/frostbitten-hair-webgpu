export const TILE_PASSES_BINDINGS = {
  renderUniforms: 0,
  hairData: 1,
  hairPositions: 2,
  hairTangents: 3,
  tilesBuffer: 4,
  depthTexture: 5,
  tileSegmentsBuffer: 6,
};

///////////////////////////
/// SHADER CODE
///////////////////////////

export const TILE_PASSES_SHARED = /* wgsl */ `

fn processTile(
  sw: SwRasterizedHair,
  viewportSize: vec2u,
  projMatrixInv: mat4x4f,
  maxDrawnSegments: u32,
  hairDepthBoundsVS: vec2f,
  tileXY: vec2u,
  strandIdx: u32, segmentIdx: u32
) {
  let bounds = getTileBoundsPx(viewportSize, tileXY);
  let boundsMin = bounds.xy;
  let boundsMax = bounds.zw;

  var depthMin =  999.0; // in proj. space, so *A BIT* overkill
  var depthMax = -999.0; // in proj. space, so *A BIT* overkill
  var depthBin = TILE_DEPTH_BINS_COUNT;

  /*// edgeFunction() as series of additions
  // For some reason this is SLOWER than repeated calling of edgeFunction()?! I assume too much registers spend on this..
  let CC0 = edgeC(sw.v01, sw.v00);
  let CC1 = edgeC(sw.v11, sw.v01);
  let CC2 = edgeC(sw.v10, sw.v11);
  let CC3 = edgeC(sw.v00, sw.v10);
  var CY0 = f32(boundsMin.x) * CC0.A + f32(boundsMin.y) * CC0.B + CC0.C;
  var CY1 = f32(boundsMin.x) * CC1.A + f32(boundsMin.y) * CC1.B + CC1.C;
  var CY2 = f32(boundsMin.x) * CC2.A + f32(boundsMin.y) * CC2.B + CC2.C;
  var CY3 = f32(boundsMin.x) * CC3.A + f32(boundsMin.y) * CC3.B + CC3.C;*/

  // iterate over all pixels in the tile
  for (var y: u32 = boundsMin.y; y < boundsMax.y; y += 1u) {
  // var CX0 = CY0; var CX1 = CY1; var CX2 = CY2; var CX3 = CY3;
  for (var x: u32 = boundsMin.x; x < boundsMax.x; x += 1u) {
      let p = vec2f(f32(x), f32(y));
      let C0 = edgeFunction(sw.v01, sw.v00, p);
      let C1 = edgeFunction(sw.v11, sw.v01, p);
      let C2 = edgeFunction(sw.v10, sw.v11, p);
      let C3 = edgeFunction(sw.v00, sw.v10, p);

      if (C0 >= 0 && C1 >= 0 && C2 >= 0 && C3 >= 0) { // if (CX0 >= 0 && CX1 >= 0 && CX2 >= 0 && CX3 >= 0) {
        let p_u32 = vec2u(x, y);
        let interpW = interpolateQuad(sw, p);
        // let value = 0xffff00ffu;
        // let value = debugBarycentric(vec4f(interpW.xy, 0.1, 0.));
        // storeResult(viewportSize, p_u32, value);
        
        let hairDepth: f32 = interpolateHairF32(interpW, sw.depthsProj);
        
        // sample depth buffer
        let depthTextSamplePx: vec2i = vec2i(i32(x), i32(viewportSize.y - y)); // wgpu's naga requiers vec2i..
        let depthBufferValue: f32 = textureLoad(_depthTexture, depthTextSamplePx, 0);

        if (hairDepth > depthBufferValue) { // depth test with GL_LESS
          continue;
        }

        // get depth bin based on view-space depth
        let hairDepthVS: vec3f = projectVertex(projMatrixInv, vec4f(p, hairDepth, 1.0));
        // view space means Z is reversed. But we want bin 0 to be close etc.
        // So we invert the bin idx.
        let hairDepthBin = (TILE_DEPTH_BINS_COUNT - 1u) - getDepthBin(TILE_DEPTH_BINS_COUNT, hairDepthBoundsVS, hairDepthVS.z);

        // store px result
        depthMin = min(depthMin, hairDepth);
        depthMax = max(depthMax, hairDepth);
        depthBin = min(depthBin, hairDepthBin); // closest bin
      }

      // move to next pixel
      // CX0 += CC0.A; CX1 += CC1.A; CX2 += CC2.A; CX3 += CC3.A;
  }
  // CY0 += CC0.B; CY1 += CC1.B; CY2 += CC2.B; CY3 += CC3.B;
  } // end xy-iter

  // no tile px passes
  if (depthMin > 1.0) {
    return;
  }
  
  // store the result
  let nextPtr = atomicAdd(&_hairTileSegments.drawnSegmentsCount, 1u);
  // If we run out of space to store the fragments we lose them
  if (nextPtr < maxDrawnSegments) {
    let prevPtr = _storeTileHead(
      viewportSize,
      tileXY, depthBin,
      depthMin, depthMax,
      nextPtr
    );
    _storeTileSegment(
      nextPtr, prevPtr,
      strandIdx, segmentIdx
    );
  }
}


/** NOTE: This is view space. View space is weird. Expect inverted z-axis etc. */
fn getHairDepthBoundsVS(mvMat: mat4x4f) -> vec2f {
  let bs = _hairData.boundingSphere;
  let bsCenterVS = mvMat * vec4f(bs.xyz, 1.0);
  return vec2f(bsCenterVS.z - bs.w, bsCenterVS.z + bs.w);
}

/** NOTE: if you want to store color for .png file, it's in ABGR format */
/*fn storeResult(viewportSize: vec2u, posPx: vec2u, value: u32) {
  // bitcast<u32>(value); <- if needed
  if(
    posPx.x < 0 || posPx.x >= viewportSize.x ||
    posPx.y < 0 || posPx.y >= viewportSize.y
  ) {
    return;
  }
  let y = viewportSize.y - posPx.y; // invert cause WebGPU coordinates
  let idx: u32 = y * viewportSize.x + posPx.x;
  // WebGPU clears to 0. So atomicMin is pointless..
  atomicMax(&_hairTilesResult[idx], value);
}*/
`;
