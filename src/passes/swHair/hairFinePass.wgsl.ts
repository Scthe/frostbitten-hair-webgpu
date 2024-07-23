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
import { SHADER_IMPL_PROCESS_HAIR_SEGMENT } from './shaderImpl/processHairSegment.wgsl.ts';
import { SHADER_IMPL_REDUCE_HAIR_SLICES } from './shaderImpl/reduceHairSlices.wgsl.ts';
import { BUFFER_HAIR_SHADING } from '../../scene/hair/hairShadingBuffer.ts';

export const SHADER_PARAMS = {
  workgroupSizeX: CONFIG.hairRender.finePassWorkgroupSizeX,
  bindings: {
    renderUniforms: 0,
    hairData: 1,
    hairPositions: 2,
    tilesBuffer: 3,
    tileSegmentsBuffer: 4,
    hairSlicesHeads: 5,
    hairSlicesData: 6,
    rasterizerResult: 7,
    depthTexture: 8,
    hairShading: 9,
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
const SLICES_PER_PIXEL: u32 = ${CONFIG.hairRender.slicesPerPixel}u;
const SLICES_PER_PIXEL_f32: f32 = f32(SLICES_PER_PIXEL);
// Stop processing slices once we reach opaque color
// TBH does not help much, it's not where the actuall cost is. Still..
const ALPHA_CUTOFF = 0.999;

${SHADER_SNIPPETS.GET_MVP_MAT}
${SHADER_SNIPPETS.GENERIC_UTILS}

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}
${BUFFER_HAIR_DATA(b.hairData)}
${BUFFER_HAIR_POINTS_POSITIONS(b.hairPositions)}
${BUFFER_HAIR_TILES_RESULT(b.tilesBuffer, 'read')}
${BUFFER_HAIR_TILE_SEGMENTS(b.tileSegmentsBuffer, 'read')}
${BUFFER_HAIR_RASTERIZER_RESULTS(b.rasterizerResult, 'read_write')}
${BUFFER_HAIR_SLICES_HEADS(b.hairSlicesHeads, 'read_write')}
${BUFFER_HAIR_SLICES_DATA(b.hairSlicesData, 'read_write')}
${BUFFER_HAIR_SHADING(b.hairShading, 'read')}

@group(0) @binding(${b.depthTexture})
var _depthTexture: texture_depth_2d;


struct FineRasterParams {
  modelViewMat: mat4x4f,
  projMat: mat4x4f,
  mvpMat: mat4x4f,
  // START: vec4u
  strandsCount: u32, // u32's first
  pointsPerStrand: u32,
  viewportSizeU32: vec2u,
  // START: mixed
  viewportSize: vec2f, // f32's
  fiberRadius: f32,
  processorId: u32,
  dbgSlicesModeMaxSlices: u32,
}

// Extra code to make this file manageable
${SHADER_IMPL_PROCESS_HAIR_SEGMENT()}
${SHADER_IMPL_REDUCE_HAIR_SLICES()}


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
    _uniforms.modelViewMat,
    _uniforms.projMatrix,
    _uniforms.mvpMatrix,
    strandsCount,
    pointsPerStrand,
    vec2u(viewportSize),
    viewportSize,
    _uniforms.fiberRadius,
    processorId,
    getDbgSlicesModeMaxSlices(),
  );

  // clear memory before starting work
  _clearSlicesHeadPtrs(processorId);

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
  var tileDepth = _getTileDepth(p.viewportSizeU32, tileCenterPx);

  var segmentData = vec3u(); // [strandIdx, segmentIdx, nextPtr]
  var processedSegmentCnt = 0u;
  var sliceDataOffset = 0u;
  var fiberRadiusPx = -1.0; // negative as it will cause recalc on first segment

  // for each segment:
  //    iterate over tile's pixels and write color to appropriate depth-slice
  while (processedSegmentCnt < MAX_PROCESSED_SEGMENTS){
    if (_getTileSegment(maxDrawnSegments, segmentPtr, &segmentData)) {
      let writtenSliceDataCount = processHairSegment(
        p,
        tileBoundsPx, tileDepth,
        sliceDataOffset,
        &fiberRadiusPx,
        segmentData.x, segmentData.y // strandIdx, segmentIdx
      );
      sliceDataOffset = sliceDataOffset + writtenSliceDataCount;
      if (!_hasMoreSliceDataSlots(sliceDataOffset)) { break; }

      // move to next segment
      processedSegmentCnt = processedSegmentCnt + 1;
      segmentPtr = segmentData.z;
    } else {
      // no more segment data for this tile, break
      break;
    }
  }

  if (sliceDataOffset == 0) {
    // no pixels were changed. This should not happen (cause tile pass), but just in case
    return;
  }

  // reduce over slices list and set the final color into result buffer
  reduceHairSlices(
    p.processorId,
    p.viewportSizeU32,
    p.dbgSlicesModeMaxSlices,
    tileBoundsPx
  );

  // clear written values before moving to next tile
  _clearSlicesHeadPtrs(p.processorId);
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
