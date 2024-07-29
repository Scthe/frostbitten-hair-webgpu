import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import * as SHADER_SNIPPETS from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { BUFFER_HAIR_POINTS_POSITIONS } from '../../scene/hair/hairPointsPositionsBuffer.ts';
import { BUFFER_HAIR_TANGENTS } from '../../scene/hair/hairTangentsBuffer.ts';
import { HW_RASTERIZE_HAIR } from '../hwHair/shaderImpl/hwRasterizeHair.wgsl.ts';

export const SHADER_PARAMS = {
  bindings: {
    renderUniforms: 0,
    hairPositions: 1,
    hairTangents: 2,
  },
};

///////////////////////////
/// SHADER CODE
///
/// We are using hardware rasterizer as it's less hassle than software one
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


@vertex
fn main_vs(
  @builtin(vertex_index) inVertexIndex : u32
) -> @builtin(position) vec4f {
  let hwRasterParams = HwHairRasterizeParams(
    _uniforms.shadows.sourceModelViewMat,
    _uniforms.shadows.sourceProjMatrix,
    getShadowFiberRadius(),
    inVertexIndex
  );
  let hwRasterResult = hwRasterizeHair(hwRasterParams);

  return hwRasterResult.position;
}


@fragment
fn main_fs() -> @location(0) vec4<f32> {
  return vec4(0.0);
}
`;
