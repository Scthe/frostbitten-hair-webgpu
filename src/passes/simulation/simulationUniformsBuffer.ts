import { mat4, vec3 } from 'wgpu-matrix';
import { BYTES_MAT4, BYTES_VEC4, CONFIG } from '../../constants.ts';
import { PassCtx } from '../passCtx.ts';
import { TypedArrayView } from '../../utils/typedArrayView.ts';
import { WEBGPU_MINIMAL_BUFFER_SIZE } from '../../utils/webgpu.ts';
import { SDFCollider } from '../../scene/sdfCollider/sdfCollider.ts';
import { GridData } from './grids/gridData.ts';
import { sphericalToCartesian } from '../../utils/index.ts';

const TMP_MAT4 = mat4.create(); // prealloc
const TMP_VEC3 = vec3.create(); // prealloc

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
      windLullStrengthMul: f32,
      windColisionTraceOffset: f32,
      stiffnessLengthConstr: f32,
      stiffnessCollisions: f32,
      // START: misc3: vec4f
      stiffnessSDF: f32,
      volumePreservation: f32,
      friction: f32,
      padding0: f32,
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
    3 * BYTES_VEC4; // misc

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
    this.dataView.writeMat4(mat4.invert(modelMatrix, TMP_MAT4));
    // collisionSphere
    // TODO transform by modelMatrixInv into object space!
    this.dataView.writeF32(0.0);
    this.dataView.writeF32(0.0);
    this.dataView.writeF32(0.0);
    this.dataView.writeF32(0.0);
    // wind direction (.xyz), strength (.w)
    const windDir = sphericalToCartesian(
      c.wind.dirPhi,
      c.wind.dirTheta,
      'dgr',
      TMP_VEC3
    );
    this.dataView.writeF32(windDir[0]);
    this.dataView.writeF32(windDir[1]);
    this.dataView.writeF32(windDir[2]);
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
    this.dataView.writeF32(c.wind.lullStrengthMul); // windLullStrengthMul: f32,
    this.dataView.writeF32(c.wind.colisionTraceOffset); // windColisionTraceOffset: f32,
    this.dataView.writeF32(c.constraints.stiffnessLengthConstr); // stiffnessLengthConstr: f32,
    this.dataView.writeF32(c.constraints.stiffnessCollisions); // stiffnessCollisions: f32,
    // misc 3
    this.dataView.writeF32(c.constraints.stiffnessSDF); // stiffnessSDF: f32,
    this.dataView.writeF32(c.volumePreservation); // volumePreservation: f32
    this.dataView.writeF32(c.friction); // friction: f32
    this.dataView.writeF32(0.0); // padding2: f32,

    // final write
    this.dataView.assertWrittenBytes(SimulationUniformsBuffer.BUFFER_SIZE);
    this.dataView.upload(device, this.gpuBuffer, 0);
  }

  /**
   * Hair physics is not essential. It never drives a gameplay behaviour.
   * It's fine to hardcode delta time. It guarantees stability, which is more important.
   * We are also VSYNCed in the browser.
   * TODO Ofc. we should still scale it a bit to prevent physics speed up on 144Hz displays
   */
  private getDeltaTime() {
    return 1.0 / 120.0;
  }
}
