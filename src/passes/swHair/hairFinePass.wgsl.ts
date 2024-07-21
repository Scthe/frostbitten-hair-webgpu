import { BUFFER_HAIR_DATA } from '../../scene/hair/hairDataBuffer.ts';
import { BUFFER_HAIR_POINTS_POSITIONS } from '../../scene/hair/hairPointsPositionsBuffer.ts';
import { BUFFER_HAIR_TANGENTS } from '../../scene/hair/hairTangentsBuffer.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import * as SHADER_SNIPPETS from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { SW_RASTERIZE_HAIR } from './shared/swRasterizeHair.wgsl.ts';
import { BUFFER_HAIR_TILES_RESULT } from './shared/hairTilesResultBuffer.ts';
import { BUFFER_HAIR_TILE_SEGMENTS } from './shared/hairTileSegmentsBuffer.ts';
import { BUFFER_HAIR_RASTERIZER_RESULTS } from './shared/hairRasterizerResultBuffer.ts';
import { CONFIG } from '../../constants.ts';

export const SHADER_PARAMS = {
  workgroupSizeX: Math.max(CONFIG.hairRender.processorCount, 32), // TODO [LOW] set better values
  bindings: {
    renderUniforms: 0,
    hairData: 1,
    hairPositions: 2,
    // hairTangents: 3,
    tilesBuffer: 4,
    tileSegmentsBuffer: 5,
    rasterizerResult: 6,
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

${SHADER_SNIPPETS.GET_MVP_MAT}
${SHADER_SNIPPETS.GENERIC_UTILS}

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}
${BUFFER_HAIR_DATA(b.hairData)}
${BUFFER_HAIR_POINTS_POSITIONS(b.hairPositions)}
${BUFFER_HAIR_TILES_RESULT(b.tilesBuffer, 'read')}
${BUFFER_HAIR_TILE_SEGMENTS(b.tileSegmentsBuffer, 'read')}
${BUFFER_HAIR_RASTERIZER_RESULTS(b.rasterizerResult, 'read_write')}

// TODO change to what is actually needed
struct SwHairRasterizeParams {
  viewModelMat: mat4x4f,
  projMat: mat4x4f,
  viewportSizeU32: vec2u, // u32's first
  strandsCount: u32,
  pointsPerStrand: u32,
  viewportSize: vec2f, // f32's (AWKWARD!)
  fiberRadius: f32,
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

  let swHairRasterizeParams = SwHairRasterizeParams(
    _uniforms.viewMatrix,
    _uniforms.projMatrix,
    vec2u(viewportSize),
    strandsCount,
    pointsPerStrand,
    viewportSize,
    _uniforms.fiberRadius
  );

  let tileCount2d = getTileCount(swHairRasterizeParams.viewportSizeU32);
  let tileCount = tileCount2d.x * tileCount2d.y;
  var tileIdx = processorId; // TODO use queue: getNextTileIdx(); with atomic

  while (tileIdx < tileCount) {
    processTile(swHairRasterizeParams, maxDrawnSegments, tileIdx);

    // move to next tile
    tileIdx = tileIdx + PROCESSOR_COUNT; // TODO use queue: getNextTileIdx(); with atomic
  }
}

fn processTile(
  p: SwHairRasterizeParams,
  maxDrawnSegments: u32,
  tileIdx: u32
) {
  // let MAX_PROCESSED_SEGMENTS = 1u; // just in case
  // let MAX_PROCESSED_SEGMENTS = 128u; // just in case
  let MAX_PROCESSED_SEGMENTS = p.strandsCount * p.pointsPerStrand; // just in case

  let tileBoundsPx = getTileBounds(p.viewportSizeU32, tileIdx);
  // let tileData = _getTileDataByIdx(tileIdx); // [minDepth, maxDepth, pointer to tileSegments list]
  // var segmentPtr = tileData.tileSegmentPtr;
  let tileCenter = (tileBoundsPx.xy + tileBoundsPx.zw) / 2.0;
  let tileCenter_u32 = vec2u(u32(tileCenter.x), u32(tileCenter.y)); // TODO [IGNORE] invert Y?
  
  var segmentPtr = _getTileSegmentPtr(p.viewportSizeU32, tileCenter_u32);
  var segmentData = vec3u(); // [strandIdx, segmentIdx, nextPtr]
  var count = 0u;

  // TODO clean previous tile's BUFFER_HAIR_SLICES_HEADS if it was written to previously
  // TODO local idx variable to store next idx into slice data in "SlicesDataBuffer"

  while (count < MAX_PROCESSED_SEGMENTS){
    if (_getTileSegment(maxDrawnSegments, segmentPtr, &segmentData)) {
      processHairSegment(
        p,
        tileBoundsPx,
        segmentData.x, segmentData.y // strandIdx, segmentIdx
      );

      // move to next segment
      count = count + 1;
      segmentPtr = segmentData.z;
    } else {
      break;
    }
  }
}


fn processHairSegment(
  p: SwHairRasterizeParams,
  tileBoundsPx: vec4f,
  strandIdx: u32, segmentIdx: u32
) {
  // start and end of segment
  let mvpMat = _uniforms.projMatrix * _uniforms.viewMatrix; // TODO extract, make MVP
  let segment0_obj: vec3f = _getHairPointPosition(p.pointsPerStrand, strandIdx, segmentIdx    ).xyz;
  let segment1_obj: vec3f = _getHairPointPosition(p.pointsPerStrand, strandIdx, segmentIdx + 1).xyz;
  let segment0_proj: vec3f = projectVertex(mvpMat, vec4f(segment0_obj, 1.0));
  let segment1_proj: vec3f = projectVertex(mvpMat, vec4f(segment1_obj, 1.0));
  let segment0_px: vec2f = ndc2viewportPx(p.viewportSize, segment0_proj);
  let segment1_px: vec2f = ndc2viewportPx(p.viewportSize, segment1_proj);
  let segmentLength = length(segment1_px - segment0_px);
  let tangent_proj = normalize(segment1_px - segment0_px); // TODO safe normalize!!!

  // calculate radius
  var radiusTestVP =  _uniforms.viewMatrix * vec4f(segment0_obj, 1.0); // TODO model matrix!
  radiusTestVP.y = radiusTestVP.y + p.fiberRadius * 2.0; // TODO [CRITICAL] magic multiplier
  let radiusTest_proj = projectVertex(_uniforms.projMatrix, radiusTestVP);
  let radiusTest_px: vec2f = ndc2viewportPx(p.viewportSize, radiusTest_proj);
  let fiberRadiusPx = abs(radiusTest_px.y - segment0_px.y);
  // let fiberRadiusPx = 5.0;

  // fix subpixel projection errors at the start/end of the segment
  let isLastSegment = segmentIdx >= (p.pointsPerStrand - 2); // -2 or -1?
  let rasterErrMarginStart = 3.0;
  let rasterErrMarginEnd = select(rasterErrMarginStart, 0.0, isLastSegment);

  // bounds
  let boundRectMax = vec2u(tileBoundsPx.zw);
  let boundRectMin = vec2u(tileBoundsPx.xy);

  // TODO rasterize using u32? or f32?
  for (var y: u32 = boundRectMin.y; y < boundRectMax.y; y+=1u) {
  for (var x: u32 = boundRectMin.x; x < boundRectMax.x; x+=1u) {
    let px = vec2f(f32(x), f32(y));
    let pxOnSegment = projectPointToLine(segment0_px, segment1_px, px);
    
    let segmentStartTowardPixel: vec2f = pxOnSegment - segment0_px.xy;
    let segmentEndTowardPixel: vec2f = pxOnSegment - segment1_px.xy;
    // let d1 = length(segmentStartTowardPixel) / segmentLength; // TODO 
    // let t = d1;
    let t: f32 = max(
      segmentStartTowardPixel.x / tangent_proj.x,
      segmentStartTowardPixel.y / tangent_proj.y
    ) / segmentLength; // TODO no point normalizing tangent_proj if we divide by 'segmentLength' here
    // TODO not always true, sometimes the projected pixels are just a sliver 
    var isInsideSegment = (t >= 0 && t <= 1.0) ||
      length(segmentStartTowardPixel) < rasterErrMarginStart || 
      length(segmentEndTowardPixel  ) < rasterErrMarginEnd;

    // let isInsideSegment = true;
    
    // TODO depth test. interpolate depth using 't', compare to zBuffer
    //      or maybe keep depth in view-space? But tile depth is projected, so we also project..
    // let depth = mix(segment0_proj.z, segment1_proj.z, t); // TODO it's in [-1, 1] or [0, 1]?
    
    let distToStrandPx = length(pxOnSegment - px);
    let distToStrand_0_1 = distToStrandPx / f32(TILE_SIZE);
    // let isWidthOk = distToStrandPx < 1.0;
    // let isWidthOk = distToStrandPx < fiberRadiusPx;
    let alpha = saturate(1.0 - distToStrandPx / fiberRadiusPx);
    

    if (isInsideSegment && alpha > 0.){
      let px_u32 = vec2u(u32(x), u32(y));
      // _setRasterizerResult(p.viewportSizeU32, px_u32, vec4f(0.1, 0.0, 0.0, 1.0));
      _setRasterizerResult(p.viewportSizeU32, px_u32, vec4f(1.0, 0.0, 0.0, alpha));
      // _setRasterizerResult(p.viewportSizeU32, px_u32, vec4f(t, 0.0, 0.0, 1.0));
      // _setRasterizerResult(p.viewportSizeU32, px_u32, vec4f(distToStrand_0_1, 0.0, 0.0, 1.0));
      // _setRasterizerResult(p.viewportSizeU32, px_u32, vec4f(-tangent_proj.xy, 0.0, 1.0));
    }
  }}

  // debugColorPointInTile(tileBoundsPx, segment0_px, vec4f(0.0, 1.0, 0.1, 1.0));
  // debugColorPointInTile(tileBoundsPx, segment1_px, vec4f(1.0, 0.0, 0.1, 1.0));
}

/** Changes tileIdx into (tileX, tileY) coordinates (NOT IN PIXELS!) */
fn getTileXY(viewportSize: vec2u, tileIdx: u32) -> vec2u {
  let tilesWidth = divideCeil(viewportSize.x, TILE_SIZE);
  let row = tileIdx / tilesWidth;
  return vec2u(tileIdx - tilesWidth * row, row);
}

/** Get tile's bounding box IN PIXELS */
fn getTileBounds(viewportSize: vec2u, tileIdx: u32) -> vec4f {
  let tileXY = getTileXY(viewportSize, tileIdx);
  let offsetPx = vec2f(tileXY * TILE_SIZE);
  return vec4f(offsetPx.xy, offsetPx.xy + TILE_SIZE_2f);
}


// TODO duplicated code
fn projectVertex(mvpMat: mat4x4f, pos: vec4f) -> vec3f {
  let posClip = mvpMat * pos;
  let posNDC = posClip / posClip.w;
  return posNDC.xyz;
}

// TODO duplicated code
/** https://stackoverflow.com/a/64330724 */
fn projectPointToLine(l1: vec2f, l2: vec2f, p: vec2f) -> vec2f {
  let ab = l2 - l1;
  let ac = p - l1;
  let ad = ab * dot(ab, ac) / dot(ab, ab);
  let d = l1 + ad;
  return d;
}

// TODO duplicated code
fn ndc2viewportPx(viewportSize: vec2f, pos: vec3f) -> vec2f {
  let pos_0_1 = pos.xy * 0.5 + 0.5; // to [0-1]
  return pos_0_1 * viewportSize.xy;
}

fn debugColorWholeTile(tileBoundsPx: vec4f, color: vec4f) {
  let viewportSize: vec2f = _uniforms.viewport.xy;
  let viewportSizeU32: vec2u = vec2u(viewportSize);

  let boundRectMin = tileBoundsPx.xy;
  let boundRectMax = tileBoundsPx.zw;
  
  for (var y: f32 = boundRectMin.y; y < boundRectMax.y; y+=1.0) {
  for (var x: f32 = boundRectMin.x; x < boundRectMax.x; x+=1.0) {
    let pos_u32 = vec2u(u32(x), u32(y));
    _setRasterizerResult(viewportSizeU32, pos_u32, color);
  }}
}

fn debugColorPointInTile(tileBoundsPx: vec4f, pos: vec2f, color: vec4f) {
  let viewportSize: vec2f = _uniforms.viewport.xy;
  let viewportSizeU32: vec2u = vec2u(viewportSize);

  let boundRectMin = tileBoundsPx.xy;
  let boundRectMax = tileBoundsPx.zw;
  
  if (pos.x >= boundRectMin.x && pos.y >= boundRectMin.y) {
    let pos_u32 = vec2u(u32(pos.x), u32(pos.y));
    _setRasterizerResult(viewportSizeU32, pos_u32, color);
  }
}

`;
