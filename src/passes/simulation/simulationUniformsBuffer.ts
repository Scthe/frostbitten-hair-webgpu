import { mat4, vec4 } from 'wgpu-matrix';
import { BYTES_MAT4, BYTES_VEC4, CONFIG } from '../../constants.ts';
import { PassCtx } from '../passCtx.ts';
import { TypedArrayView } from '../../utils/typedArrayView.ts';
import { WEBGPU_MINIMAL_BUFFER_SIZE } from '../../utils/webgpu.ts';
import { SDFCollider } from '../../scene/sdfCollider/sdfCollider.ts';
import { GridData } from './grids/gridData.ts';
import { sphericalToCartesian } from '../../utils/index.ts';

const TMP_MODEL_MAT4_INV = mat4.create(); // prealloc
const TMP_VEC4 = vec4.create(); // prealloc

export class SimulationUniformsBuffer {
  public static SHADER_SNIPPET = (bindingIdx: number) => /* wgsl */ `

    ${SDFCollider.SDF_DATA_SNIPPET}
    ${GridData.GRID_DATA_SNIPPET}

    struct SimulationUniforms {
      modelMatrix: mat4x4<f32>,
      modelMatrixInv: mat4x4<f32>,
      collisionSphere: vec4f, // in OBJECT space!!!
      wind: vec4f, // [direction.xyz, strength]
      sdf: SDFCollider,
      gridData: GridData,
      // START: misc: vec4f
      deltaTime: f32,
      gravity: f32,
      constraintIterations: u32,
      frameIdx: u32,
      // START: misc2: vec4f
      windStrengthLull: f32,
      windColisionTraceOffset: f32,
      stiffnessLengthConstr: f32,
      stiffnessCollisions: f32,
      // START: misc3: vec4f
      stiffnessSDF: f32,
      volumePreservation: f32,
      friction: f32,
      stiffnessGlobalConstr: f32,
      // START: misc4: vec4f
      globalConstrExtent: f32,
      globalConstrFade: f32,
      stiffnessLocalConstr: f32,
      windPhaseOffset: f32,
      // START: misc5: vec4f
      windStrengthFrequency: f32,
      windStrengthJitter: f32,
      padding0: f32,
      padding1: f32,
    };
    @group(0) @binding(${bindingIdx})
    var<uniform> _uniforms: SimulationUniforms;
  `;

  private static BUFFER_SIZE =
    BYTES_MAT4 + // modelMatrix
    BYTES_MAT4 + // modelMatrixInv
    BYTES_VEC4 + // collisionSphere
    BYTES_VEC4 + // wind
    SDFCollider.BUFFER_SIZE + // sdf
    GridData.BUFFER_SIZE + // grids
    5 * BYTES_VEC4; // misc

  private readonly gpuBuffer: GPUBuffer;
  private readonly data = new ArrayBuffer(SimulationUniformsBuffer.BUFFER_SIZE);
  private readonly dataView: TypedArrayView;

  constructor(device: GPUDevice) {
    this.gpuBuffer = device.createBuffer({
      label: 'simulation-uniforms-buffer',
      size: Math.max(
        SimulationUniformsBuffer.BUFFER_SIZE,
        WEBGPU_MINIMAL_BUFFER_SIZE
      ),
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.dataView = new TypedArrayView(this.data);
  }

  createBindingDesc = (bindingIdx: number): GPUBindGroupEntry => ({
    binding: bindingIdx,
    resource: { buffer: this.gpuBuffer },
  });

  update(ctx: PassCtx) {
    const { device } = ctx;
    const { modelMatrix } = ctx.scene;
    const c = CONFIG.hairSimulation;

    this.dataView.resetCursor();
    // model matrix
    this.dataView.writeMat4(modelMatrix);
    const modelMatInv = mat4.invert(modelMatrix, TMP_MODEL_MAT4_INV);
    this.dataView.writeMat4(modelMatInv);

    // collisionSphere
    const colSph = CONFIG.hairSimulation.collisionSphere;
    const colSphPosWS = vec4.set(colSph[0], colSph[1], colSph[2], 1.0, TMP_VEC4); // prettier-ignore
    const colSphPosOS = vec4.transformMat4(colSphPosWS, modelMatInv, TMP_VEC4); // prettier-ignore
    this.dataView.writeF32(colSphPosOS[0]);
    this.dataView.writeF32(colSphPosOS[1]);
    this.dataView.writeF32(colSphPosOS[2]);
    this.dataView.writeF32(colSph[3]); // radius

    // wind direction (.xyz), strength (.w)
    const windDirWS = sphericalToCartesian(
      c.wind.dirPhi,
      c.wind.dirTheta,
      'dgr',
      TMP_VEC4
    );
    const windDirOS = vec4.transformMat4(windDirWS, modelMatInv, TMP_VEC4); // prettier-ignore
    this.dataView.writeF32(windDirOS[0]);
    this.dataView.writeF32(windDirOS[1]);
    this.dataView.writeF32(windDirOS[2]);
    this.dataView.writeF32(c.wind.strength);

    // sdf + grids
    ctx.scene.sdfCollider.writeToDataView(this.dataView);
    ctx.scene.physicsGrid.writeToDataView(this.dataView);

    // misc
    this.dataView.writeF32(this.getDeltaTime()); // deltaTime: f32
    this.dataView.writeF32(c.gravity); // gravity: f32,
    this.dataView.writeU32(c.constraints.constraintIterations); // constraintIterations: u32,
    this.dataView.writeU32(ctx.frameIdx); // frameIdx: u32,
    // misc 2
    this.dataView.writeF32(c.wind.strengthLull); // windStrengthLull: f32,
    this.dataView.writeF32(c.wind.colisionTraceOffset); // windColisionTraceOffset: f32,
    this.dataView.writeF32(c.constraints.stiffnessLengthConstr); // stiffnessLengthConstr: f32,
    this.dataView.writeF32(c.constraints.stiffnessCollisions); // stiffnessCollisions: f32,
    // misc 3
    this.dataView.writeF32(c.constraints.stiffnessSDF); // stiffnessSDF: f32,
    this.dataView.writeF32(c.volumePreservation); // volumePreservation: f32
    this.dataView.writeF32(c.friction); // friction: f32
    this.dataView.writeF32(c.constraints.stiffnessGlobalConstr); // stiffnessGlobalConstr: f32,
    // misc 4
    this.dataView.writeF32(c.constraints.globalExtent); // globalConstrExtent: f32,
    this.dataView.writeF32(c.constraints.globalFade); // globalConstrFade: f32,
    this.dataView.writeF32(c.constraints.stiffnessLocalConstr); // stiffnessLocalConstr: f32,
    this.dataView.writeF32(c.wind.phaseOffset); // windPhaseOffset: f32,
    // misc 5
    this.dataView.writeF32(c.wind.strengthFrequency); // windStrengthFrequency: f32,
    this.dataView.writeF32(c.wind.strengthJitter); // windStrengthJitter: f32,
    this.dataView.writeF32(0.0); // padding0: f32,
    this.dataView.writeF32(0.0); // padding1: f32,

    // final write
    this.dataView.assertWrittenBytes(SimulationUniformsBuffer.BUFFER_SIZE);
    this.dataView.upload(device, this.gpuBuffer, 0);
  }

  /**
   * Hair physics is not essential. It never drives a gameplay behaviour.
   * It's fine to hardcode delta time. It guarantees stability, which is more important.
   * We are also VSYNCed in the browser.
   */
  private getDeltaTime() {
    return CONFIG.hairSimulation.deltaTime;
  }
}
