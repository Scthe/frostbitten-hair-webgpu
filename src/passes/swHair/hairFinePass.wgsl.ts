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
import { SHADER_TILE_UTILS } from './shaderImpl/tileUtils.wgsl.ts';

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
const SLICES_PER_PIXEL: u32 = ${CONFIG.hairRender.slicesPerPixel}u;
const SLICES_PER_PIXEL_f32: f32 = f32(SLICES_PER_PIXEL);
// Stop processing slices once we reach opaque color
// TBH does not help much, it's not where the actuall cost is. Still..
const ALPHA_CUTOFF = 0.999;

${SHADER_SNIPPETS.GET_MVP_MAT}
${SHADER_SNIPPETS.GENERIC_UTILS}
${SHADER_TILE_UTILS}

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
  var tileIdx = _getNextTileIdx();

  while (tileIdx < tileCount) {
    processTile(params, maxDrawnSegments, tileIdx);

    // move to next tile
    tileIdx = _getNextTileIdx();
  }
}

fn processTile(
  p: FineRasterParams,
  maxDrawnSegments: u32,
  tileIdx: u32
) {
  // let MAX_PROCESSED_SEGMENTS = 0u; // just in case
  // let MAX_PROCESSED_SEGMENTS = 1u; // just in case
  // let MAX_PROCESSED_SEGMENTS = 32u; // just in case (the profiled case)
  // let MAX_PROCESSED_SEGMENTS = 128u; // just in case
  let MAX_PROCESSED_SEGMENTS = p.strandsCount * p.pointsPerStrand; // just in case

  
  // TODO finish tiles depth bins:
  //  - how to pick up the previous bin's color? Just a memory read?
  //  - clear heads
  let MOCKED_DEPTH_BIN = 0u;
  let tileXY = getTileXY(p.viewportSizeU32, tileIdx);
  let tileBoundsPx: vec4u = getTileBoundsPx(p.viewportSizeU32, tileXY);
  var segmentPtr = _getTileSegmentPtr(p.viewportSizeU32, tileXY, MOCKED_DEPTH_BIN);
  var tileDepth = _getTileDepth(p.viewportSizeU32, tileXY);

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
  // debugColorWholeTile(tileBoundsPx, vec4f(1., 0., 0., 1.));
  reduceHairSlices(
    p.processorId,
    p.viewportSizeU32,
    p.dbgSlicesModeMaxSlices,
    tileBoundsPx
  );

  // clear written values before moving to next tile
  _clearSlicesHeadPtrs(p.processorId);
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
