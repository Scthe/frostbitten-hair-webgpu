import { mat4, vec3 } from 'wgpu-matrix';
import { BYTES_MAT4, BYTES_VEC4, CONFIG, LightCfg } from '../constants.ts';
import { PassCtx } from './passCtx.ts';
import { TypedArrayView } from '../utils/typedArrayView.ts';
import { sphericalToCartesian } from '../utils/index.ts';

export class RenderUniformsBuffer {
  public static SHADER_SNIPPET = (group: number) => /* wgsl */ `
    const b11 = 3u; // binary 0b11
    const b111 = 7u; // binary 0b111
    const b1111 = 15u; // binary 0b1111
    const b11111 = 31u; // binary 0b11111
    const b111111 = 63u; // binary 0b111111

    struct Light {
      position: vec4f,
      colorAndEnergy: vec4f,
    }

    struct Uniforms {
      vpMatrix: mat4x4<f32>,
      vpMatrixInv: mat4x4<f32>,
      viewMatrix: mat4x4<f32>,
      projMatrix: mat4x4<f32>,
      viewport: vec4f,
      cameraPosition: vec4f,
      colorMgmt: vec4f,
      lightAmbient: vec4f,
      light0: Light,
      light1: Light,
      light2: Light,
    };
    @binding(0) @group(${group})
    var<uniform> _uniforms: Uniforms;
  `;

  private static LIGHT_SIZE = 2 * BYTES_VEC4;

  private static BUFFER_SIZE =
    BYTES_MAT4 + // vpMatrix
    BYTES_MAT4 + // vpMatrixInv
    BYTES_MAT4 + // viewMatrix
    BYTES_MAT4 + // projMatrix
    BYTES_VEC4 + // viewport
    BYTES_VEC4 + // cameraPosition
    BYTES_VEC4 + // color mgmt
    BYTES_VEC4 + // lightAmbient
    3 * RenderUniformsBuffer.LIGHT_SIZE; // lights

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

  update(ctx: PassCtx) {
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
    // lights
    this.dataView.writeF32(c.lightAmbient.color[0]);
    this.dataView.writeF32(c.lightAmbient.color[1]);
    this.dataView.writeF32(c.lightAmbient.color[2]);
    this.dataView.writeF32(c.lightAmbient.energy);
    this.writeLight(c.lights[0]);
    this.writeLight(c.lights[1]);
    this.writeLight(c.lights[2]);

    // final write
    this.dataView.assertWrittenBytes(RenderUniformsBuffer.BUFFER_SIZE);
    this.dataView.upload(device, this.gpuBuffer, 0);
  }

  private writeLight(l: LightCfg) {
    const pos = sphericalToCartesian(l.posPhi, l.posTheta, TMP_VEC3, true);
    const dist = 2.0;
    this.dataView.writeF32(pos[0] * dist);
    this.dataView.writeF32(pos[1] * dist);
    this.dataView.writeF32(pos[2] * dist);
    this.dataView.writeF32(0.0);

    this.dataView.writeF32(l.color[0]);
    this.dataView.writeF32(l.color[1]);
    this.dataView.writeF32(l.color[2]);
    this.dataView.writeF32(l.energy);
  }
}

const TMP_VEC3 = vec3.create();
