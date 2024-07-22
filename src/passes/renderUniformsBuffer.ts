import { mat4, vec3 } from 'wgpu-matrix';
import {
  BYTES_F32,
  BYTES_MAT4,
  BYTES_VEC4,
  CONFIG,
  DISPLAY_MODE,
  LightCfg,
} from '../constants.ts';
import { PassCtx } from './passCtx.ts';
import { TypedArrayView } from '../utils/typedArrayView.ts';
import { sphericalToCartesian } from '../utils/index.ts';
import { getLengthOfHairTileSegmentsBuffer } from './swHair/shared/hairTileSegmentsBuffer.ts';
import { getModelViewProjectionMatrix } from '../utils/matrices.ts';

const TMP_MAT4 = mat4.create(); // prealloc

export class RenderUniformsBuffer {
  public static SHADER_SNIPPET = (group: number) => /* wgsl */ `
    const b11 = 3u; // binary 0b11
    const b111 = 7u; // binary 0b111
    const b1111 = 15u; // binary 0b1111
    const b11111 = 31u; // binary 0b11111
    const b111111 = 63u; // binary 0b111111

    const DISPLAY_MODE_FINAL = ${DISPLAY_MODE.FINAL}u;
    const DISPLAY_MODE_TILES = ${DISPLAY_MODE.TILES}u;
    const DISPLAY_MODE_HW_RENDER = ${DISPLAY_MODE.HW_RENDER}u;
    const DISPLAY_MODE_USED_SLICES = ${DISPLAY_MODE.USED_SLICES}u;

    struct Light {
      position: vec4f,
      colorAndEnergy: vec4f,
    }

    struct Uniforms {
      vpMatrix: mat4x4<f32>,
      vpMatrixInv: mat4x4<f32>,
      viewMatrix: mat4x4<f32>,
      projMatrix: mat4x4<f32>,
      modelMatrix: mat4x4<f32>,
      modelViewMat: mat4x4<f32>,
      mvpMatrix: mat4x4<f32>,
      viewport: vec4f,
      cameraPosition: vec4f,
      colorMgmt: vec4f,
      lightAmbient: vec4f,
      light0: Light,
      light1: Light,
      light2: Light,
      fiberRadius: f32,
      maxDrawnHairSegments: u32,
      displayMode: u32, // display mode + some of it's settings
      padding2: f32,
    };
    @binding(0) @group(${group})
    var<uniform> _uniforms: Uniforms;

    fn getDisplayMode() -> u32 { return _uniforms.displayMode & 0xff; }
    fn getDbgModeExtra() -> u32 { return (_uniforms.displayMode >> 8) & 0xffff; }
    fn getDbgTileModeMaxSegments() -> u32 { return getDbgModeExtra(); }
    fn getDbgSlicesModeMaxSlices() -> u32 { 
      return select(0u, getDbgModeExtra(), getDisplayMode() == DISPLAY_MODE_USED_SLICES);
    }
  `;

  private static LIGHT_SIZE = 2 * BYTES_VEC4;

  private static BUFFER_SIZE =
    BYTES_MAT4 + // vpMatrix
    BYTES_MAT4 + // vpMatrixInv
    BYTES_MAT4 + // viewMatrix
    BYTES_MAT4 + // projMatrix
    BYTES_MAT4 + // modelMat
    BYTES_MAT4 + // modelViewMat
    BYTES_MAT4 + // mvpMat
    BYTES_VEC4 + // viewport
    BYTES_VEC4 + // cameraPosition
    BYTES_VEC4 + // color mgmt
    BYTES_VEC4 + // lightAmbient
    3 * RenderUniformsBuffer.LIGHT_SIZE + // lights
    4 * BYTES_F32; // fiberRadius, maxDrawnHairSegments, padding

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
    const { modelMatrix } = ctx.scene;
    const c = CONFIG;
    const col = c.colors;
    const camPos = cameraPositionWorldSpace;

    this.dataView.resetCursor();
    this.dataView.writeMat4(vpMatrix);
    this.dataView.writeMat4(mat4.invert(vpMatrix, TMP_MAT4));
    this.dataView.writeMat4(viewMatrix);
    this.dataView.writeMat4(projMatrix);
    this.dataView.writeMat4(modelMatrix);
    // model-view matrix
    mat4.multiply(viewMatrix, modelMatrix, TMP_MAT4);
    this.dataView.writeMat4(TMP_MAT4);
    // model-view-projection matrix
    getModelViewProjectionMatrix(modelMatrix, viewMatrix, projMatrix, TMP_MAT4);
    this.dataView.writeMat4(TMP_MAT4);

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
    // misc
    this.dataView.writeF32(c.hairRender.fiberRadius);
    this.dataView.writeU32(getLengthOfHairTileSegmentsBuffer(viewport));
    this.dataView.writeU32(this.encodeDebugMode());
    this.dataView.writeU32(0); // padding

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

  private encodeDebugMode() {
    const hr = CONFIG.hairRender;
    let extraData = 0;

    if (hr.displayMode === DISPLAY_MODE.TILES) {
      extraData = hr.dbgTileModeMaxSegments;
    } else if (hr.displayMode === DISPLAY_MODE.USED_SLICES) {
      extraData = hr.dbgSlicesModeMaxSlices;
    }

    return hr.displayMode | (extraData << 8);
  }
}

const TMP_VEC3 = vec3.create();
