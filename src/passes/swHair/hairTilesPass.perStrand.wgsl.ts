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

// TODO remove this impl? It is actually quite slow

export const SHADER_PARAMS = {
  workgroupSizeX: 32, // TODO [LOW] set better values
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


@compute
@workgroup_size(${c.workgroupSizeX}, 1, 1)
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
  let hairDepthBoundsVS = getHairDepthBoundsVS(mvMatrix);

  let strandIdx = global_id.x;
  
  if (strandIdx >= strandsCount) { return; }

  // get rasterize data
  let swHairRasterizeParams = SwHairRasterizeParams(
    mvMatrix,
    _uniforms.projMatrix,
    pointsPerStrand,
    viewportSize,
    _uniforms.fiberRadius
  );
  var v00: vec2f;
  var v01: vec2f;
  var v10: vec2f;
  var v11: vec2f;
  var depthsProj0: vec2f;
  var depthsProj1: vec2f;

  // strand root
  swRasterizeHairPoint(
    swHairRasterizeParams,
    strandIdx, 0u,
    &v00, &v01, &depthsProj0
  );

  
  for (var segmentIdx: u32 = 0u; segmentIdx < pointsPerStrand - 1; segmentIdx += 1u) {
    // raster segment end
    swRasterizeHairPoint(
      swHairRasterizeParams,
      strandIdx, segmentIdx + 1u,
      &v10, &v11, &depthsProj1
    );
    let sw = SwRasterizedHair(
      v00, v01, v10, v11,
      vec4f(depthsProj0, depthsProj1)
    );

    // get segment bounds and convert to tiles
    let bounds4f = getRasterizedHairBounds(sw, viewportSize);
    let boundRectMin = bounds4f.xy;
    let boundRectMax = bounds4f.zw;
    let tileMinXY: vec2u = getHairTileXY_FromPx(vec2u(boundRectMin));
    let tileMaxXY: vec2u = getHairTileXY_FromPx(vec2u(boundRectMax));

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

    // move to next segment
    v00 = v10;
    v01 = v11;
    depthsProj0 = depthsProj1;
  }
}

`;
