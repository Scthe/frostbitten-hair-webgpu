import { FULLSCREEN_TRIANGLE_POSITION } from '../_shaderSnippets/fullscreenTriangle.wgsl.ts';
import { SNIPPET_NOISE } from '../_shaderSnippets/noise.wgsl.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';

export const SHADER_PARAMS = {
  bindings: {
    renderUniforms: 0,
  },
};

const parseHexColor = (a: string) => {
  a = a.startsWith('#') ? a.substring(1) : a;
  const toF = (b: number) => parseInt(a.substring(b, b + 2), 16) / 255.0;
  return `vec3f(${toF(0)}, ${toF(2)}, ${toF(4)})`;
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
  let uv = positionPxF32.xy / _uniforms.viewport.xy;
  let scale = 5.0;
  let c = fractalNoise(uv, scale) * 0.5 + 0.5; // TODO oscylate scale between 2 values?
  
  // blues
  let color0 = ${parseHexColor('#16a2bc')};
  let color1 = ${parseHexColor('#0e6778')};
  // let color1 = ${parseHexColor('#1376a5')};

  // purple
  // let color0 = ${parseHexColor('#d31897')};
  // let color1 = ${parseHexColor('#a51376')};

  // skin
  // let color0 = ${parseHexColor('#eeab65')};
  // let color1 = ${parseHexColor('#eb9e4e')};

  // var color = vec3f(0.0, c, 0.0);
  var color = mix(color0, color1, c);
  color = mix(color, vec3f(1.0 - uv.y), 0.5);
  return vec4(color.xyz, 1.0);
}

`;
