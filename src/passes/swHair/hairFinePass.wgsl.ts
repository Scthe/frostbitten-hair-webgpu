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
    // hairPositions: 2,
    // hairTangents: 3,
    tilesBuffer: 2,
    tileSegmentsBuffer: 3,
    rasterizerResult: 4,
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

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}
${BUFFER_HAIR_DATA(b.hairData)}
${BUFFER_HAIR_TILES_RESULT(b.tilesBuffer, 'read')}
${BUFFER_HAIR_TILE_SEGMENTS(b.tileSegmentsBuffer, 'read')}
${BUFFER_HAIR_RASTERIZER_RESULTS(b.rasterizerResult, 'read_write')}



@compute
@workgroup_size(${c.workgroupSizeX}, 1, 1)
fn main(
  @builtin(global_invocation_id) global_id: vec3<u32>,
) {
  let maxDrawnSegments: u32 = _uniforms.maxDrawnHairSegments;
  let viewportSize: vec2f = _uniforms.viewport.xy;
  let viewportSizeU32: vec2u = vec2u(viewportSize);
  let processorId = global_id.x;
  let tileCount2d = getTileCount(viewportSizeU32);
  let tileCount = tileCount2d.x * tileCount2d.y;

  var tileIdx = processorId; // TODO use queue: getNextTileIdx(); with atomic

  while (tileIdx < tileCount) {
    processTile(tileIdx);

    // move to next tile
    tileIdx = tileIdx + PROCESSOR_COUNT; // TODO use queue: getNextTileIdx(); with atomic
  }
}

fn processTile(tileIdx: u32) {
  // TODO iterate over all segments in a tile!
  let MAX_PROCESSED_SEGMENTS = 1u;
  let viewportSize: vec2f = _uniforms.viewport.xy;
  let viewportSizeU32: vec2u = vec2u(viewportSize);
  let maxDrawnSegments: u32 = _uniforms.maxDrawnHairSegments;
  let tileBoundsPx = getTileBounds(viewportSizeU32, tileIdx);
  
  let tileData = _getTileDataByIdx(tileIdx); // [minDepth, maxDepth, pointer to tileSegments list]
  var segmentPtr = tileData.tileSegmentPtr;
  var segmentData = vec3u(); // [strandIdx, segmentIdx, nextPtr]
  var count = 0u;

  // TODO clean previous tile's BUFFER_HAIR_SLICES_HEADS if it was written to previously
  // TODO idx variable to store next slice data in "SlicesDataBuffer"

  while (count < MAX_PROCESSED_SEGMENTS){
    if (_getTileSegment(maxDrawnSegments, segmentPtr, &segmentData)) {
    // if ((tileIdx & 1u) > 0) {
      processHairSegment(
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
  tileBoundsPx: vec4f, // TODO not needed later, just processorId
  depthMin: u32, depthMax: u32,
  strandIdx: u32, segmentIdx: u32
) {
  // TODO move to parent fn?
  // let viewModelMat = _uniforms.viewMatrix; // TODO finish
  let viewportSize: vec2f = _uniforms.viewport.xy;
  let viewportSizeU32: vec2u = vec2u(viewportSize);
  // let strandsCount: u32 = _hairData.strandsCount;
  // let pointsPerStrand: u32 = _hairData.pointsPerStrand;

  let boundRectMin = tileBoundsPx.xy;
  let boundRectMax = tileBoundsPx.zw;
  
  for (var y: f32 = boundRectMin.y; y < boundRectMax.y; y+=1.0) {
  for (var x: f32 = boundRectMin.x; x < boundRectMax.x; x+=1.0) {
    let pos_u32 = vec2u(u32(x), u32(y));
    _setRasterizerResult(viewportSizeU32, pos_u32, vec4f(1.0, 0.0, 0.0, 1.0));
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

`;
