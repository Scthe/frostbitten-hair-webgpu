import { FULLSCREEN_TRIANGLE_POSITION } from '../_shaderSnippets/fullscreenTriangle.wgsl.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import { BUFFER_HAIR_TILES_RESULT } from '../swHair/shared/hairTilesResultBuffer.ts';
import * as SHADER_SNIPPETS from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { BUFFER_HAIR_SEGMENTS_PER_TILE } from '../swHair/shared/hairSegmentsPerTileBuffer.ts';

export const SHADER_PARAMS = {
  bindings: {
    renderUniforms: 0,
    hairResult: 1,
    segmentsPerTileBuffer: 2,
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

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}
${BUFFER_HAIR_TILES_RESULT(b.hairResult, 'read')}
${BUFFER_HAIR_SEGMENTS_PER_TILE(b.segmentsPerTileBuffer, 'read')}


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
  let fragPositionPx = vec2u(u32(positionPxF32.x), viewportSizeU32.y - u32(positionPxF32.y));

  // sample software rasterizer
  // .x is close, .y is far depth
  let hairResult = _getTileDepth(viewportSizeU32, fragPositionPx);
  let segmentPtr = _getTileSegmentPtr(viewportSizeU32, fragPositionPx);

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
    let maxSegmentsCount = getDbgTileModeMaxSegments();
    let segments = getSegmentCountInTiles(viewportSizeU32, maxSegmentsCount, fragPositionPx);
    color.r = f32(segments) / f32(maxSegmentsCount);
    color.g = 1.0 - color.r;

  } else {
    color.g = 1.0;
    // result.fragDepth = hairResult.x; // this pass has depth test ON!
  }

  result.color = color;
  return result;
}

fn getSegmentCountInTiles(
  viewportSize: vec2u,
  maxSegmentsCount: u32,
  fragPositionPx: vec2u
) -> u32 {
  let maxDrawnSegments: u32 = _uniforms.maxDrawnHairSegments;
  var segmentPtr = _getTileSegmentPtr(viewportSize, fragPositionPx);
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
