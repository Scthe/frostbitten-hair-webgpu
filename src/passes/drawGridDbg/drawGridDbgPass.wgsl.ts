import { CONFIG } from '../../constants.ts';
import { assignValueFromConstArray } from '../_shaderSnippets/nagaFixes.ts';
import { GENERIC_UTILS } from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import { BUFFER_GRID_DENSITY_VELOCITY } from '../simulation/grids/densityVelocityGrid.wgsl.ts';
import { GRID_UTILS } from '../simulation/grids/grids.wgsl.ts';

export const SHADER_PARAMS = {
  bindings: {
    renderUniforms: 0,
    gridBuffer: 1,
  },
};

///////////////////////////
/// SHADER CODE
///////////////////////////
const b = SHADER_PARAMS.bindings;

export const SHADER_CODE = () => /* wgsl */ `

${GENERIC_UTILS}
${GRID_UTILS(CONFIG.hairSimulation.densityVelocityGrid.dims)}

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}
${BUFFER_GRID_DENSITY_VELOCITY(b.gridBuffer, 'read')}

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) positionWS: vec4f,
  @location(1) uv: vec2f,
};

const POSITIONS = array<vec2f, 6>(
  vec2(0, 0),
  vec2(0, 1),
  vec2(1, 0),
  vec2(0, 1),
  vec2(1, 1),
  vec2(1, 0)
);


@vertex
fn main_vs(
  @builtin(vertex_index) inVertexIndex : u32 // 0..6
) -> VertexOutput {
  let boundsMin = _uniforms.gridData.boundsMin.xyz;
  let boundsMax = _uniforms.gridData.boundsMax.xyz;
  let depthSlice = getGridDebugDepthSlice();

  // TODO [LOW] same as SDF. Move to shared lib
  ${assignValueFromConstArray('uv: vec2f', 'POSITIONS', 6, 'inVertexIndex')}
  var positionWS = mix(boundsMin, boundsMax, vec3f(uv, depthSlice));

  var result: VertexOutput;
  let vpMatrix = _uniforms.vpMatrix;

  result.position = vpMatrix * vec4f(positionWS, 1.0);
  result.positionWS = vec4f(positionWS, 1.0);
  result.uv = uv;
  return result;
}


@fragment
fn main_fs(
  fragIn: VertexOutput
) -> @location(0) vec4f {
  let boundsMin = _uniforms.gridData.boundsMin.xyz;
  let boundsMax = _uniforms.gridData.boundsMax.xyz;
  let opacity = 0.6;
  
  // TODO [LOW] this is world space, while grid is object space. Tho it's just a debug view, so..
  let positionWS = fragIn.positionWS.xyz;

  var color = vec3f(0., 0., 0.);
  let value = _getGridDensityVelocity(
    boundsMin,
    boundsMax,
    positionWS
  );
  // color.r = select(0.0, 1.0, value.density != 0);
  color.r = value.density; // TODO debug wind too
  
  // slight transparency for a bit easier debug
  return vec4f(color.xyz, opacity);
}


`;
