import { FULLSCREEN_TRIANGLE_POSITION } from '../_shaderSnippets/fullscreenTriangle.wgsl.ts';
import { SNIPPET_NOISE } from '../_shaderSnippets/noise.wgsl.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';

export const SHADER_PARAMS = {
  bindings: {
    renderUniforms: 0,
  },
};

///////////////////////////
/// SHADER CODE
///////////////////////////
const b = SHADER_PARAMS.bindings;

export const SHADER_CODE = () => /* wgsl */ `

${FULLSCREEN_TRIANGLE_POSITION}
${SNIPPET_NOISE}

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}


@vertex
fn main_vs(
  @builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4f {
  return getFullscreenTrianglePosition(VertexIndex);
}


// TODO finish
@fragment
fn main_fs(
  @builtin(position) positionPxF32: vec4<f32>
) -> @location(0) vec4<f32> {
  let color0 = _uniforms.background.color0;
  let color1 = _uniforms.background.color1;
  let noiseScale = _uniforms.background.noiseScale;
  let gradientStrength = _uniforms.background.gradientStrength;

  // get noise
  let uv = positionPxF32.xy / _uniforms.viewport.xy;
  let c = fractalNoise(uv, noiseScale) * 0.5 + 0.5; // TODO oscylate scale between 2 values?
  
  // mix colors
  var color = mix(color0, color1, c);
  color = mix(color, vec3f(1.0 - uv.y), gradientStrength);
  return vec4(color.xyz, 1.0);
}

`;
