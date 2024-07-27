import { BUFFER_HAIR_POINTS_POSITIONS } from '../../scene/hair/hairPointsPositionsBuffer.ts';
import { BUFFER_HAIR_TANGENTS } from '../../scene/hair/hairTangentsBuffer.ts';
import * as SHADER_SNIPPETS from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import { HW_RASTERIZE_HAIR } from './shaderImpl/swRasterizeHair.wgsl.ts';

export const SHADER_PARAMS = {
  bindings: {
    renderUniforms: 0,
    hairPositions: 1,
    hairTangents: 2,
  },
};

///////////////////////////
/// SHADER CODE
///////////////////////////
const b = SHADER_PARAMS.bindings;

export const SHADER_CODE = () => /* wgsl */ `

${SHADER_SNIPPETS.GET_MVP_MAT}
${SHADER_SNIPPETS.NORMALS_UTILS}
${SHADER_SNIPPETS.GENERIC_UTILS}
${HW_RASTERIZE_HAIR}

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}
${BUFFER_HAIR_POINTS_POSITIONS(b.hairPositions)}
${BUFFER_HAIR_TANGENTS(b.hairTangents)}


struct VertexOutput {
  @builtin(position) position: vec4<f32>,
};


@vertex
fn main_vs(
  @builtin(vertex_index) inVertexIndex : u32
) -> VertexOutput {
  let hwRasterParams = HwHairRasterizeParams(
    _uniforms.modelViewMat,
    _uniforms.projMatrix,
    _uniforms.fiberRadius,
    inVertexIndex
  );
  let hwRasterResult = hwRasterizeHair(hwRasterParams);

  var result: VertexOutput;
  result.position = hwRasterResult.position;
  return result;
}


@fragment
fn main_fs(fragIn: VertexOutput) -> @location(0) vec4<f32> {
  let color = vec3(1.0, 0.0, 0.0);
  return vec4(color.xyz, 1.0);
}
`;
