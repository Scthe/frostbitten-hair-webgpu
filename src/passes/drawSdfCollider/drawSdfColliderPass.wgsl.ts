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
  let boundsMin = _uniforms.sdf.boundsMin.xyz;
  let boundsMax = _uniforms.sdf.boundsMax.xyz;
  let depthSlice = getSdfDebugDepthSlice();

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
  let boundsMin = _uniforms.sdf.boundsMin.xyz;
  let boundsMax = _uniforms.sdf.boundsMax.xyz;
  let depthSlice = getSdfDebugDepthSlice();
  let opacity = select(1.0, 0.75, isSdfDebugSemiTransparent());

  var color = vec3f(0., 0., 0.);
  
  // let samplePos = vec3f(fragIn.uv, depthSlice);
  // let value = textureSampleLevel(_sdfTexture, _sdfSampler, samplePos, 0.0).x;
  
  // TODO [LOW] this is world space, while SDF is object space. Tho it's just a debug view, so..
  let positionOS = fragIn.positionOS.xyz;
  let value = sampleSDFCollider(boundsMin, boundsMax, positionOS);
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
