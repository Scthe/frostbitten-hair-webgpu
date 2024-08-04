import { mat4 } from 'wgpu-matrix';
import { BYTES_MAT4, BYTES_VEC4 } from '../../constants.ts';
import { PassCtx } from '../passCtx.ts';
import { TypedArrayView } from '../../utils/typedArrayView.ts';
import { WEBGPU_MINIMAL_BUFFER_SIZE } from '../../utils/webgpu.ts';
import { SDFCollider } from '../../scene/sdfCollider/sdfCollider.ts';
import { GridData } from './grids/gridData.ts';

const TMP_MAT4 = mat4.create(); // prealloc

export class SimulationUniformsBuffer {
  public static SHADER_SNIPPET = (bindingIdx: number) => /* wgsl */ `

    ${SDFCollider.SDF_DATA_SNIPPET}
    ${GridData.GRID_DATA_SNIPPET}

    struct SimulationUniforms {
      modelMatrix: mat4x4<f32>,
      modelMatrixInv: mat4x4<f32>,
      collisionSphere: vec4f, // in OBJECT space!!!
      wind: vec4f, // in OBJECT space!!!
      sdf: SDFCollider,
      gridData: GridData,
      // START: misc: vec4f
      deltaTime: f32,
      gravity: f32,
      constraintIterations: u32,
      frameIdx: u32,
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
    BYTES_VEC4; // misc

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
    // wind
    // TODO transform by modelMatrixInv into object space!
    this.dataView.writeF32(0.0);
    this.dataView.writeF32(0.0);
    this.dataView.writeF32(0.0);
    this.dataView.writeF32(0.0);
    // sdf + grids
    ctx.scene.sdfCollider.writeToDataView(this.dataView);
    ctx.scene.physicsGrid.writeToDataView(this.dataView);
    // misc
    this.dataView.writeF32(0.0); // deltaTime: f32
    this.dataView.writeF32(0.0); // gravity: f32,
    this.dataView.writeU32(0.0); // constraintIterations: u32,
    this.dataView.writeU32(ctx.frameIdx); // frameIdx: u32,

    // final write
    this.dataView.assertWrittenBytes(SimulationUniformsBuffer.BUFFER_SIZE);
    this.dataView.upload(device, this.gpuBuffer, 0);
  }
}
