import { SDFCollider } from '../../scene/sdfCollider/sdfCollider.ts';
import { assignValueFromConstArray } from '../_shaderSnippets/nagaFixes.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';

export const SHADER_PARAMS = {
  bindings: {
    renderUniforms: 0,
    sdfTexture: 1,
    sdfSampler: 2,
  },
};

///////////////////////////
/// SHADER CODE
///////////////////////////
const b = SHADER_PARAMS.bindings;

export const SHADER_CODE = () => /* wgsl */ `

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}
${SDFCollider.TEXTURE_SDF(b.sdfTexture, b.sdfSampler)}


struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) positionWS: vec4f,
  @location(1) uv: vec2f,
  @location(2) @interpolate(flat) depthSlice: f32,
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
  let boundsMin = _uniforms.sdf.boundsMin.xyz;
  let boundsMax = _uniforms.sdf.boundsMax.xyz;
  let depthSlice = getSdfDebugDepthSlice();

  ${assignValueFromConstArray('uv: vec2f', 'POSITIONS', 6, 'inVertexIndex')}
  var positionWS = mix(boundsMin, boundsMax, vec3f(uv, depthSlice));

  var result: VertexOutput;
  let vpMatrix = _uniforms.vpMatrix;

  result.position = vpMatrix * vec4f(positionWS, 1.0);
  result.positionWS = vec4f(positionWS, 1.0);
  result.uv = uv;
  result.depthSlice = depthSlice;
  return result;
}


@fragment
fn main_fs(
  fragIn: VertexOutput
) -> @location(0) vec4f {
  let boundsMin = _uniforms.sdf.boundsMin.xyz;
  let boundsMax = _uniforms.sdf.boundsMax.xyz;
  let depthSlice = getSdfDebugDepthSlice();
  let opacity = select(1.0, 0.75, isSdfDebugSemiTransparent());

  var color = vec3f(0., 0., 0.);
  
  let samplePos = vec3f(fragIn.uv, depthSlice);
  // let value = textureSampleLevel(_sdfTexture, _sdfSampler, samplePos, 0.0).x;
  
  let positionWS = fragIn.positionWS.xyz;
  let value = sampleSDFCollider(boundsMin, boundsMax, positionWS);
  if (value > 0.) { // outside
    color.r = value;
    color.r = 1.;
  } else {
    color.b = value;
    color.b = 1.;
  }
  
  // slight transparency for a bit easier debug
  return vec4f(color.xyz, opacity);
}


`;
