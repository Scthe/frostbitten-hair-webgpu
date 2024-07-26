import { CONFIG } from '../../constants.ts';
import { FULLSCREEN_TRIANGLE_POSITION } from '../_shaderSnippets/fullscreenTriangle.wgsl.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';

export const SHADER_PARAMS = {
  bindings: {
    renderUniforms: 0,
    depthTexture: 1,
  },
};

///////////////////////////
/// SHADER CODE
///////////////////////////
const b = SHADER_PARAMS.bindings;

export const SHADER_CODE = () => /* wgsl */ `

${FULLSCREEN_TRIANGLE_POSITION}

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}

@group(0) @binding(${b.depthTexture})
var _depthTexture: texture_depth_2d;


@vertex
fn main_vs(
  @builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4f {
  return getFullscreenTrianglePosition(VertexIndex);
}


@fragment
fn main_fs(
  @builtin(position) positionPxF32: vec4<f32>
) -> @location(0) vec4<f32> {
  let previewSize = _uniforms.dbgShadowMapPreviewSize;
  // THIS DEPENDS ON THE POSITION OF THE PREVIEW ON SCREEN. CHANGE .TS CODE TOO!
  let previewPosition = vec2f(
    ${CONFIG.shadows.debugViewPosition[0]},
    ${CONFIG.shadows.debugViewPosition[1]},
  );

  let shadowMapSize: f32 = ${CONFIG.shadows.textureSize}.0;
  let sample_0_1 = (positionPxF32.xy - previewPosition) / vec2f(previewSize, previewSize);
  let fragPositionPx = vec2u(shadowMapSize * sample_0_1);
  
  let depthTextSamplePx: vec2i = vec2i(i32(fragPositionPx.x), i32(fragPositionPx.y)); // wgpu's naga requiers vec2i..
  var depth: f32 = 1.0 - textureLoad(_depthTexture, depthTextSamplePx, 0);

  return vec4(depth, depth, depth, 1.0);
  // return vec4(sample_0_1.xy, 0., 1.0);
}

`;
