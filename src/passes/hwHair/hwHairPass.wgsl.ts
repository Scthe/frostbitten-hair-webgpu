import { BUFFER_HAIR_DATA } from '../../scene/hair/hairDataBuffer.ts';
import { BUFFER_HAIR_POINTS_POSITIONS } from '../../scene/hair/hairPointsPositionsBuffer.ts';
import { BUFFER_HAIR_SHADING } from '../../scene/hair/hairShadingBuffer.ts';
import { BUFFER_HAIR_TANGENTS } from '../../scene/hair/hairTangentsBuffer.ts';
import * as SHADER_SNIPPETS from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import { HW_RASTERIZE_HAIR } from './shaderImpl/hwRasterizeHair.wgsl.ts';

export const SHADER_PARAMS = {
  bindings: {
    renderUniforms: 0,
    hairPositions: 1,
    hairTangents: 2,
    hairData: 3,
    hairShading: 4,
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
${BUFFER_HAIR_DATA(b.hairData)}
${BUFFER_HAIR_SHADING(b.hairShading, 'read')}


struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) tangentWS: vec4f,
  @location(1) @interpolate(flat) strandIdx: u32,
  @location(2) tFullStrand: f32,
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

  let strandData = getHairStrandData(
    _hairData.pointsPerStrand,
    inVertexIndex
  );

  var result: VertexOutput;
  result.position = hwRasterResult.position;
  result.tangentWS = _uniforms.modelMatrix * vec4f(hwRasterResult.tangentOBJ, 1.);
  result.strandIdx = strandData.strandIdx;
  result.tFullStrand = strandData.tFullStrand;
  return result;
}


struct FragmentOutput {
  @location(0) color: vec4<f32>,
  @location(1) normals: vec2<f32>,
};

@fragment
fn main_fs(fragIn: VertexOutput) -> FragmentOutput {
  let displayMode = getDisplayMode();

  var result: FragmentOutput;
  // result.color = vec4f(1.0, 0.0, 0.0, 1.0);
  // let c = 0.4;
  // result.color = vec4f(c, c, c, 1.0);

  if (displayMode == DISPLAY_MODE_HW_RENDER) {
    var color = _sampleShading(fragIn.strandIdx, fragIn.tFullStrand);
    result.color = vec4f(color.rgb, 1.0);
    // dbg: gradient root -> tip
    // result.color = mix(vec4f(1., 0., 0., 1.0), vec4f(0., 0., 1., 1.0), fragIn.tFullStrand);
  } else {
    result.color.a = 0.0;
  }

  let tangent = normalize(fragIn.tangentWS.xyz);
  result.normals = encodeOctahedronNormal(tangent);
  
  return result;
}
`;
