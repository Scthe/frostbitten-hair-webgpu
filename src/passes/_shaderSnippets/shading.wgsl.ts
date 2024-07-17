export const DEFAULT_COLOR: [number, number, number] = [0.9, 0.9, 0.9];

/** https://github.com/Scthe/WebFX/blob/master/src/shaders/sintel.frag.glsl#L135 */
export const SNIPPET_SHADING = /* wgsl */ `

const PI: f32 = ${Math.PI};

struct Material {
  positionWS: vec3f,
  normal: vec3f,
  toEye: vec3f,
  // disney pbr:
  albedo: vec3f,
  roughness: f32,
  isMetallic: f32,
  // ao: f32
};


fn dotMax0 (n: vec3f, toEye: vec3f) -> f32 {
  return max(0.0, dot(n, toEye));
}

fn doShading(material: Material) -> vec3f {
  let ambient = _uniforms.lightAmbient.rgb * _uniforms.lightAmbient.a;
  var radianceSum = vec3(0.0);

  radianceSum += disneyPBR(material, _uniforms.light0);
  radianceSum += disneyPBR(material, _uniforms.light1);
  radianceSum += disneyPBR(material, _uniforms.light2);

  return ambient + radianceSum;
}

/////////////////////////////
/////////////////////////////
/// Config

fn createDefaultMaterial(
  material: ptr<function, Material>,
  positionWS: vec4f,
  normalWS: vec3f
){
  let cameraPos = _uniforms.cameraPosition.xyz;
  
  (*material).positionWS = positionWS.xyz;
  (*material).normal = normalWS;
  (*material).toEye = normalize(cameraPos - positionWS.xyz);
  // brdf params:
  (*material).albedo = vec3f(${DEFAULT_COLOR[0]}, ${DEFAULT_COLOR[1]}, ${DEFAULT_COLOR[2]});
  (*material).roughness = 0.8;
  (*material).isMetallic = 0.0; // oops!
  // material.ao = 1.0;
}

`;
