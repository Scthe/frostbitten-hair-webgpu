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
  workgroupSizeX: CONFIG.hairRender.processorCount, // TODO [LOW] set better values
  bindings: {
    renderUniforms: 0,
    hairData: 1,
    hairPositions: 2,
    hairTangents: 3,
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

export const SHADER_CODE = () => /* wgsl */ `

const TILE_SIZE: u32 = ${CONFIG.hairRender.tileSize}u;
const TILE_SIZE_2f: vec2f = vec2f(
  f32(${CONFIG.hairRender.tileSize}),
  f32(${CONFIG.hairRender.tileSize})
);
const PROCESSOR_COUNT: u32 = ${CONFIG.hairRender.processorCount}u;

${SHADER_SNIPPETS.GET_MVP_MAT}
${SHADER_SNIPPETS.GENERIC_UTILS}
${SW_RASTERIZE_HAIR}

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}
${BUFFER_HAIR_DATA(b.hairData)}
${BUFFER_HAIR_POINTS_POSITIONS(b.hairPositions)}
${BUFFER_HAIR_TANGENTS(b.hairTangents)}
${BUFFER_HAIR_TILES_RESULT(b.tilesBuffer, 'read')}
${BUFFER_HAIR_TILE_SEGMENTS(b.tileSegmentsBuffer, 'read')}
${BUFFER_HAIR_RASTERIZER_RESULTS(b.rasterizerResult, 'read_write')}



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
  let MAX_PROCESSED_SEGMENTS = 1u; // just in case

  let tileBoundsPx = getTileBounds(p.viewportSizeU32, tileIdx);
  
  let tileData = _getTileDataByIdx(tileIdx); // [minDepth, maxDepth, pointer to tileSegments list]
  var segmentPtr = tileData.tileSegmentPtr;
  var segmentData = vec3u(); // [strandIdx, segmentIdx, nextPtr]
  var count = 0u;

  // TODO clean previous tile's BUFFER_HAIR_SLICES_HEADS if it was written to previously
  // TODO local idx variable to store next idx into slice data in "SlicesDataBuffer"

  while (count < MAX_PROCESSED_SEGMENTS){
    if (_getTileSegment(maxDrawnSegments, segmentPtr, &segmentData)) {
      processHairSegment(
        p,
        tileBoundsPx,
        tileData.minDepth, tileData.maxDepth,
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
  depthMin: u32, depthMax: u32,
  strandIdx: u32, segmentIdx: u32
) {
  let sw = swRasterizeHair(p, strandIdx, segmentIdx);

  // scissor with tile
  let boundRectMax = ceil(max(tileBoundsPx.zw, sw.boundRectMax));
  let boundRectMin = floor(min(tileBoundsPx.xy, sw.boundRectMin));
  
  for (var y: f32 = boundRectMin.y; y < boundRectMax.y; y+=1.0) {
  for (var x: f32 = boundRectMin.x; x < boundRectMax.x; x+=1.0) {
    let px = vec2f(x, y);
    let C0 = edgeFunction(sw.v01, sw.v00, px);
    let C1 = edgeFunction(sw.v11, sw.v01, px);
    let C2 = edgeFunction(sw.v10, sw.v11, px);
    let C3 = edgeFunction(sw.v00, sw.v10, px);

    if (C0 >= 0 && C1 >= 0 && C2 >= 0 && C3 >= 0) {
      let px_u32 = vec2u(u32(x), u32(y));
      _setRasterizerResult(p.viewportSizeU32, px_u32, vec4f(1.0, 0.0, 0.0, 1.0));
    }
  }}
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

`;
