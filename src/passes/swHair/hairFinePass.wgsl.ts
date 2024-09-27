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
const b = SHADER_PARAMS.bindings;

export const SHADER_CODE = () => /* wgsl */ `

const SLICES_PER_PIXEL: u32 = ${CONFIG.hairRender.slicesPerPixel}u;
const WORKGROUP_SIZE: u32 = TILE_SIZE * TILE_SIZE;
// Stop processing slices once we reach opaque color
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

// TODO into workgroup mem?
struct FineRasterParams {
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

struct WorkgroupVars {
  // Index of currently processed tile for this workgroup
  currentTileIdx: u32,
  // Stop condition for entire algorithm
  hasMoreTiles: bool,

  // Write offset into slices data buffer
  sliceDataOffset: atomic<u32>,
  // Same as above, but not atomic, so we can use workgroupUniformLoad()
  // fixes "workgroupUniformLoad must not be called with an argument that contains an atomic type"
  sliceDataOffset_NOT_ATOMIC: u32,

  // Actually a bool, where each thread will AND if they are done.
  // If the value is still TRUE afterwards, then all pixels in the tile are done
  arePixelsDone: atomic<i32>,
  // Same as above, but not atomic, so we can use workgroupUniformLoad()
  // fixes "workgroupUniformLoad must not be called with an argument that contains an atomic type"
  arePixelsDone_NOT_ATOMIC: bool,
}
var<workgroup> _wkgrp: WorkgroupVars;

// Current hair segment processed by the tile.
// All threads (1 per pixel) will test against it.
// This value is only calculated by the first thread.
var<workgroup> _wkgrp_hairSegment: ProjectedHairSegment;

// Thread ID
var<private> _local_invocation_index: u32;
// Per-thread position of the pixel inside the tile.
// Both coordinates are in range: 0..TILE_SIZE
var<private> _pixelInTilePos: vec2u;
// Flag if pixel alpha is saturated and no futher hair segments will change it's color
var<private> _isPixelDone: bool;


// We run a thread per each pixel in a tile.
// A lot of work will be done only on the 1st thread
// (e.g. calculating hair segment raster params),
// rest of the threads will just compare it's pixel coordinates.
//
// See https://research.nvidia.com/sites/default/files/pubs/2011-08_High-Performance-Software-Rasterization/laine2011hpg_paper.pdf
@compute
@workgroup_size(TILE_SIZE, TILE_SIZE, 1)
fn main(
  // global index for entire workgroup
  @builtin(workgroup_id) workgroup_id: vec3<u32>,
  // threadId inside workgroup
  @builtin(local_invocation_index) local_invocation_index: u32,
) {
  let processorId = workgroup_id.x;
  let viewportSize: vec2f = _uniforms.viewport.xy;
  let maxDrawnSegments: u32 = _uniforms.maxDrawnHairSegments;
  let strandsCount: u32 = _hairData.strandsCount;
  let pointsPerStrand: u32 = _hairData.pointsPerStrand;
  _local_invocation_index = local_invocation_index;

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
    _local_invocation_index % TILE_SIZE,
    _local_invocation_index / TILE_SIZE
  );

  // clear memory before starting work
  _clearSlicesHeadPtrs(_pixelInTilePos, processorId);

  // tile count based on screen size. Used to check if tile is valid
  let tileCount2d = getTileCount(params.viewportSizeU32);
  let tileCount = tileCount2d.x * tileCount2d.y;
  // size of task queue
  let tilesToProcess = _hairTileData.drawnTiles;
  var tileIdx = getNextTileIdx(_local_invocation_index, tilesToProcess);

  while (!workgroupUniformLoad(&_wkgrp.hasMoreTiles)) {
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
      if (_local_invocation_index == 0u) {
        atomicStore(&_wkgrp.sliceDataOffset, 0u);
      }
      workgroupBarrier();

      processTile(
        params,
        maxDrawnSegments,
        tileXY,
        depthBin,
        tileBoundsPx
      );
      
      // early out for whole tile TODO
      if (checkAllPixelsInWkgrpDone(_local_invocation_index)) {
        // debugColorWholeTile(tileBoundsPx, vec4f(1., 0., 0., 1.));
        break;
      }
    } // END: iterate over depth bins

    // move to next tile
    tileIdx = getNextTileIdx(_local_invocation_index, tilesToProcess);
  }
}

fn processTile(
  params: FineRasterParams,
  maxDrawnSegments: u32,
  tileXY: vec2u,
  depthBin: u32,
  tileBoundsPx: vec4u
) {
  let MAX_PROCESSED_SEGMENTS = params.strandsCount * params.pointsPerStrand; // just in case
  
  let tileDepth = _getTileDepth(params.viewportSizeU32, tileXY, depthBin); // TODO only on first thread
  if (tileDepth.y == 0.0) { return; } // no depth written means empty tile
  var segmentPtr = _getTileSegmentPtr(params.viewportSizeU32, tileXY, depthBin);

  var segmentData = vec3u(); // [strandIdx, segmentIdx, nextPtr]
  var processedSegmentCnt = 0u;

  // for each segment:
  //    iterate over tile's pixels and write color to appropriate depth-slice
  while (processedSegmentCnt < MAX_PROCESSED_SEGMENTS){
    let hasValidSegment = _getTileSegment(maxDrawnSegments, segmentPtr, &segmentData);

    if (hasValidSegment && _local_invocation_index == 0u) {
      let projParams = ProjectHairParams(
        params.pointsPerStrand,
        params.viewportSize,
        params.fiberRadius,
      );
      _wkgrp_hairSegment = projectHairSegment(
        projParams,
        segmentData.x, // strandIdx,
        segmentData.y  // segmentIdx
      );
    }
    workgroupBarrier();

    if (hasValidSegment && !_isPixelDone) {
      processHairSegment(
        params,
        tileBoundsPx, tileDepth,
        segmentData.x, segmentData.y // strandIdx, segmentIdx
      );
    }
    workgroupBarrier();


    // break condition if has no more hair segments in a tile
    if (!hasValidSegment && _local_invocation_index == 0u) {
      // set invalid index that will trigger 'break;'
      atomicStore(&_wkgrp.sliceDataOffset, SLICE_DATA_PER_PROCESSOR_COUNT);
    }

    // trigger 'break;' if:
    //   1. run out of PPLL memory
    //   2. no more hair segments in a tile (see $hasValidSegment)
    let sliceDataOffset = getUniformSliceDataOffset(_local_invocation_index);
    if (!_hasMoreSliceDataSlots(sliceDataOffset)) { break; }

    // move to next segment
    processedSegmentCnt = processedSegmentCnt + 1;
    segmentPtr = segmentData.z;
  }

  let sliceDataOffset = getUniformSliceDataOffset(_local_invocation_index);
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
/// Tile/slice processing utils

fn getNextTileIdx(local_invocation_index: u32, tileCount: u32) -> u32 {
  if (local_invocation_index == 0u) {
    _wkgrp.currentTileIdx = atomicAdd(&_hairRasterizerResults.tileQueueAtomicIdx, 1u);
    _wkgrp.hasMoreTiles = _wkgrp.currentTileIdx >= tileCount;
  }
  workgroupBarrier();

  let idx = workgroupUniformLoad(&_wkgrp.currentTileIdx);
  return _hairTileData.data[idx];
}

fn checkAllPixelsInWkgrpDone(local_invocation_index: u32) -> bool {
  // set initial bool to TRUE
  if (local_invocation_index == 0u) {
    atomicStore(&_wkgrp.arePixelsDone, 1);
  }
  workgroupBarrier();

  // ATOMIC_AND across all 
  // the select() semantic in WGLS is ..........
  // Just read it as '_isPixelDone ? 1 : 0'
  atomicAnd(&_wkgrp.arePixelsDone, select(0, 1, _isPixelDone));
  workgroupBarrier();

  // broadcast the result
  // fixes: "workgroupUniformLoad must not be called with an argument that contains an atomic type"
  if (local_invocation_index == 0u) {
    let v = atomicLoad(&_wkgrp.arePixelsDone);
    _wkgrp.arePixelsDone_NOT_ATOMIC = v > 0;
  }

  // has implicit barrier
  return workgroupUniformLoad(&_wkgrp.arePixelsDone_NOT_ATOMIC);
}

// Cannot call workgroupUniformLoad() on atomic<u32>. Copy to normal u32 first
fn getUniformSliceDataOffset(local_invocation_index: u32) -> u32 {
  if (local_invocation_index == 0u) {
    _wkgrp.sliceDataOffset_NOT_ATOMIC = atomicLoad(&_wkgrp.sliceDataOffset);
  }
  return workgroupUniformLoad(&_wkgrp.sliceDataOffset_NOT_ATOMIC);
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
