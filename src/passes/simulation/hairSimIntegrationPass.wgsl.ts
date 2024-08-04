import { BUFFER_HAIR_DATA } from '../../scene/hair/hairDataBuffer.ts';
import {
  BUFFER_HAIR_POINTS_POSITIONS_R,
  BUFFER_HAIR_POINTS_POSITIONS_RW,
} from '../../scene/hair/hairPointsPositionsBuffer.ts';
import { BUFFER_HAIR_SEGMENT_LENGTHS } from '../../scene/hair/hairSegmentLengthsBuffer.ts';
import { SDFCollider } from '../../scene/sdfCollider/sdfCollider.ts';
import { GENERIC_UTILS } from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { HAIR_SIM_IMPL_COLLISIONS } from './shaderImpl/collisions.wgsl.ts';
import { HAIR_SIM_IMPL_CONSTRANTS } from './shaderImpl/constraints.wgsl.ts';
import { HAIR_SIM_IMPL_INTEGRATION } from './shaderImpl/integration.wgsl.ts';
import { SimulationUniformsBuffer } from './simulationUniformsBuffer.ts';

export const SHADER_PARAMS = {
  workgroupSizeX: 1, // TODO [CRITICAL] set better values
  bindings: {
    simulationUniforms: 0,
    hairData: 1,
    positionsPrev: 2,
    positionsNow: 3,
    segmentLengths: 4,
    sdfTexture: 5,
    sdfSampler: 6,
  },
};

///////////////////////////
/// SHADER CODE
///////////////////////////
const c = SHADER_PARAMS;
const b = SHADER_PARAMS.bindings;

export const SHADER_CODE = () => /* wgsl */ `

${GENERIC_UTILS}
${HAIR_SIM_IMPL_CONSTRANTS}
${HAIR_SIM_IMPL_INTEGRATION}
${HAIR_SIM_IMPL_COLLISIONS}

${SimulationUniformsBuffer.SHADER_SNIPPET(b.simulationUniforms)}
${SDFCollider.TEXTURE_SDF(b.sdfTexture, b.sdfSampler)}
${BUFFER_HAIR_DATA(b.hairData)}
${BUFFER_HAIR_POINTS_POSITIONS_RW(b.positionsPrev, {
  bufferName: '_hairPointPositionsPrev',
  getterName: '_getHairPointPositionPrev',
  setterName: '_setHairPointPositionPrev',
})}
${BUFFER_HAIR_POINTS_POSITIONS_R(b.positionsNow, {
  bufferName: '_hairPointPositionsNow',
  getterName: '_getHairPointPositionNow',
})}
${BUFFER_HAIR_SEGMENT_LENGTHS(b.segmentLengths)}


// TODO change size, paralelize etc.
/** Temporary position storage for duration of the shader */
var<workgroup> _positionsWkGrp: array<vec4f, 32u>;
const wkGrpOffset = 0u;


// Everything is in object space (unless noted otherwise).
// The comments assume 32 points per strand to make it easier
@compute
@workgroup_size(${c.workgroupSizeX}, 1, 1)
fn main(
  @builtin(global_invocation_id) global_id: vec3<u32>,
) {
  let strandsCount: u32 = _hairData.strandsCount;
  let pointsPerStrand: u32 = _hairData.pointsPerStrand; // 32
  let segmentCount: u32 = pointsPerStrand - 1u; // 31

  let dt = 1. / 120.; // TODO uniform
  let constraintIterations = 4u; // TODO uniform
  let stiffness = 1.0; // 0.01; // TODO uniform
  let collisionSphere = vec4f(0.0, 1.454, 0.15, 0.06); // TODO uniform
  let gravity = 1.0; // 9.81; // TODO uniform
  let windStrength = 1.; // TODO uniform
  let frameIdx = _uniforms.frameIdx;
  let sdfBoundsMin = _uniforms.sdf.boundsMin.xyz;
  let sdfBoundsMax = _uniforms.sdf.boundsMax.xyz;
  let sdfOffset = getSDF_Offset();

  let strandIdx = global_id.x;
  // if (strandIdx >= strandsCount) { return; } // "uniform control flow" error
  let isInvalidDispatch = strandIdx >= strandsCount; // some memory accesses will return garbage. It's OK as long as we don't try to override real data?

  let gravityForce = vec3f(0., -gravity, 0.);


  // verlet integration. Also adds forces from grids.
  // Skips root point cause it never moves.
  _positionsWkGrp[wkGrpOffset + 0] = _getHairPointPositionNow(pointsPerStrand, strandIdx, 0u); // root
  for (var i = 1u; i < pointsPerStrand; i += 1u) {
      let posPrev = _getHairPointPositionPrev(pointsPerStrand, strandIdx, i);
      let posNow = _getHairPointPositionNow(pointsPerStrand, strandIdx, i);
      
      // TODO: Add forces from grids. If they are velocity, just scale by dt (and density to average the value) or smth
      let wind = normalize(vec3f(-1., -1., 0.)) * fract(f32(frameIdx) * 0.73) * windStrength;
      let force = gravityForce + wind;
      
      _positionsWkGrp[wkGrpOffset + i] = verletIntegration(dt, posPrev, posNow, force);
      // _positionsWkGrp[wkGrpOffset + i] = posNow; // dbg: skip integration
  }

  workgroupBarrier();


  // solve constraints through iterations
  for (var i = 0u; i < constraintIterations; i += 1u) {
    let stiffnessIter = stiffness / f32(constraintIterations); // TODO something better?

    // strech/length constraint
    var posSegmentStart = _positionsWkGrp[wkGrpOffset + 0u];
    for (var j = 0u; j < segmentCount; j += 1u) { // from 0 to 30 (inclusive)
      var posSegmentEnd = _positionsWkGrp[wkGrpOffset + j + 1u];
      // let expectedLength0 = length(posSegmentEnd.xyz - posSegmentStart.xyz);
      let expectedLength1: f32 = _getHairSegmentLength(pointsPerStrand, strandIdx, j);
      applyConstraint_Length(
        stiffnessIter, expectedLength1,
        &posSegmentStart, &posSegmentEnd
      );
      _positionsWkGrp[wkGrpOffset + j + 0u] = posSegmentStart;
      _positionsWkGrp[wkGrpOffset + j + 1u] = posSegmentEnd;
      // move to next segment
      posSegmentStart = posSegmentEnd;
    }

    // TODO add local shape constraint
    // TODO add global length (FTL) constraint
    
    // collisions (skip root)
    for (var j = 1u; j < pointsPerStrand; j += 1u) { // from 0 to 30 (inclusive)
      var pos = _positionsWkGrp[wkGrpOffset + j];
      // sphere
      applyCollisionsSphere(
        stiffnessIter,
        collisionSphere,
        &pos
      );

      // SDF
      applyCollisionsSdf(
        stiffnessIter,
        sdfBoundsMin,
        sdfBoundsMax,
        sdfOffset,
        &pos
      );

      _positionsWkGrp[wkGrpOffset + j] = pos;
    }
  }

  workgroupBarrier();


  // write back
  for (var i = 0u; i < pointsPerStrand && !isInvalidDispatch; i += 1u) {
    // tick-tock update. Leave positionNow, as it will be come positionPrev next frame
    let posNext: vec4f = _positionsWkGrp[wkGrpOffset + i];
    _setHairPointPositionPrev(pointsPerStrand, strandIdx, i, posNext);
  }
}

`;
