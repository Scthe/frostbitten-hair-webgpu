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

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}


@vertex
fn main_vs(
  @location(0) inWorldPos : vec3f,
) -> @builtin(position) vec4f {
  let mvpMatrix = _uniforms.mvpShadowSourceMatrix;
  return mvpMatrix * vec4<f32>(inWorldPos.xyz, 1.0);
}


@fragment
fn main_fs() -> @location(0) vec4<f32> {
  return vec4(0.0);
}
`;
