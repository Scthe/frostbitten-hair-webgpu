import { BUFFER_HAIR_DATA } from '../../scene/hair/hairDataBuffer.ts';
import { BUFFER_HAIR_POINTS_POSITIONS } from '../../scene/hair/hairPointsPositionsBuffer.ts';
import { BUFFER_HAIR_TANGENTS } from '../../scene/hair/hairTangentsBuffer.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import * as SHADER_SNIPPETS from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { SW_RASTERIZE_HAIR } from './shaderImpl/swRasterizeHair.wgsl.ts';
import { BUFFER_HAIR_TILES_RESULT } from './shared/hairTilesResultBuffer.ts';
import { BUFFER_HAIR_TILE_SEGMENTS } from './shared/hairTileSegmentsBuffer.ts';
import { SHADER_TILE_UTILS } from './shaderImpl/tileUtils.wgsl.ts';
import { CONFIG } from '../../constants.ts';
import { BUFFER_SEGMENT_COUNT_PER_TILE } from './shared/segmentCountPerTileBuffer.ts';

/*
1) I've also tested per-strand dispatch version - https://github.com/Scthe/frostbitten-hair-webgpu/blob/d6306a69ab1cde4ef1321fc98c2040fd64ccac37/src/passes/swHair/hairTilesPass.perStrand.wgsl.ts .
   It is slower and harder to optimize. Not sure why.
2) Software rasterization in this shader is slower if you "optimize" edge function into "A*x + B*y + C".
   I've left commented-out implementation if you want to try


TODO [MEDIUM] try workgroup shared for positions and tangents arrays. Probably after you remove strand-based impl.
*/

export const SHADER_PARAMS = {
  workgroupSizeX: 4, // TODO [LOW] set even better values? Current seem OK.
  // A bit inefficient if strand has less points. But it's not THAT inefficient suprisingly?
  // A lot of combinations of XY sizes result in 2.2-2.3ms.
  // TODO [MEDIUM] use CONFIG.pointsPerStrand, though does not matter for current asset.
  workgroupSizeY: 32,
  bindings: {
    renderUniforms: 0,
    hairData: 1,
    hairPositions: 2,
    hairTangents: 3,
    tilesBuffer: 4,
    depthTexture: 5,
    tileSegmentsBuffer: 6,
    segmentCountPerTileBuffer: 7,
  },
};

///////////////////////////
/// SHADER CODE
///////////////////////////
const c = SHADER_PARAMS;
const b = SHADER_PARAMS.bindings;

export const SHADER_CODE = () => /* wgsl */ `


${SHADER_SNIPPETS.GET_MVP_MAT}
${SHADER_SNIPPETS.GENERIC_UTILS}
${SW_RASTERIZE_HAIR}
${SHADER_TILE_UTILS}

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}
${BUFFER_HAIR_DATA(b.hairData)}
${BUFFER_HAIR_POINTS_POSITIONS(b.hairPositions)}
${BUFFER_HAIR_TANGENTS(b.hairTangents)}
${BUFFER_HAIR_TILES_RESULT(b.tilesBuffer, 'read_write')}
${BUFFER_HAIR_TILE_SEGMENTS(b.tileSegmentsBuffer, 'read_write')}
${BUFFER_SEGMENT_COUNT_PER_TILE(b.segmentCountPerTileBuffer, 'read_write')}

@group(0) @binding(${b.depthTexture})
var _depthTexture: texture_depth_2d;

const INVALID_TILES_PER_SEGMENT_THRESHOLD = ${
  CONFIG.hairRender.invalidTilesPerSegmentThreshold
}u;

@compute
@workgroup_size(${c.workgroupSizeX}, ${c.workgroupSizeY}, 1)
fn main(
  @builtin(global_invocation_id) global_id: vec3<u32>,
) {
  let viewportSize: vec2f = _uniforms.viewport.xy;
  let viewportSizeU32: vec2u = vec2u(viewportSize);
  let maxDrawnSegments: u32 = _uniforms.maxDrawnHairSegments;
  let mvMatrix = _uniforms.modelViewMat;
  let projMatrixInv = _uniforms.projMatrixInv;
  let strandsCount: u32 = _hairData.strandsCount;
  let pointsPerStrand: u32 = _hairData.pointsPerStrand;

  let strandIdx = global_id.x;
  let segmentIdx = global_id.y; // [0...31]
  
  // There are 32 points but only 31 segments. Dispatching 1 per point is suboptimal..
  // Discard 32th last invocation (so idx 31)
  if (segmentIdx >= pointsPerStrand - 1) { return; }
  if (strandIdx >= strandsCount) { return; }

  // get rasterize data
  let projParams = ProjectHairParams(
    pointsPerStrand,
    viewportSize,
    _uniforms.fiberRadius
  );
  let projSegm = projectHairSegment(
    projParams,
    strandIdx,
    segmentIdx
  );

  let hairDepthBoundsVS = getHairDepthBoundsVS(mvMatrix);

  // get segment bounds and convert to tiles
  let bounds4f = getRasterizedHairBounds(projSegm, viewportSize);
  let boundRectMin = bounds4f.xy;
  let boundRectMax = bounds4f.zw;
  let tileMinXY: vec2u = getHairTileXY_FromPx(vec2u(boundRectMin));
  let tileMaxXY: vec2u = getHairTileXY_FromPx(vec2u(boundRectMax));
  // reject degenerate strands from physics simulation.
  // If parts of the strand disappear, this is probably the cause.
  // Number tuned for Sintel's front hair lock
  let tileSize = (tileMaxXY - tileMinXY) + vec2u(1u, 1u);
  if (tileSize.x * tileSize.y > INVALID_TILES_PER_SEGMENT_THRESHOLD) {
    return;
  } 

  // for each affected tile
  // We could calculate affected tiles analytically, but we have to rasterize to test depth buffer.
  // But you can probably do some optimizations by calculating where the strand edge crosses the tile bounds.
  // Having tileMinXY + tileMaxXY iteration means we test all tiles in a rectangle.
  // Could use early out for diagonal segments.
  for (var tileY: u32 = tileMinXY.y; tileY <= tileMaxXY.y; tileY += 1u) {
  for (var tileX: u32 = tileMinXY.x; tileX <= tileMaxXY.x; tileX += 1u) {
    processTile(
      projSegm,
      viewportSizeU32,
      projMatrixInv,
      maxDrawnSegments,
      hairDepthBoundsVS,
      vec2u(tileX, tileY),
      strandIdx, segmentIdx
    );
  }}
}


fn processTile(
  projSegm: ProjectedHairSegment,
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
  let CC0 = edgeC(projSegm.v01, projSegm.v00);
  let CC1 = edgeC(projSegm.v11, projSegm.v01);
  let CC2 = edgeC(projSegm.v10, projSegm.v11);
  let CC3 = edgeC(projSegm.v00, projSegm.v10);
  var CY0 = f32(boundsMin.x) * CC0.A + f32(boundsMin.y) * CC0.B + CC0.C;
  var CY1 = f32(boundsMin.x) * CC1.A + f32(boundsMin.y) * CC1.B + CC1.C;
  var CY2 = f32(boundsMin.x) * CC2.A + f32(boundsMin.y) * CC2.B + CC2.C;
  var CY3 = f32(boundsMin.x) * CC3.A + f32(boundsMin.y) * CC3.B + CC3.C;*/

  // iterate over all pixels in the tile
  for (var y: u32 = boundsMin.y; y < boundsMax.y; y += 1u) {
  // var CX0 = CY0; var CX1 = CY1; var CX2 = CY2; var CX3 = CY3;
  for (var x: u32 = boundsMin.x; x < boundsMax.x; x += 1u) {
      // You should NEVER multi-sample hair with Frostbite's technique.
      // Just make sure you understand the interaction with hardware rasterizer (through depth-buffer).
      // https://www.sctheblog.com/blog/hair-software-rasterize/#half-of-the-pixel-offset
      let posPx = vec2f(f32(x), f32(y)); // + vec2f(0.5); // Removed after testing. Causes tiny z-fighting like artefacts
      let C0 = edgeFunction(projSegm.v01, projSegm.v00, posPx);
      let C1 = edgeFunction(projSegm.v11, projSegm.v01, posPx);
      let C2 = edgeFunction(projSegm.v10, projSegm.v11, posPx);
      let C3 = edgeFunction(projSegm.v00, projSegm.v10, posPx);

      if (C0 >= 0 && C1 >= 0 && C2 >= 0 && C3 >= 0) { // if (CX0 >= 0 && CX1 >= 0 && CX2 >= 0 && CX3 >= 0) {
        // https://www.sctheblog.com/blog/hair-software-rasterize/#segment-space-coordinates
        let interpW = interpolateHairQuad(projSegm, posPx);
        // let value = 0xffff00ffu;
        // let value = debugBarycentric(vec4f(interpW.xy, 0.1, 0.));
        // storeResult(viewportSize, p_u32, value);
        
        let hairDepth: f32 = interpolateHairF32(interpW, projSegm.depthsProj);
        
        // sample depth buffer
        let depthTextSamplePx: vec2i = vec2i(i32(x), i32(viewportSize.y - y)); // wgpu's naga requiers vec2i..
        let depthBufferValue: f32 = textureLoad(_depthTexture, depthTextSamplePx, 0);

        if (hairDepth > depthBufferValue) { // depth test with GL_LESS
          continue;
        }

        // get depth bin based on view-space depth
        let hairDepthVS: vec3f = projectVertex(projMatrixInv, vec4f(posPx, hairDepth, 1.0));
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

    // store for sorting
    _incTileSegmentCount(viewportSize, tileXY);
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
