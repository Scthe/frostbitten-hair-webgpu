import { CONFIG } from '../../constants.ts';
import * as SHADER_SNIPPETS from '../_shaderSnippets/shaderSnippets.wgls.ts';
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

${SHADER_SNIPPETS.GET_MVP_MAT}
${SHADER_SNIPPETS.GENERIC_UTILS}
${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}


struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) @interpolate(flat) axisIdx: u32,
};

const AXIS_X = 0u;
const AXIS_Y = 1u;
const AXIS_Z = 2u;

const LINE_LENGTH = ${CONFIG.colliderGizmo.lineLength};
const LINE_WIDTH = ${CONFIG.colliderGizmo.lineWidth};

@vertex
fn main_vs(
  @builtin(instance_index) inInstanceIdx: u32,
  @builtin(vertex_index) inVertexIndex : u32
) -> VertexOutput {
  let colSphereWS = _uniforms.collisionSpherePosition;
  let viewMatrix = _uniforms.viewMatrix;
  let projMatrix = _uniforms.projMatrix;

  let axisVec = getAxisVector(inInstanceIdx);

  let lineStartWS = vec4f(colSphereWS.xyz + axisVec * LINE_WIDTH, 1.0);
  let lineEndWS   = vec4f(lineStartWS.xyz + axisVec * LINE_LENGTH, 1.0);
  let lineStartVS = viewMatrix * lineStartWS;
  let lineEndVS = viewMatrix * lineEndWS;
  let tangentVS = lineEndVS.xyz - lineStartVS.xyz;
  let up: vec3f = safeNormalize3(cross(tangentVS.xyz, vec3f(0., 0., 1.)));

  let linePointVS = select(lineEndVS, lineStartVS, (inVertexIndex & 0x01u) == 0u);
  let deltaSign: f32 = select(1.0, -1.0, inVertexIndex == 2u || inVertexIndex == 3u || inVertexIndex == 4u);
  let positionVs = linePointVS.xyz + deltaSign * up * LINE_WIDTH;

  var result: VertexOutput;
  result.position = projMatrix * vec4f(positionVs, 1.0);
  result.axisIdx = inInstanceIdx;
  return result;
}


@fragment
fn main_fs(
  fragIn: VertexOutput
) -> @location(0) vec4f {
  // return vec4f(1.0, 0.0, 0.0, 1.0);
  let axisVec = getAxisVector(fragIn.axisIdx);
  
  let isActive = fragIn.axisIdx == _uniforms.gizmoActiveState;
  let stateMod: f32 = select(0.5, 1.0, isActive);
  
  return vec4f(axisVec.rgb * stateMod, 1.0);
}


fn getAxisVector(axisIdx: u32) -> vec3f {
  if (axisIdx == AXIS_Y) { return vec3f(0.0, 1.0, 0.0); }
  if (axisIdx == AXIS_Z) { return vec3f(0.0, 0.0, 1.0); }
  return vec3f(1.0, 0.0, 0.0);
}
`;
