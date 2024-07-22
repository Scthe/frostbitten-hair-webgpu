import { BUFFER_HAIR_DATA } from '../../scene/hair/hairDataBuffer.ts';
import { BUFFER_HAIR_POINTS_POSITIONS } from '../../scene/hair/hairPointsPositionsBuffer.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import * as SHADER_SNIPPETS from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { BUFFER_HAIR_TILES_RESULT } from './shared/hairTilesResultBuffer.ts';
import { BUFFER_HAIR_TILE_SEGMENTS } from './shared/hairTileSegmentsBuffer.ts';
import { BUFFER_HAIR_RASTERIZER_RESULTS } from './shared/hairRasterizerResultBuffer.ts';
import { CONFIG } from '../../constants.ts';
import { BUFFER_HAIR_SLICES_HEADS } from './shared/hairSliceHeadsBuffer.ts';
import { BUFFER_HAIR_SLICES_DATA } from './shared/hairSlicesDataBuffer.ts';

export const SHADER_PARAMS = {
  // workgroupSizeX: Math.max(CONFIG.hairRender.processorCount, 32), // TODO [LOW] set better values. TBH what about 1? The threads WILL diverge..
  workgroupSizeX: 1,
  bindings: {
    renderUniforms: 0,
    hairData: 1,
    hairPositions: 2,
    tilesBuffer: 3,
    tileSegmentsBuffer: 4,
    hairSlicesHeads: 5,
    hairSlicesData: 6,
    rasterizerResult: 7,
  },
};

///////////////////////////
/// SHADER CODE
///////////////////////////
const c = SHADER_PARAMS;
const b = SHADER_PARAMS.bindings;

// ${BUFFER_HAIR_TANGENTS(b.hairTangents)}
// ${SW_RASTERIZE_HAIR}

export const SHADER_CODE = () => /* wgsl */ `

const TILE_SIZE: u32 = ${CONFIG.hairRender.tileSize}u;
const TILE_SIZE_2f: vec2f = vec2f(
  f32(${CONFIG.hairRender.tileSize}),
  f32(${CONFIG.hairRender.tileSize})
);
const PROCESSOR_COUNT: u32 = ${CONFIG.hairRender.processorCount}u;
const SLICES_PER_PIXEL: u32 = ${CONFIG.hairRender.slicesPerPixel}u;

${SHADER_SNIPPETS.GET_MVP_MAT}
${SHADER_SNIPPETS.GENERIC_UTILS}

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}
${BUFFER_HAIR_DATA(b.hairData)}
${BUFFER_HAIR_POINTS_POSITIONS(b.hairPositions)}
${BUFFER_HAIR_TILES_RESULT(b.tilesBuffer, 'read')}
${BUFFER_HAIR_TILE_SEGMENTS(b.tileSegmentsBuffer, 'read')}
${BUFFER_HAIR_RASTERIZER_RESULTS(b.rasterizerResult, 'read_write')}
${BUFFER_HAIR_SLICES_HEADS(b.hairSlicesHeads, 'read_write')}


struct FineRasterParams {
  modelViewMat: mat4x4f,
  projMat: mat4x4f,
  mvpMat: mat4x4f,
  strandsCount: u32, // u32's first
  pointsPerStrand: u32,
  viewportSizeU32: vec2u,
  viewportSize: vec2f, // f32's
  fiberRadius: f32,
  processorId: u32,
}


@compute
@workgroup_size(${c.workgroupSizeX}, 1, 1)
fn main(
  @builtin(global_invocation_id) global_id: vec3<u32>,
) {
  let processorId = global_id.x;
  let viewportSize: vec2f = _uniforms.viewport.xy;
  let maxDrawnSegments: u32 = _uniforms.maxDrawnHairSegments;
  let strandsCount: u32 = _hairData.strandsCount;
  let pointsPerStrand: u32 = _hairData.pointsPerStrand;

  let params = FineRasterParams(
    _uniforms.viewMatrix, // TODO model-view matrix!
    _uniforms.projMatrix,
    _uniforms.projMatrix * _uniforms.viewMatrix, // TODO make MVP
    strandsCount,
    pointsPerStrand,
    vec2u(viewportSize),
    viewportSize,
    _uniforms.fiberRadius,
    processorId
  );

  let tileCount2d = getTileCount(params.viewportSizeU32);
  let tileCount = tileCount2d.x * tileCount2d.y;
  var tileIdx = processorId; // TODO use queue: getNextTileIdx(); with atomic to implement naive work queue

  while (tileIdx < tileCount) {
    processTile(params, maxDrawnSegments, tileIdx);

    // move to next tile
    tileIdx = tileIdx + PROCESSOR_COUNT;
  }
}

fn processTile(
  p: FineRasterParams,
  maxDrawnSegments: u32,
  tileIdx: u32
) {
  // let MAX_PROCESSED_SEGMENTS = 0u; // just in case
  // let MAX_PROCESSED_SEGMENTS = 1u; // just in case
  // let MAX_PROCESSED_SEGMENTS = 128u; // just in case
  let MAX_PROCESSED_SEGMENTS = p.strandsCount * p.pointsPerStrand; // just in case

  let tileBoundsPx: vec4u = getTileBoundsPx(p.viewportSizeU32, tileIdx);
  let tileCenterPx: vec2u = (tileBoundsPx.xy + tileBoundsPx.zw) / 2u;
  var segmentPtr = _getTileSegmentPtr(p.viewportSizeU32, tileCenterPx);

  var segmentData = vec3u(); // [strandIdx, segmentIdx, nextPtr]
  var count = 0u;
  var sliceDataOffset = 0u;
  // TODO local idx variable to store next idx into slice data in "SlicesDataBuffer"

  _clearSlicesHeadPtrs(p.processorId); // TODO not needed if previous tile was empty

  // if ((tileIdx&1) == 0){
    // debugColorWholeTile(tileBoundsPx, vec4f(1., 0., 0., 1.));
  // }
  
  while (count < MAX_PROCESSED_SEGMENTS){
    if (_getTileSegment(maxDrawnSegments, segmentPtr, &segmentData)) {
      // clean previous tile's BUFFER_HAIR_SLICES_HEADS if it was written to previously
      // if (count == 0){ // first segment in tile
        // _clearSlicesHeadPtrs(p.processorId);
      // }

      /*let writtenSliceDataCount =*/ processHairSegment(
        p,
        tileBoundsPx, sliceDataOffset,
        segmentData.x, segmentData.y // strandIdx, segmentIdx
      );
      // sliceDataOffset = sliceDataOffset + writtenSliceDataCount;
      // if (!_hasMoreSliceDataSlots(sliceDataOffset)) { break; }

      // move to next segment
      count = count + 1;
      segmentPtr = segmentData.z;
    } else {
      // no more segment data for this tile, break
      break;
    }
  }

  // for each pixel:
  // iterate over slices and accumulate color
  // var sliceData: SliceData;
  // let boundRectMax = vec2u(tileBoundsPx.zw);
  let boundRectMax = vec2u(tileBoundsPx.zw);
  let boundRectMin = vec2u(tileBoundsPx.xy);

  for (var y: u32 = boundRectMin.y; y < boundRectMax.y; y+=1u) {
  for (var x: u32 = boundRectMin.x; x < boundRectMax.x; x+=1u) {
    var finalColor = vec4f();
    let px = vec2u(x, y); // pixel coordinates wrt. viewport
    let pxInTile: vec2u = vec2u(px - boundRectMin); // pixel coordinates wrt. tile
    
    /*
    // iterate slices front to back
    for (var s: u32 = 0u; x < SLICES_PER_PIXEL; s += 1u) {
      var cnt = 0u;
      var slicePtr = _getSlicesHeadPtr(p.processorId, px, s);
      while(_getSliceData(p.processorId, slicePtr, &sliceData) && cnt < 2u) {
        slicePtr = sliceData.nextPtr;
        cnt += 1u;
        // We could have a better blend if there are 2+ segments in slice, but meh..
        finalColor = mix(finalColor, sliceData.color, 1.0 - finalColor.a);
      }
    }*/
    var slicePtr = _getSlicesHeadPtr(p.processorId, pxInTile, 0u);
    if(slicePtr != INVALID_SLICE_DATA_PTR) {
      finalColor.r = 1.0;
      finalColor.a = 1.0;
    }
    
    _setRasterizerResult(p.viewportSizeU32, px, finalColor);
  }}
}


fn processHairSegment(
  p: FineRasterParams,
  tileBoundsPx: vec4u, sliceDataOffset: u32,
  strandIdx: u32, segmentIdx: u32
) {
  // var writtenSliceDataCount: u32 = 0u;

  // project segment's start and end points
  let segment0_obj: vec3f = _getHairPointPosition(p.pointsPerStrand, strandIdx, segmentIdx    ).xyz;
  let segment1_obj: vec3f = _getHairPointPosition(p.pointsPerStrand, strandIdx, segmentIdx + 1).xyz;
  let segment0_proj: vec3f = projectVertex(p.mvpMat, vec4f(segment0_obj, 1.0));
  let segment1_proj: vec3f = projectVertex(p.mvpMat, vec4f(segment1_obj, 1.0));
  let segment0_px: vec2f = ndc2viewportPx(p.viewportSize, segment0_proj);
  let segment1_px: vec2f = ndc2viewportPx(p.viewportSize, segment1_proj);
  let segmentLength = length(segment1_px - segment0_px);
  let tangent_proj = normalize(segment1_px - segment0_px); // TODO safe normalize!!!

  // TODO calculate radius only once, depending on if it's 1st segment in tile. Use inout param?
  // We measure difference in pixels between original point and one $fiberRadius afar from it
  var radiusTestVP =  p.modelViewMat * vec4f(segment0_obj, 1.0);
  radiusTestVP.y = radiusTestVP.y + p.fiberRadius * 2.0; // TODO [CRITICAL] magic multiplier
  let radiusTest_proj = projectVertex(p.projMat, radiusTestVP);
  let radiusTest_px: vec2f = ndc2viewportPx(p.viewportSize, radiusTest_proj); // projected $fiberRadius's pixel
  let fiberRadiusPx = abs(radiusTest_px.y - segment0_px.y); // difference. It's one dimensional (we moved in Y-axis), so no need for length, just abs()
  // let fiberRadiusPx = 5.0;

  // fix subpixel projection errors at the start/end of the segment.
  // there are tiny edge cases where valid pixel will be projected 'outside' the 0-1
  // so we enlarge segment near start-end. Unless it's strand tip
  let isLastSegment = segmentIdx >= (p.pointsPerStrand - 2); // -2 or -1?
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

  for (var y: f32 = boundRectMin.y; y < boundRectMax.y; y+=1.0) {
  for (var x: f32 = boundRectMin.x; x < boundRectMax.x; x+=1.0) {
  // for (var y: u32 = 0u; y < TILE_SIZE; y += 1u) { // ALT. iter for doublechecking
  // for (var x: u32 = 0u; x < TILE_SIZE; x += 1u) {

    // stop if there is no space inside processor's sliceData linked list.
    // let nextSliceDataPtr: u32 = sliceDataOffset + writtenSliceDataCount; 
    let nextSliceDataPtr: u32 = 0xff00ff00u;
    // if (!_hasMoreSliceDataSlots(nextSliceDataPtr)) { return writtenSliceDataCount; }

    // get coordinates if iter using [boundRectMin .. boundRectMax]
    let px = vec2f(x, y); // pixel coordinates wrt. viewport
    let px_u32 = vec2u(u32(x), u32(y));
    let pxInTile: vec2u = vec2u(px - boundRectMin); // pixel coordinates wrt. tile
    // ALT: get coordinates if iter using [0 .. TILE_SIZE]
    // let px = vec2f(boundRectMin + vec2f(f32(x), f32(y))); // pixel coordinates wrt. viewport
    // let px_u32 = vec2u(px);
    // let pxInTile: vec2u = vec2u(x, y); // pixel coordinates wrt. tile

    // project the pixel onto a line between segment's start and end points
    let pxOnSegment = projectPointToLine(segment0_px, segment1_px, px);
    
    let segmentStartTowardPixel: vec2f = pxOnSegment - segment0_px.xy;
    let segmentEndTowardPixel: vec2f = pxOnSegment - segment1_px.xy;
    // let d1 = length(segmentStartTowardPixel) / segmentLength; // TODO 
    // let t = d1;
    let t: f32 = max(
      segmentStartTowardPixel.x / tangent_proj.x,
      segmentStartTowardPixel.y / tangent_proj.y
    ) / segmentLength; // TODO no point normalizing tangent_proj if we divide by 'segmentLength' here
    var isInsideSegment = (t >= 0 && t <= 1.0) ||
      length(segmentStartTowardPixel) < rasterErrMarginStart || 
      length(segmentEndTowardPixel  ) < rasterErrMarginEnd;

    // TODO depth test. interpolate depth using 't', compare to zBuffer
    //      or maybe keep depth in view-space? But tile depth is projected, so we also project..
    // let t = length(segment0_proj - pxOnSegment) / segmentLength;
    // let depth = mix(segment0_proj.z, segment1_proj.z, t); // TODO it's in [-1, 1] or [0, 1]?
    let sliceIdx = 0u; // TODO calc the tile's min/max depth
    
    let distToStrandPx = length(pxOnSegment - px);
    // let distToStrand_0_1 = distToStrandPx / f32(TILE_SIZE); // dbg
    let alpha = saturate(1.0 - distToStrandPx / fiberRadiusPx);
    
    if (isInsideSegment && alpha > 0.){
      // let color = vec4f(1.0, 0.0, 0.0, alpha);

      // dbg
      // _setRasterizerResult(p.viewportSizeU32, px_u32, vec4f(1.0, 0.0, 0.0, 1.0));
      // _setRasterizerResult(p.viewportSizeU32, px_u32, vec4f(1.0, 0.0, 0.0, alpha));
      // _setRasterizerResult(p.viewportSizeU32, px_u32, vec4f(t, 0.0, 0.0, 1.0));
      // _setRasterizerResult(p.viewportSizeU32, px_u32, vec4f(distToStrand_0_1, 0.0, 0.0, 1.0));
      // _setRasterizerResult(p.viewportSizeU32, px_u32, vec4f(-tangent_proj.xy, 0.0, 1.0));

      // insert into per-slice linked list
      let previousPtr: u32 = _setSlicesHeadPtr(p.processorId, pxInTile, sliceIdx, nextSliceDataPtr);
      // _setSliceData(p.processorId, nextSliceDataPtr, color, previousPtr);
      // writtenSliceDataCount += 1u;
    }
  }}

  // debugColorPointInTile(tileBoundsPx, segment0_px, vec4f(0.0, 1.0, 0.0, 1.0));
  // debugColorPointInTile(tileBoundsPx, segment1_px, vec4f(0.0, 0.0, 1.0, 1.0));
  // return writtenSliceDataCount;
}

/** Changes tileIdx into (tileX, tileY) coordinates (NOT IN PIXELS!) */
fn getTileXY(viewportSize: vec2u, tileIdx: u32) -> vec2u {
  let rowWidth = divideCeil(viewportSize.x, TILE_SIZE); // in tiles
  let row = tileIdx / rowWidth;
  return vec2u(tileIdx - rowWidth * row, row);
}

/** Get tile's bounding box IN PIXELS */
fn getTileBoundsPx(viewportSize: vec2u, tileIdx: u32) -> vec4u {
  let tileXY = getTileXY(viewportSize, tileIdx);
  let offsetPx = tileXY * TILE_SIZE;
  return vec4u(offsetPx.xy, offsetPx.xy + vec2u(TILE_SIZE));
}


fn debugColorWholeTile(tileBoundsPx: vec4u, color: vec4f) {
  let viewportSize: vec2f = _uniforms.viewport.xy;
  let viewportSizeU32: vec2u = vec2u(viewportSize);

  let boundRectMin = tileBoundsPx.xy;
  let boundRectMax = tileBoundsPx.zw;
  
  for (var y = boundRectMin.y; y < boundRectMax.y; y += 1u) {
  for (var x = boundRectMin.x; x < boundRectMax.x; x += 1u) {
    let pos_u32 = vec2u(x, y);
    _setRasterizerResult(viewportSizeU32, pos_u32, color);
  }}
}

fn debugColorPointInTile(tileBoundsPx: vec4u, pos: vec2f, color: vec4f) {
  let viewportSize: vec2f = _uniforms.viewport.xy;
  let viewportSizeU32: vec2u = vec2u(viewportSize);
  let pos_u32 = vec2u(u32(pos.x), u32(pos.y));

  let boundRectMin = tileBoundsPx.xy;
  let boundRectMax = tileBoundsPx.zw;
  
  if (
    pos_u32.x >= boundRectMin.x && pos_u32.y >= boundRectMin.y &&
    pos_u32.x <  boundRectMax.x && pos_u32.y <  boundRectMax.y
  ) {
    _setRasterizerResult(viewportSizeU32, pos_u32, color);
  }
}

`;
