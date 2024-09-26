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
import { SW_RASTERIZE_HAIR } from './shaderImpl/swRasterizeHair.wgsl.ts';
import { BUFFER_HAIR_TANGENTS } from '../../scene/hair/hairTangentsBuffer.ts';
import { BUFFER_TILE_LIST } from './shared/tileListBuffer.ts';

export const SHADER_PARAMS = {
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
    hairTangents: 10,
    tileList: 11,
  },
};

///////////////////////////
/// SHADER CODE
///////////////////////////
const c = SHADER_PARAMS;
const b = SHADER_PARAMS.bindings;

export const SHADER_CODE = () => /* wgsl */ `

const SLICES_PER_PIXEL: u32 = ${CONFIG.hairRender.slicesPerPixel}u;
const SLICES_PER_PIXEL_f32: f32 = f32(SLICES_PER_PIXEL);
// Stop processing slices once we reach opaque color
// TBH does not help much, it's not where the actuall cost is. Still..
const ALPHA_CUTOFF = 0.999;

${SHADER_SNIPPETS.GET_MVP_MAT}
${SHADER_SNIPPETS.GENERIC_UTILS}
${SHADER_TILE_UTILS}
${SW_RASTERIZE_HAIR}

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}
${BUFFER_HAIR_DATA(b.hairData)}
${BUFFER_HAIR_POINTS_POSITIONS(b.hairPositions)}
${BUFFER_HAIR_TANGENTS(b.hairTangents)}
${BUFFER_HAIR_TILES_RESULT(b.tilesBuffer, 'read')}
${BUFFER_HAIR_TILE_SEGMENTS(b.tileSegmentsBuffer, 'read')}
${BUFFER_HAIR_RASTERIZER_RESULTS(b.rasterizerResult, 'read_write')}
${BUFFER_HAIR_SLICES_HEADS(b.hairSlicesHeads, 'read_write')}
${BUFFER_HAIR_SLICES_DATA(b.hairSlicesData, 'read_write')}
${BUFFER_HAIR_SHADING(b.hairShading, 'read')}
${BUFFER_TILE_LIST(b.tileList, 'read')}

@group(0) @binding(${b.depthTexture})
var _depthTexture: texture_depth_2d;


struct FineRasterParams {
  // START: vec4u
  strandsCount: u32, // u32's first
  pointsPerStrand: u32,
  viewportSizeU32: vec2u,
  // START: mixed
  viewportSize: vec2f, // f32's
  fiberRadius: f32,
  processorId: u32, // TODO remove
  dbgSlicesModeMaxSlices: u32,
}

// Extra code to make this file manageable
${SHADER_IMPL_PROCESS_HAIR_SEGMENT()}
${SHADER_IMPL_REDUCE_HAIR_SLICES()}


const WORKGROUP_SIZE: u32 = TILE_SIZE * TILE_SIZE;

var<workgroup> _currentTileIdx: u32;
var<workgroup> _hasMoreTiles: bool;
var<workgroup> _sliceDataOffset: atomic<u32>;
// bypass "workgroupUniformLoad must not be called with an argument that contains an atomic type"
var<workgroup> _sliceDataOffset_NOT_ATOMIC: u32;
var<workgroup> _finishedPixels: atomic<u32>;
var<workgroup> _arePixelsDone: atomic<i32>;
// bypass "workgroupUniformLoad must not be called with an argument that contains an atomic type"
var<workgroup> _arePixelsDone_NOT_ATOMIC: bool;

var<private> _pixelInTilePos: vec2u;
var<private> _isPixelDone: bool;


@compute
@workgroup_size(TILE_SIZE, TILE_SIZE, 1)
fn main(
  // @builtin(global_invocation_id) global_id: vec3<u32>,
  @builtin(local_invocation_index) local_invocation_index: u32, // threadId inside workgroup
) {
  let processorId = 0u; //global_id.x;
  let viewportSize: vec2f = _uniforms.viewport.xy;
  let maxDrawnSegments: u32 = _uniforms.maxDrawnHairSegments;
  let strandsCount: u32 = _hairData.strandsCount;
  let pointsPerStrand: u32 = _hairData.pointsPerStrand;
  // _local_invocation_index = local_invocation_index;

  let params = FineRasterParams(
    strandsCount,
    pointsPerStrand,
    vec2u(viewportSize),
    viewportSize,
    _uniforms.fiberRadius,
    processorId,
    getDbgSlicesModeMaxSlices(),
  );

  _pixelInTilePos = vec2u(
    local_invocation_index % TILE_SIZE,
    local_invocation_index / TILE_SIZE
  );

  // clear memory before starting work
  _clearSlicesHeadPtrs(_pixelInTilePos, processorId);

  // tile count based on screen size. Used to check if tile is valid
  let tileCount2d = getTileCount(params.viewportSizeU32);
  let tileCount = tileCount2d.x * tileCount2d.y;
  // size of task queue
  let tilesToProcess = _hairTileData.drawnTiles;
  var tileIdx = getNextTileIdx(local_invocation_index, tilesToProcess);

  while (!workgroupUniformLoad(&_hasMoreTiles)) {
    // prepare for next tile
    let tileXY = getTileXY(params.viewportSizeU32, tileIdx);
    var tileBoundsPx: vec4u = getTileBoundsPx(params.viewportSizeU32, tileXY);
    _isPixelDone = false;
    
    // iterate over depth bins
    for (
      var depthBin = 0u;
      depthBin < TILE_DEPTH_BINS_COUNT && tileIdx < tileCount;
      depthBin += 1u
    ) {
      if (local_invocation_index == 0u) {
        atomicStore(&_sliceDataOffset, 0u);
      }
      workgroupBarrier();

      processTile(
        local_invocation_index,
        params,
        maxDrawnSegments,
        tileXY,
        depthBin,
        tileBoundsPx
      );
      
      // early out for whole tile
      if (checkAllPixelsInWkgrpDone(local_invocation_index)) {
        // debugColorWholeTile(tileBoundsPx, vec4f(1., 0., 0., 1.));
        break;
      }
    } // END: iterate over depth bins

    // move to next tile
    tileIdx = getNextTileIdx(local_invocation_index, tilesToProcess);
  }
}

fn processTile(
  local_invocation_index: u32,
  params: FineRasterParams,
  maxDrawnSegments: u32,
  tileXY: vec2u,
  depthBin: u32,
  tileBoundsPx: vec4u
) {
  let MAX_PROCESSED_SEGMENTS = params.strandsCount * params.pointsPerStrand; // just in case
  
  let tileDepth = _getTileDepth(params.viewportSizeU32, tileXY, depthBin); // TODO only on first thread
  // if (tileDepth.y == 0.0) { return false; } // no depth written means empty tile // TODO
  var segmentPtr = _getTileSegmentPtr(params.viewportSizeU32, tileXY, depthBin);

  var segmentData = vec3u(); // [strandIdx, segmentIdx, nextPtr]
  var processedSegmentCnt = 0u;

  // for each segment:
  //    iterate over tile's pixels and write color to appropriate depth-slice
  while (processedSegmentCnt < MAX_PROCESSED_SEGMENTS){
    let hasValidSegment = _getTileSegment(maxDrawnSegments, segmentPtr, &segmentData);

    if (!_isPixelDone && hasValidSegment) {
      processHairSegment(
        params,
        tileBoundsPx, tileDepth,
        segmentData.x, segmentData.y // strandIdx, segmentIdx
      );
    }
    workgroupBarrier();


    // break condition if has no more hair segments in a tile
    if (!hasValidSegment && tileXY.x == 0u && tileXY.y == 0u) {
      atomicStore(&_sliceDataOffset, SLICE_DATA_PER_PROCESSOR_COUNT); // set invalid
    }

    // trigger 'break;' if:
    //   1. run out of PPLL memory
    //   2. no more hair segments in a tile (see $hasValidSegment)
    let sliceDataOffset = getUniformSliceDataOffset(local_invocation_index);
    if (!_hasMoreSliceDataSlots(sliceDataOffset)) { break; }

    // move to next segment
    processedSegmentCnt = processedSegmentCnt + 1;
    segmentPtr = segmentData.z;
  }

  let sliceDataOffset = getUniformSliceDataOffset(local_invocation_index);
  if (sliceDataOffset == 0) {
    // no pixels were changed. This can happen if depth bin is empty. Move to next depth bin in that case
    return;
  }

  // reduce over slices list and set the final color into result buffer
  // this also clears the current processor state for next tile
  // debugColorWholeTile(tileBoundsPx, vec4f(1., 0., 0., 1.));
  if (!_isPixelDone){
    _isPixelDone = reduceHairSlices(
      params.processorId,
      params.viewportSizeU32,
      params.dbgSlicesModeMaxSlices,
      tileBoundsPx
    );
  }
}


//////////////////////////
/// Tile processing utils

fn getNextTileIdx(local_invocation_index: u32, tileCount: u32) -> u32 {
  if (local_invocation_index == 0u) {
    _currentTileIdx = atomicAdd(&_hairRasterizerResults.tileQueueAtomicIdx, 1u);
    _hasMoreTiles = _currentTileIdx >= tileCount;
  }
  workgroupBarrier();

  return workgroupUniformLoad(&_currentTileIdx);
}

fn checkAllPixelsInWkgrpDone(local_invocation_index: u32) -> bool {
  if (local_invocation_index == 0u) {
    atomicStore(&_arePixelsDone, 1);
  }
  workgroupBarrier();

  atomicAnd(&_arePixelsDone, select(0, 1, _isPixelDone));
  workgroupBarrier();

  // fixes: "workgroupUniformLoad must not be called with an argument that contains an atomic type"
  if (local_invocation_index == 0u) {
    let v = atomicLoad(&_arePixelsDone);
    _arePixelsDone_NOT_ATOMIC = v > 0;
  }

  // has implicit barrier
  return workgroupUniformLoad(&_arePixelsDone_NOT_ATOMIC);
}

// Cannot call workgroupUniformLoad() on atomic<u32>. Copy to normal u32 first
fn getUniformSliceDataOffset(local_invocation_index: u32) -> u32 {
  if (local_invocation_index == 0u) {
    _sliceDataOffset_NOT_ATOMIC = atomicLoad(&_sliceDataOffset);
  }
  return workgroupUniformLoad(&_sliceDataOffset_NOT_ATOMIC);
}


//////////////////////////
/// Debug utils

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
