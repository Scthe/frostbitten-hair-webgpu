import { BUFFER_HAIR_DATA } from '../../scene/hair/hairDataBuffer.ts';
import {
  BUFFER_HAIR_POINTS_POSITIONS_R,
  BUFFER_HAIR_POINTS_POSITIONS_RW,
} from '../../scene/hair/hairPointsPositionsBuffer.ts';
import { BUFFER_HAIR_SEGMENT_LENGTHS } from '../../scene/hair/hairSegmentLengthsBuffer.ts';
import { SDFCollider } from '../../scene/sdfCollider/sdfCollider.ts';
import { GENERIC_UTILS } from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { BUFFER_GRID_DENSITY_GRADIENT_AND_WIND } from './grids/densityGradAndWindGrid.wgsl.ts';
import { BUFFER_GRID_DENSITY_VELOCITY } from './grids/densityVelocityGrid.wgsl.ts';
import { GRID_UTILS } from './grids/grids.wgsl.ts';
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
    densityVelocityBuffer: 7,
    densityGradWindBuffer: 8,
    positionsInitial: 9,
  },
};

///////////////////////////
/// SHADER CODE
/// TODO precompute A LOT of stuff
///////////////////////////
const c = SHADER_PARAMS;
const b = SHADER_PARAMS.bindings;

export const SHADER_CODE = () => /* wgsl */ `

${GENERIC_UTILS}
${GRID_UTILS}
${HAIR_SIM_IMPL_CONSTRANTS}
${HAIR_SIM_IMPL_INTEGRATION}
${HAIR_SIM_IMPL_COLLISIONS}

${SimulationUniformsBuffer.SHADER_SNIPPET(b.simulationUniforms)}
${SDFCollider.TEXTURE_SDF(b.sdfTexture, b.sdfSampler)}
${BUFFER_GRID_DENSITY_VELOCITY(b.densityVelocityBuffer, 'read')}
${BUFFER_GRID_DENSITY_GRADIENT_AND_WIND(b.densityGradWindBuffer, 'read')}
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
${BUFFER_HAIR_POINTS_POSITIONS_R(b.positionsInitial, {
  bufferName: '_hairPointPositionsInitial',
  getterName: '_getHairPointPositionInitial',
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

  let dt = _uniforms.deltaTime;
  let constraintIterations = _uniforms.constraintIterations;
  let stiffnessLengthConstr = _uniforms.stiffnessLengthConstr;
  let stiffnessGlobalConstr = _uniforms.stiffnessGlobalConstr;
  let stiffnessCollisions = _uniforms.stiffnessCollisions;
  let globalConstrExtent = _uniforms.globalConstrExtent;
  let globalConstrFade = _uniforms.globalConstrFade;
  let stiffnessLocalConstr = _uniforms.stiffnessLocalConstr;
  let stiffnessSDF = _uniforms.stiffnessSDF;
  let collisionSphere = vec4f(0.0, 1.454, 0.15, 0.06); // TODO uniform
  let gravity = _uniforms.gravity;
  let gravityForce = vec3f(0., -gravity, 0.);
  let wind = _uniforms.wind;
  let windLullStrengthMul = _uniforms.windLullStrengthMul;
  let windPhaseOffset = _uniforms.windPhaseOffset;
  let windStrengthFrequency = _uniforms.windStrengthFrequency;
  let windStrengthJitter = _uniforms.windStrengthJitter;
  let volumePreservation = _uniforms.volumePreservation;
  let friction = _uniforms.friction;
  let frameIdx = _uniforms.frameIdx;
  let gridBoundsMin = _uniforms.gridData.boundsMin.xyz;
  let gridBoundsMax = _uniforms.gridData.boundsMax.xyz;
  let sdfBoundsMin = _uniforms.sdf.boundsMin.xyz;
  let sdfBoundsMax = _uniforms.sdf.boundsMax.xyz;
  let sdfOffset = getSDF_Offset();

  let strandIdx = global_id.x;
  // if (strandIdx >= strandsCount) { return; } // "uniform control flow" error
  let isInvalidDispatch = strandIdx >= strandsCount; // some memory accesses will return garbage. It's OK as long as we don't try to override real data?



  // verlet integration. Also adds forces from grids.
  // Skips root point cause it never moves.
  _positionsWkGrp[wkGrpOffset + 0] = _getHairPointPositionNow(pointsPerStrand, strandIdx, 0u); // root
  for (var i = 1u; i < pointsPerStrand && !isInvalidDispatch; i += 1u) {
      let posPrev = _getHairPointPositionPrev(pointsPerStrand, strandIdx, i);
      let posNow = _getHairPointPositionNow(pointsPerStrand, strandIdx, i);
      var force = gravityForce;
      let densityGradAndWind = _getGridDensityGradAndWind(gridBoundsMin, gridBoundsMax, posNow.xyz);
      let densityVelocity = _getGridDensityVelocity(gridBoundsMin, gridBoundsMax, posNow.xyz);

      // wind
      let timer = f32(frameIdx) * 0.73 + windPhaseOffset * f32(strandIdx);
      let windJitter = fract(timer * windStrengthFrequency);
      let jitterDelta = mix(-0.5 * windStrengthJitter, 0.5 * windStrengthJitter, windJitter); // e.g. [-0.5 .. 0.5] when windStrengthJitter is 1.0
      // let jitterStr = mix(1.0 - windStrengthJitter, 1.0, windJitter); // TODO make jitter -0.5..+0.5, instead of 0..1
      let jitterStr = 1.0 + jitterDelta; // e.g. [0.5 .. 1.5] when windStrengthJitter is 1.0
      let windCellStr = mix(windLullStrengthMul, 1.0, densityGradAndWind.windStrength);
      force += wind.xyz * abs(wind.w * jitterStr * windCellStr);
      
      // density gradient
      // This is just an averaged direction to neighbouring cell - based on density difference.
      // No need to normalize by density, as it's a difference. But it's a value from grid,
      // so we have to use FLIP.
      force += densityGradAndWind.densityGrad * volumePreservation;
      
      // Velocity. Divide by density to get *average* value.
      // https://youtu.be/ool2E8SQPGU?si=yKgmYF6Wjbu6HXsF&t=815
      let gridDisp = densityVelocity.velocity / densityVelocity.density;

      _positionsWkGrp[wkGrpOffset + i] = verletIntegration(
        dt,
        posPrev, posNow,
        gridDisp, friction,
        force
      );
      // _positionsWkGrp[wkGrpOffset + i] = posNow; // dbg: skip integration
  }

  workgroupBarrier();


  // solve constraints through iterations
  for (var i = 0u; i < constraintIterations && !isInvalidDispatch; i += 1u) {
    // NOTE: we could better manipulate stiffness between iters.
    // E.g.  First few iters affect more and last ones just nudge
    //       toward slightly better solutions.
    // E.g2. First few iters affect less to put strands in stable,
    //       solvable positions before bigger changes in later iters.

    // strech/length constraint
    let stiffnessLen_i = stiffnessLengthConstr / f32(constraintIterations);
    var posSegmentStart = _positionsWkGrp[wkGrpOffset + 0u];
    for (var j = 0u; j < segmentCount; j += 1u) { // from 0 to 30 (inclusive)
      var posSegmentEnd = _positionsWkGrp[wkGrpOffset + j + 1u];
      // let expectedLength0 = length(posSegmentEnd.xyz - posSegmentStart.xyz);
      let expectedLength1: f32 = _getHairSegmentLength(pointsPerStrand, strandIdx, j);
      applyConstraint_Length(
        stiffnessLen_i, expectedLength1,
        &posSegmentStart, &posSegmentEnd
      );
      _positionsWkGrp[wkGrpOffset + j + 0u] = posSegmentStart;
      _positionsWkGrp[wkGrpOffset + j + 1u] = posSegmentEnd;
      // move to next segment
      posSegmentStart = posSegmentEnd;
    }

    // global shape constraint
    let stiffnessGlobalShape_i = stiffnessGlobalConstr / f32(constraintIterations);
    for (var j = 1u; j < pointsPerStrand; j += 1u) { // from 0 to 30 (inclusive)
      let attenuation = globalConstraintAttenuation(
        globalConstrExtent, globalConstrFade,
        pointsPerStrand, j
      );
      let posInitial = _getHairPointPositionInitial(pointsPerStrand, strandIdx, j);
      applyConstraint_GlobalShape(
        stiffnessGlobalShape_i * attenuation,
        posInitial.xyz,
        j
      );
    }

    // local shape constraint
    let stiffnessLocalShape_i = stiffnessLocalConstr / f32(constraintIterations);
    var jj = 0u;
    for (; jj < pointsPerStrand - 3; jj += 1u) { // from 0 to 30 (inclusive)
      applyConstraint_LocalShape(
        pointsPerStrand, strandIdx,
        stiffnessLocalShape_i,
        jj
      );
    }
    for (; jj < pointsPerStrand; jj += 1u) { // from 0 to 30 (inclusive)
      applyConstraint_matchTangent(
        pointsPerStrand, strandIdx,
        stiffnessLocalShape_i,
        jj
      );
    }

    // TODO add global length (FTL) constraint
    
    // collisions (skip root)
    let stiffnessColl_i = stiffnessCollisions / f32(constraintIterations);
    let stiffnessSDF_i = stiffnessSDF / f32(constraintIterations);
    for (var j = 1u; j < pointsPerStrand; j += 1u) { // from 0 to 30 (inclusive)
      var pos = _positionsWkGrp[wkGrpOffset + j];
      // sphere
      applyCollisionsSphere(
        stiffnessColl_i,
        collisionSphere,
        &pos
      );

      // SDF
      if (j > 2u) { // TODO skip for more?
        applyCollisionsSdf(
          stiffnessSDF_i,
          sdfBoundsMin,
          sdfBoundsMax,
          sdfOffset,
          &pos
        );
      }

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
