import { mat4 } from 'wgpu-matrix';
import { BYTES_MAT4, BYTES_VEC4, CONFIG } from '../constants.ts';
import { PassCtx } from './passCtx.ts';
import { TypedArrayView } from '../utils/typedArrayView.ts';

export class RenderUniformsBuffer {
  public static SHADER_SNIPPET = (group: number) => /* wgsl */ `
    const b11 = 3u; // binary 0b11
    const b111 = 7u; // binary 0b111
    const b1111 = 15u; // binary 0b1111
    const b11111 = 31u; // binary 0b11111
    const b111111 = 63u; // binary 0b111111

    struct Uniforms {
      vpMatrix: mat4x4<f32>,
      vpMatrixInv: mat4x4<f32>,
      viewMatrix: mat4x4<f32>,
      projMatrix: mat4x4<f32>,
      viewport: vec4f,
      cameraPosition: vec4f,
      colorMgmt: vec4f,
    };
    @binding(0) @group(${group})
    var<uniform> _uniforms: Uniforms;
  `;

  public static BUFFER_SIZE =
    BYTES_MAT4 + // vpMatrix
    BYTES_MAT4 + // vpMatrixInv
    BYTES_MAT4 + // viewMatrix
    BYTES_MAT4 + // projMatrix
    BYTES_VEC4 + // viewport
    BYTES_VEC4 + // cameraPosition
    BYTES_VEC4; // color mgmt

  private readonly gpuBuffer: GPUBuffer;
  private readonly data = new ArrayBuffer(RenderUniformsBuffer.BUFFER_SIZE);
  private readonly dataView: TypedArrayView;

  constructor(device: GPUDevice) {
    this.gpuBuffer = device.createBuffer({
      label: 'render-uniforms-buffer',
      size: RenderUniformsBuffer.BUFFER_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.dataView = new TypedArrayView(this.data);
  }

  createBindingDesc = (bindingIdx: number): GPUBindGroupEntry => ({
    binding: bindingIdx,
    resource: { buffer: this.gpuBuffer },
  });

  update2(ctx: PassCtx) {
    const {
      device,
      vpMatrix,
      viewMatrix,
      projMatrix,
      viewport,
      cameraPositionWorldSpace,
    } = ctx;
    const c = CONFIG;
    const col = c.colors;
    const camPos = cameraPositionWorldSpace;

    this.dataView.resetCursor();
    this.dataView.writeMat4(vpMatrix);
    this.dataView.writeMat4(mat4.invert(vpMatrix));
    this.dataView.writeMat4(viewMatrix);
    this.dataView.writeMat4(projMatrix);
    // viewport
    this.dataView.writeF32(viewport.width);
    this.dataView.writeF32(viewport.height);
    this.dataView.writeF32(0.0);
    this.dataView.writeF32(0.0);
    // camera position
    this.dataView.writeF32(camPos[0]);
    this.dataView.writeF32(camPos[1]);
    this.dataView.writeF32(camPos[2]);
    this.dataView.writeF32(0.0);
    // color mgmt
    this.dataView.writeF32(col.gamma);
    this.dataView.writeF32(col.exposure);
    this.dataView.writeF32(col.ditherStrength);
    this.dataView.writeF32(0.0);

    // final write
    this.dataView.assertWrittenBytes(RenderUniformsBuffer.BUFFER_SIZE);
    this.dataView.upload(device, this.gpuBuffer, 0);
  }
}
