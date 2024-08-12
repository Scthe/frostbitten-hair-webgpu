import { SDFCollider } from '../../scene/sdfCollider/sdfCollider.ts';
import { GENERIC_UTILS } from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { BUFFER_GRID_DENSITY_GRADIENT_AND_WIND } from './grids/densityGradAndWindGrid.wgsl.ts';
import { BUFFER_GRID_DENSITY_VELOCITY } from './grids/densityVelocityGrid.wgsl.ts';
import { GRID_UTILS } from './grids/grids.wgsl.ts';
import { SimulationUniformsBuffer } from './simulationUniformsBuffer.ts';

export const SHADER_PARAMS = {
  workgroupSizeX: 32, // TODO [LOW] set better values
  bindings: {
    simulationUniforms: 0,
    densityVelocityBuffer: 1,
    densityGradWindBuffer: 2,
    sdfTexture: 3,
    sdfSampler: 4,
  },
};

///////////////////////////
/// SHADER CODE
///////////////////////////
const c = SHADER_PARAMS;
const b = SHADER_PARAMS.bindings;

export const SHADER_CODE = () => /* wgsl */ `

${GENERIC_UTILS}
${GRID_UTILS}

${SimulationUniformsBuffer.SHADER_SNIPPET(b.simulationUniforms)}
${BUFFER_GRID_DENSITY_VELOCITY(b.densityVelocityBuffer, 'read')}
${BUFFER_GRID_DENSITY_GRADIENT_AND_WIND(b.densityGradWindBuffer, 'read_write')}
${SDFCollider.TEXTURE_SDF(b.sdfTexture, b.sdfSampler)}


// Everything is in object space (unless noted otherwise).
// The comments assume 32 points per strand to make it easier
@compute
@workgroup_size(${c.workgroupSizeX}, 1, 1)
fn main(
  @builtin(global_invocation_id) global_id: vec3<u32>,
) {
  let boundsMin = _uniforms.gridData.boundsMin.xyz;
  let boundsMax = _uniforms.gridData.boundsMax.xyz;
  let totalGridPoints = GRID_DIMS * GRID_DIMS * GRID_DIMS;
  
  // TBH. we could also skip if density near the point is 0
  if (global_id.x >= totalGridPoints) { return; }

  // get grid point e.g. (0,1,4)
  let gridPoint = deconstructId(global_id.x);
  // if (gridPoint.z < (GRID_DIMS / 2u)) { // dbg
    // _gridDensityGradAndWindVelocity[global_id.x].windStrength = gridEncodeValue(1.);
  // }
  
  // get world position
  let position = getGridPointPositionWS(boundsMin, boundsMax, gridPoint);
  // if (position.y < 1.5352792739868164) { // dbg
    // _gridDensityGradAndWindVelocity[global_id.x].windStrength = gridEncodeValue(1.);
  // }

  // wind
  let windStrength = getWindStrength(position);
  
  // density gradient
  let densityGrad = getDensityGradient(boundsMin, boundsMax, gridPoint);

  // write
  _setGridDensityGradAndWind(
    gridPoint,
    densityGrad,
    windStrength
  );
}


fn deconstructId(id: u32) -> vec3u {
  let z = id / (GRID_DIMS * GRID_DIMS);
  let idXY = id - (z * GRID_DIMS * GRID_DIMS);
  let y = idXY / GRID_DIMS;
  let x = idXY % GRID_DIMS;
  return vec3u(x, y, z);
}

const WIND_LULL = 0.0;
const WIND_HALF = 0.5;
const WIND_FULL = 1.0;

fn getWindStrength(p: vec3f) -> f32 {
  let sdfBoundsMin = _uniforms.sdf.boundsMin.xyz;
  let sdfBoundsMax = _uniforms.sdf.boundsMax.xyz;
  let windDirection = _uniforms.wind.xyz;
  let windColisionTraceOffset = _uniforms.windColisionTraceOffset;

  // ignore sdfOffset, as it would create big lull zone around the object
  let sdfDistance = sampleSDFCollider(sdfBoundsMin, sdfBoundsMax, p);
  if (sdfDistance < 0.) { return WIND_LULL; } // point inside mesh, no wind

  // check if there is a collider between the point and the wind origin.
  // TBH. You could make a fancy fluid sim here.
  let towardWindDir = -normalize(windDirection);
  // trace into the wind hoping to hit a mesh. Enlarge step by correction
  let rayTraceTowardWindPos = p + towardWindDir * sdfDistance * windColisionTraceOffset;
  let sdfDistance2 = sampleSDFCollider(sdfBoundsMin, sdfBoundsMax, rayTraceTowardWindPos);
  if (sdfDistance2 < 0.) { return WIND_HALF; }

  return WIND_FULL;
}

// https://youtu.be/XmzBREkK8kY?si=fzOcQi_47D9roJKY&t=644
fn getDensityGradient(
  gridBoundsMin: vec3f,
  gridBoundsMax: vec3f,
  gridPoint: vec3u
) -> vec3f {
  let density0 = _getGridDensityAtPoint(gridPoint);
  let idx0 = _getGridIdx(gridPoint);
  var result = vec3f(0.);

  result += getDensityGradientFromDirection(density0, idx0, gridPoint, vec3i( 1,  0,  0));
  result += getDensityGradientFromDirection(density0, idx0, gridPoint, vec3i(-1,  0,  0));
  result += getDensityGradientFromDirection(density0, idx0, gridPoint, vec3i( 0,  1,  0));
  result += getDensityGradientFromDirection(density0, idx0, gridPoint, vec3i( 0, -1,  0));
  result += getDensityGradientFromDirection(density0, idx0, gridPoint, vec3i( 0,  0,  1));
  result += getDensityGradientFromDirection(density0, idx0, gridPoint, vec3i( 0,  0, -1));

  return result;
}

fn getDensityGradientFromDirection(
  density0: f32,
  idx0: u32,
  p: vec3u,
  offset: vec3i,
) -> vec3f {
  let pOther_i = vec3i(p) + offset; // 'i' means signed. Coords can be <0
  if (pOther_i.x < 0 || pOther_i.y < 0 || pOther_i.z < 0) {
    return vec3f(0.);
    // return vec3f(1., 0., 0.); // dbg
  }

  let pOther = vec3u(pOther_i);
  var idxOther = _getGridIdx(pOther);
  // check near bounds. _getGridIdx() has a clamp()
  if (idx0 == idxOther) {
    return vec3f(0.);
    // return vec3f(0., 1., 0.); // dbg
  }

  let densityOther = _getGridDensityAtPoint(pOther);

  // densityDiff NEGATIVE: original point 'p' has LESS particles near than the 'pOther'. 
  //                       Do NOTHING, other cell will calculate it's best resolution.
  // densityDiff POSITIVE: original point 'p' has MORE particles near than the 'pOther'.
  //                       Move particles toward 'pOther'.
  let densityDiff = density0 - densityOther;
  return max(densityDiff, 0.) * vec3f(offset); // I though we should negate here, but it works if we don't?
  // return vec3f(0., 0., 1.); // dbg
}

`;
