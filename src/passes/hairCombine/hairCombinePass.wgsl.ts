import { FULLSCREEN_TRIANGLE_POSITION } from '../_shaderSnippets/fullscreenTriangle.wgsl.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import { BUFFER_HAIR_TILES_RESULT } from '../swHair/shared/hairTilesResultBuffer.ts';
import * as SHADER_SNIPPETS from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { BUFFER_HAIR_TILE_SEGMENTS } from '../swHair/shared/hairTileSegmentsBuffer.ts';
import { CONFIG } from '../../constants.ts';
import { BUFFER_HAIR_RASTERIZER_RESULTS } from '../swHair/shared/hairRasterizerResultBuffer.ts';
import { SHADER_TILE_UTILS } from '../swHair/shaderImpl/tileUtils.wgsl.ts';

export const SHADER_PARAMS = {
  bindings: {
    renderUniforms: 0,
    tilesBuffer: 1,
    tileSegmentsBuffer: 2,
    rasterizeResultBuffer: 3,
  },
};

///////////////////////////
/// SHADER CODE
/// I wish I could use compute pass, but WGSL has.. problems
///////////////////////////
const b = SHADER_PARAMS.bindings;

export const SHADER_CODE = () => /* wgsl */ `

const TILE_SIZE: u32 = ${CONFIG.hairRender.tileSize}u;

${FULLSCREEN_TRIANGLE_POSITION}
${SHADER_SNIPPETS.GENERIC_UTILS}
${SHADER_TILE_UTILS}

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}
${BUFFER_HAIR_TILES_RESULT(b.tilesBuffer, 'read')}
${BUFFER_HAIR_TILE_SEGMENTS(b.tileSegmentsBuffer, 'read')}
${BUFFER_HAIR_RASTERIZER_RESULTS(b.rasterizeResultBuffer, 'read')}


@vertex
fn main_vs(
  @builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4f {
  return getFullscreenTrianglePosition(VertexIndex);
}

struct FragmentOutput {
  @builtin(frag_depth) fragDepth: f32,
  @location(0) color: vec4<f32>,
};

@fragment
fn main_fs(
  @builtin(position) positionPxF32: vec4<f32>
) -> FragmentOutput {
  var result: FragmentOutput;

  let viewportSize: vec2f = _uniforms.viewport.xy;
  let viewportSizeU32 = vec2u(viewportSize.xy);
  // invert cause it's WebGPU thing
  let fragPositionPx = vec2u(
    u32(positionPxF32.x),
    u32(viewportSize.y - positionPxF32.y)
  );

  // sample software rasterizer
  // .x is close, .y is far depth
  let tileXY = getHairTileXY_FromPx(fragPositionPx);
  // let hairResult = _getTileDepth(viewportSizeU32, fragPositionPx);
  let segmentPtr = _getTileSegmentPtr(viewportSizeU32, tileXY);

  if (segmentPtr == 0){
    // no pixel for software rasterizer, do not override.
    // 0 is the value we cleared the buffer to, so any write with atomicMax()
    // would affect the result. And it's not possible to try to write 0
    // given what software rasterizer stores. E.g. if depth bits were
    // 0, then the point would be on near plane, which is no AS terrible to cull.
    discard;
  }

  let displayMode = getDisplayMode();
  var color = vec4f(0.0, 0.0, 0.0, 1.0);

  if (displayMode == DISPLAY_MODE_TILES) {
    // output: segment count in each tile normalized by UI provided value
    let maxSegmentsCount = getDbgTileModeMaxSegments();
    let segments = getSegmentCountInTiles(viewportSizeU32, maxSegmentsCount, tileXY);
    color.r = f32(segments) / f32(maxSegmentsCount);
    color.g = 1.0 - color.r;

    // dbg: tile bounds
    // let tileIdx: u32 = _getHairTileIdx2222(viewportSizeU32, fragPositionPx);
    // color.r = f32((tileIdx * 17) % 33) / 33.0;
    // color.a = 1.0;

  } else {
    color = _getRasterizerResult(viewportSizeU32, fragPositionPx);
    // color.a = select(0.2, color.w, color.w > 0.);
    // result.fragDepth = hairResult.x; // this pass has depth test ON!
    
    // nothing was explicitly drawn
    // fill tile bg with some pattern
    let hasContent = color.w > 0.;
    let drawDebugTileOverlay = 0;
    if (!hasContent && drawDebugTileOverlay!=0) {
      // color.a = select(0.9, color.w, hasContent); // add some tile bg
      let TILE_SIZE = ${CONFIG.hairRender.tileSize}u;
      var dbgTileColor = vec4f(1.0);
      dbgTileColor.r = 0.0;
      dbgTileColor.g = f32((fragPositionPx.x / TILE_SIZE) % 2) / 2.0;
      dbgTileColor.b = f32((fragPositionPx.y / TILE_SIZE) % 2) / 2.0;
      color = dbgTileColor + color * color.a;
      // color = dbgTileColor;
    }
  }

  result.color = color;
  return result;
}

fn getSegmentCountInTiles(
  viewportSize: vec2u,
  maxSegmentsCount: u32,
  tileXY: vec2u
) -> u32 {
  let maxDrawnSegments: u32 = _uniforms.maxDrawnHairSegments;
  var segmentPtr = _getTileSegmentPtr(viewportSize, tileXY);
  var segmentData = vec3u();
  var count = 0u;
  
  while (count < maxSegmentsCount) {
    if (_getTileSegment(maxDrawnSegments, segmentPtr, &segmentData)) {
      count = count + 1;
      segmentPtr = segmentData.z;
    } else {
      break;
    }
  }

  return count;
}

`;
