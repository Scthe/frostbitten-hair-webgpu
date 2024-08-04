import { CONFIG } from '../../constants.ts';
import { BUFFER_HAIR_DATA } from '../../scene/hair/hairDataBuffer.ts';
import { BUFFER_HAIR_POINTS_POSITIONS_R } from '../../scene/hair/hairPointsPositionsBuffer.ts';
import { GENERIC_UTILS } from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { BUFFER_GRID_DENSITY_VELOCITY } from './grids/densityVelocityGrid.wgsl.ts';
import { GRID_UTILS } from './grids/grids.wgsl.ts';
import { SimulationUniformsBuffer } from './simulationUniformsBuffer.ts';

export const SHADER_PARAMS = {
  workgroupSizeX: 32, // TODO [LOW] set better values
  bindings: {
    simulationUniforms: 0,
    hairData: 1,
    positionsPrev: 2,
    positionsNow: 3,
    gridBuffer: 4,
  },
};

///////////////////////////
/// SHADER CODE
///////////////////////////
const c = SHADER_PARAMS;
const b = SHADER_PARAMS.bindings;

export const SHADER_CODE = () => /* wgsl */ `

${GENERIC_UTILS}
${GRID_UTILS(CONFIG.hairSimulation.densityVelocityGrid.dims)}

${SimulationUniformsBuffer.SHADER_SNIPPET(b.simulationUniforms)}
${BUFFER_GRID_DENSITY_VELOCITY(b.gridBuffer, 'read_write')}
${BUFFER_HAIR_DATA(b.hairData)}
${BUFFER_HAIR_POINTS_POSITIONS_R(b.positionsPrev, {
  bufferName: '_hairPointPositionsPrev',
  getterName: '_getHairPointPositionPrev',
})}
${BUFFER_HAIR_POINTS_POSITIONS_R(b.positionsNow, {
  bufferName: '_hairPointPositionsNow',
  getterName: '_getHairPointPositionNow',
})}


// Everything is in object space (unless noted otherwise).
// The comments assume 32 points per strand to make it easier
@compute
@workgroup_size(${c.workgroupSizeX}, 1, 1)
fn main(
  @builtin(global_invocation_id) global_id: vec3<u32>,
) {
  let strandsCount: u32 = _hairData.strandsCount;
  let pointsPerStrand: u32 = _hairData.pointsPerStrand; // 32
  // let segmentCount: u32 = pointsPerStrand - 1u; // 31
  let boundsMin = _uniforms.gridData.boundsMin.xyz;
  let boundsMax = _uniforms.gridData.boundsMax.xyz;

  let strandIdx = global_id.x;
  if (strandIdx >= strandsCount) { return; }
  // let isInvalidDispatch = strandIdx >= strandsCount; // some memory accesses will return garbage. It's OK as long as we don't try to override real data?

  for (var i = 0u; i < pointsPerStrand; i += 1u) {
    let posPrev = _getHairPointPositionPrev(pointsPerStrand, strandIdx, i).xyz;
    let posNow  = _getHairPointPositionNow (pointsPerStrand, strandIdx, i).xyz;
    let velocity = posNow - posPrev; // we can div. by velocity during integration

    // density is just a 'I am here' counter. Weighted by triliner interpolation..
    _addGridDensityVelocity(
      boundsMin, boundsMax,
      posNow,
      velocity
    );
  }
}

`;
