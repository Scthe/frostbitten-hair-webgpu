import { FULLSCREEN_TRIANGLE_POSITION } from '../_shaderSnippets/fullscreenTriangle.wgsl.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import { BUFFER_HAIR_TILES_RESULT } from '../swHair/shared/hairTilesResultBuffer.ts';
import * as SHADER_SNIPPETS from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { BUFFER_HAIR_TILE_SEGMENTS } from '../swHair/shared/hairTileSegmentsBuffer.ts';
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
  // @builtin(frag_depth) fragDepth: f32,
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

  let tileXY = getHairTileXY_FromPx(fragPositionPx);
  let displayMode = getDisplayMode();

  if (displayMode == DISPLAY_MODE_TILES) {
    result.color = renderTileSegmentCount(viewportSizeU32, tileXY);

  } else {
    var color = vec4f(0.0, 0.0, 0.0, 1.0);
    color = _getRasterizerResult(viewportSizeU32, fragPositionPx);
    
    // fill tile bg with some pattern
    if (color.a <= 0. && getDbgFinalModeShowTiles()) {
      let dbgTileColor = getDebugTileColor(tileXY);
      color = dbgTileColor + color * color.a;
    }
    result.color = color;

    // write depth to depth bufer
    // let hairResult = _getTileDepth(viewportSizeU32, tileXY);
    // result.fragDepth = hairResult.x; // TODO convert depthMin to f32 etc. first this pass has depth test ON!
  }

  return result;
}


fn getDebugTileColor(tileXY: vec2u) -> vec4f {
  var dbgTileColor = vec4f(1.0);
  dbgTileColor.r = 0.0;
  dbgTileColor.g = f32(tileXY.x % 2) / 2.0;
  dbgTileColor.b = f32(tileXY.y % 2) / 2.0;
  return dbgTileColor;
}

fn renderTileSegmentCount(
  viewportSize: vec2u,
  tileXY: vec2u
) -> vec4f {
  var color = vec4f(0.0, 0.0, 0.0, 1.0);

  // output: segment count in each tile normalized by UI provided value
  let maxSegmentsCount = getDbgTileModeMaxSegments();
  let segments = getSegmentCountInTiles(viewportSize, maxSegmentsCount, tileXY);
  color.r = f32(segments) / f32(maxSegmentsCount);
  color.g = 1.0 - color.r;

  // dbg: tile bounds
  // let tileIdx: u32 = getHairTileIdx(viewportSize, tileXY, 0u);
  // color.r = f32((tileIdx * 17) % 33) / 33.0;
  // color.a = 1.0;
  
  if (segments == 0u) {
    discard;
  }
  return color;
}

fn getSegmentCountInTiles(
  viewportSize: vec2u,
  maxSegmentsCount: u32,
  tileXY: vec2u
) -> u32 {
  let maxDrawnSegments: u32 = _uniforms.maxDrawnHairSegments;
  var segmentData = vec3u();
  var count = 0u;

  for (var binIdx = 0u; binIdx < TILE_DEPTH_BINS_COUNT; binIdx++) {
    var segmentPtr = _getTileSegmentPtr(viewportSize, tileXY, binIdx);

    while (count < maxSegmentsCount) {
      if (_getTileSegment(maxDrawnSegments, segmentPtr, &segmentData)) {
        count = count + 1;
        segmentPtr = segmentData.z;
      } else {
        break;
      }
    }
  }

  return count;
}

`;
