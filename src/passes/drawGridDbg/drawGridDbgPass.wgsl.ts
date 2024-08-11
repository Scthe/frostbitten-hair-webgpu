import { GridDebugValue } from '../../constants.ts';
import { assignValueFromConstArray } from '../_shaderSnippets/nagaFixes.ts';
import { GENERIC_UTILS } from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import { BUFFER_GRID_DENSITY_GRADIENT_AND_WIND } from '../simulation/grids/densityGradAndWindGrid.wgsl.ts';
import { BUFFER_GRID_DENSITY_VELOCITY } from '../simulation/grids/densityVelocityGrid.wgsl.ts';
import { GRID_UTILS } from '../simulation/grids/grids.wgsl.ts';

export const SHADER_PARAMS = {
  bindings: {
    renderUniforms: 0,
    densityVelocityBuffer: 1,
    densityGradWindBuffer: 2,
  },
};

///////////////////////////
/// SHADER CODE
///////////////////////////
const b = SHADER_PARAMS.bindings;

export const SHADER_CODE = () => /* wgsl */ `

${GENERIC_UTILS}
${GRID_UTILS}

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}

${BUFFER_GRID_DENSITY_VELOCITY(b.densityVelocityBuffer, 'read')}
${BUFFER_GRID_DENSITY_GRADIENT_AND_WIND(b.densityGradWindBuffer, 'read')}

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) positionOS: vec4f,
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
  var positionOS = mix(boundsMin, boundsMax, vec3f(uv, depthSlice));

  var result: VertexOutput;
  let mvpMatrix = _uniforms.mvpMatrix;

  result.position = mvpMatrix * vec4f(positionOS, 1.0);
  result.positionOS = vec4f(positionOS, 1.0);
  result.uv = uv;
  return result;
}


@fragment
fn main_fs(
  fragIn: VertexOutput
) -> @location(0) vec4f {
  let boundsMin = _uniforms.gridData.boundsMin.xyz;
  let boundsMax = _uniforms.gridData.boundsMax.xyz;
  var opacity = 0.6;

  var displayMode = _uniforms.gridData.debugDisplayValue;
  let absTheVector: bool = displayMode >= 16u;
  displayMode = select(displayMode, displayMode - 16u, absTheVector);
  
  let positionOS = fragIn.positionOS.xyz;

  var color = vec3f(0., 0., 0.);
  let densityVelocity = _getGridDensityVelocity(
    boundsMin,
    boundsMax,
    positionOS
  );
  let gridPoint = getClosestGridPoint(
    boundsMin,
    boundsMax,
    positionOS
  );
  let densityGradAndWind = _getGridDensityGradAndWindAtPoint(gridPoint);


  if (displayMode == ${GridDebugValue.VELOCITY}u) {
    getVectorColor(&color, densityVelocity.velocity, absTheVector);
  
  } else if (displayMode == ${GridDebugValue.DENSITY_GRADIENT}u) {
    let grad = densityGradAndWind.densityGrad;
    getVectorColor(&color, grad, absTheVector);
  
  } else if (displayMode == ${GridDebugValue.WIND}u) {
    let windStr = densityGradAndWind.windStrength;
    if (windStr < 0.01) { color.r = 1.0; }
    else if (windStr < 0.99) { color.b = 1.0; }
    else { color.g = 1.0; }

  } else {
    // color.r = select(0.0, 1.0, value.density != 0);
    color.r = densityVelocity.density;
  }

  // slight transparency for a bit easier debug
  return vec4f(color.xyz, opacity);
}

fn getVectorColor(color: ptr<function, vec3f>, v: vec3f, absTheVector: bool) {
  if (length(v) < 0.001){ return; }

  var result = normalize(v);
  if (absTheVector) {
    result = abs(result);
  }

  (*color) = result;
}

`;
