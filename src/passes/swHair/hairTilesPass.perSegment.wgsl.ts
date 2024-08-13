import { BUFFER_HAIR_DATA } from '../../scene/hair/hairDataBuffer.ts';
import { BUFFER_HAIR_POINTS_POSITIONS } from '../../scene/hair/hairPointsPositionsBuffer.ts';
import { BUFFER_HAIR_TANGENTS } from '../../scene/hair/hairTangentsBuffer.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import * as SHADER_SNIPPETS from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { SW_RASTERIZE_HAIR } from './shaderImpl/swRasterizeHair.wgsl.ts';
import { BUFFER_HAIR_TILES_RESULT } from './shared/hairTilesResultBuffer.ts';
import { BUFFER_HAIR_TILE_SEGMENTS } from './shared/hairTileSegmentsBuffer.ts';
import { SHADER_TILE_UTILS } from './shaderImpl/tileUtils.wgsl.ts';
import {
  TILE_PASSES_BINDINGS,
  TILE_PASSES_SHARED,
} from './shaderImpl/tilePassesShared.wgsl.ts';
import { CONFIG } from '../../constants.ts';

// TODO [MEDIUM] try workgroup shared for positions and tangents arrays. Probably after you remove strand-based impl.

export const SHADER_PARAMS = {
  workgroupSizeX: 4, // TODO [LOW] set even better values? Current seem OK.
  // A bit inefficient if strand has less points. But it's not THAT inefficient suprisingly?
  // A lot of combinations of XY sizes result in 2.2-2.3ms.
  // TODO [MEDIUM] use CONFIG.pointsPerStrand, though does not matter for current asset.
  workgroupSizeY: 32,
  bindings: TILE_PASSES_BINDINGS,
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
${TILE_PASSES_SHARED}

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}
${BUFFER_HAIR_DATA(b.hairData)}
${BUFFER_HAIR_POINTS_POSITIONS(b.hairPositions)}
${BUFFER_HAIR_TANGENTS(b.hairTangents)}
${BUFFER_HAIR_TILES_RESULT(b.tilesBuffer, 'read_write')}
${BUFFER_HAIR_TILE_SEGMENTS(b.tileSegmentsBuffer, 'read_write')}

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
  let swHairRasterizeParams = SwHairRasterizeParams(
    pointsPerStrand,
    viewportSize,
    _uniforms.fiberRadius
  );
  let sw = swRasterizeHair(
    swHairRasterizeParams,
    strandIdx,
    segmentIdx
  );

  let hairDepthBoundsVS = getHairDepthBoundsVS(mvMatrix);

  // get segment bounds and convert to tiles
  let bounds4f = getRasterizedHairBounds(sw, viewportSize);
  let boundRectMin = bounds4f.xy;
  let boundRectMax = bounds4f.zw;
  let tileMinXY: vec2u = getHairTileXY_FromPx(vec2u(boundRectMin));
  let tileMaxXY: vec2u = getHairTileXY_FromPx(vec2u(boundRectMax));
  // reject degenerate strands from physics simulation
  let tileSize = (tileMaxXY - tileMinXY) + vec2u(1u, 1u);
  // number tuned for Sintel's front hair lock
  if (tileSize.x * tileSize.y > INVALID_TILES_PER_SEGMENT_THRESHOLD) {
    return;
  } 

  // for each affected tile
  for (var tileY: u32 = tileMinXY.y; tileY <= tileMaxXY.y; tileY += 1u) {
  for (var tileX: u32 = tileMinXY.x; tileX <= tileMaxXY.x; tileX += 1u) {
    processTile(
      sw,
      viewportSizeU32,
      projMatrixInv,
      maxDrawnSegments,
      hairDepthBoundsVS,
      vec2u(tileX, tileY),
      strandIdx, segmentIdx
    );
  }}
}

`;
