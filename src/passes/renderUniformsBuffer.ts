import { Mat4, mat4, vec3 } from 'wgpu-matrix';
import {
  BYTES_F32,
  BYTES_MAT4,
  BYTES_UVEC4,
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
import {
  getShadowSourceProjectionMatrix,
  getShadowSourceViewMatrix,
  getShadowSourceWorldPosition,
} from './shadowMapPass/shared/getMVP_ShadowSourceMatrix.ts';
import { getShadowMapPreviewSize } from './shadowMapPass/shared/getShadowMapPreviewSize.ts';
import { Scene } from '../scene/scene.ts';

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
    const DISPLAY_MODE_DEPTH = ${DISPLAY_MODE.DEPTH}u;
    const DISPLAY_MODE_NORMALS = ${DISPLAY_MODE.NORMALS}u;
    const DISPLAY_MODE_AO = ${DISPLAY_MODE.AO}u;

    struct Light {
      position: vec4f, // [x, y, z, 0.0]
      colorAndEnergy: vec4f, // [r, g, b, energy]
    }

    // https://github.com/Scthe/WebFX/blob/09713a3e7ebaa1484ff53bd8a007908a5340ca8e/src/webfx/passes/ForwardPass.ts#L65
    struct Shadows {
      sourceModelViewMat: mat4x4<f32>,
      sourceProjMatrix: mat4x4<f32>,
      sourceMVP_Matrix: mat4x4<f32>,
      sourcePosition: vec4f, // xyz, but .w is fiber width
      usePCSS: u32,
      PCF_Radius: u32,
      bias: f32,
      strength: f32,
    }
    fn getShadowFiberRadius() -> f32 { return _uniforms.shadows.sourcePosition.w; }

    struct AmbientOcclusion {
      radius: f32, // in world space
      directionOffset: f32,
      falloffStart2: f32,
      falloffEnd2: f32,
      // vec4f end, start vec4u
      numDirections: u32,
      numSteps: u32,
      strength: f32,
      padding0: f32,
    }

    struct HairMaterialParams {
      // 1 * vec4f
      color0: vec3f,
      specular: f32,
      // 1 * vec4f
      color1: vec3f,
      shadows: f32,
      // 4 * f32
      weightTT: f32,
      weightTRT: f32,
      shift: f32,
      roughness: f32,
      // 4 * f32
      colorRng: f32,
      lumaRng: f32,
      attenuation: f32,
      padding1: f32,
    }

    struct Background {
      color0: vec3f,
      noiseScale: f32,
      color1: vec3f,
      gradientStrength: f32,
    }

    struct Uniforms {
      vpMatrix: mat4x4<f32>,
      vpMatrixInv: mat4x4<f32>,
      viewMatrix: mat4x4<f32>,
      projMatrix: mat4x4<f32>,
      projMatrixInv: mat4x4<f32>,
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
      shadows: Shadows,
      ao: AmbientOcclusion,
      hairMaterial: HairMaterialParams,
      // START: misc vec4f
      fiberRadius: f32,
      dbgShadowMapPreviewSize: f32,
      maxDrawnHairSegments: u32,
      displayMode: u32, // display mode + some of it's settings
      // back to proper align
      background: Background,
    };
    @binding(0) @group(${group})
    var<uniform> _uniforms: Uniforms;

    fn getDisplayMode() -> u32 { return _uniforms.displayMode & 0xff; }
    fn getDbgModeExtra() -> u32 { return (_uniforms.displayMode >> 8) & 0xffff; }
    fn getDbgTileModeMaxSegments() -> u32 { return getDbgModeExtra(); }
    fn getDbgSlicesModeMaxSlices() -> u32 { 
      return select(0u, getDbgModeExtra(), getDisplayMode() == DISPLAY_MODE_USED_SLICES);
    }
    fn getDbgFinalModeShowTiles() -> bool {
      let flags = select(0u, getDbgModeExtra(), getDisplayMode() == DISPLAY_MODE_FINAL);
      return (flags & 1u) > 0u;
    }
  `;

  private static LIGHT_SIZE = 2 * BYTES_VEC4;
  private static SHADOWS_SIZE =
    BYTES_MAT4 + // sourceModelViewMat
    BYTES_MAT4 + // sourceProjMatrix
    BYTES_MAT4 + // mvpShadowSourceMatrix
    BYTES_VEC4 + // shadowSourcePosition;
    BYTES_VEC4; // flags + settings
  private static AO_SIZE = BYTES_VEC4 + BYTES_UVEC4;
  private static BACKGROUND_SIZE = 2 * BYTES_VEC4;

  private static BUFFER_SIZE =
    BYTES_MAT4 + // vpMatrix
    BYTES_MAT4 + // vpMatrixInv
    BYTES_MAT4 + // viewMatrix
    BYTES_MAT4 + // projMatrix
    BYTES_MAT4 + // projMatrixInv
    BYTES_MAT4 + // modelMat
    BYTES_MAT4 + // modelViewMat
    BYTES_MAT4 + // mvpMat
    BYTES_VEC4 + // viewport
    BYTES_VEC4 + // cameraPosition
    BYTES_VEC4 + // color mgmt
    BYTES_VEC4 + // lightAmbient
    3 * RenderUniformsBuffer.LIGHT_SIZE + // lights
    RenderUniformsBuffer.SHADOWS_SIZE + // ahadows
    RenderUniformsBuffer.AO_SIZE + // ao
    4 * BYTES_VEC4 + // hairMaterial
    4 * BYTES_F32 + // fiberRadius, dbgShadowMapPreviewSize, maxDrawnHairSegments,
    RenderUniformsBuffer.BACKGROUND_SIZE;

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
      scene,
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
    this.dataView.writeMat4(mat4.invert(projMatrix, TMP_MAT4));
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
    // shadows
    this.writeShadows(scene, modelMatrix);
    // ao
    this.writeAo();
    // hair material
    this.writeHairMaterial();
    // misc
    this.dataView.writeF32(c.hairRender.fiberRadius);
    this.dataView.writeF32(getShadowMapPreviewSize(viewport));
    this.dataView.writeU32(getLengthOfHairTileSegmentsBuffer(viewport));
    this.dataView.writeU32(this.encodeDebugMode());
    // bg
    this.writeBackground();

    // final write
    this.dataView.assertWrittenBytes(RenderUniformsBuffer.BUFFER_SIZE);
    this.dataView.upload(device, this.gpuBuffer, 0);
  }

  private writeLight(l: LightCfg) {
    const pos = sphericalToCartesian(l.posPhi, l.posTheta, 'dgr', TMP_VEC3);
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

  private writeShadows(scene: Scene, modelMatrix: Mat4) {
    const c = CONFIG.shadows;
    const viewMat = getShadowSourceViewMatrix(modelMatrix);
    const projMat = getShadowSourceProjectionMatrix(
      modelMatrix,
      viewMat,
      scene
    );

    // source ModelView Mat
    const mvMat = mat4.multiply(viewMat, modelMatrix, TMP_MAT4);
    this.dataView.writeMat4(mvMat);
    // source Proj Matrix
    this.dataView.writeMat4(projMat);
    // mvp matrix
    const mvpMatrix = getModelViewProjectionMatrix(
      modelMatrix,
      viewMat,
      projMat,
      TMP_MAT4
    );
    this.dataView.writeMat4(mvpMatrix);
    // shadow position
    const shadowPos = getShadowSourceWorldPosition();
    this.dataView.writeF32(shadowPos[0]);
    this.dataView.writeF32(shadowPos[1]);
    this.dataView.writeF32(shadowPos[2]);
    const fiberRadius =
      c.hairFiberWidthMultiplier * CONFIG.hairRender.fiberRadius;
    this.dataView.writeF32(fiberRadius);
    // settings
    this.dataView.writeU32(c.usePCSS ? 1 : 0); // usePCSS: u32,
    this.dataView.writeU32(c.PCF_Radius); // PCF_Radius: u32,
    this.dataView.writeF32(c.bias); // bias: f32,
    this.dataView.writeF32(c.strength); // strength: f32,
  }

  private writeAo() {
    const c = CONFIG.ao;

    this.dataView.writeF32(c.radius);
    this.dataView.writeF32(c.directionOffset);
    this.dataView.writeF32(c.falloffStart2);
    this.dataView.writeF32(c.falloffEnd2);

    this.dataView.writeU32(c.numDirections);
    this.dataView.writeU32(c.numSteps);
    const str = c.strength;
    this.dataView.writeF32(str);
    this.dataView.writeU32(0); // padding0: u32,
  }

  private writeHairMaterial() {
    const m = CONFIG.hairRender.material;

    this.dataView.writeF32(m.color0[0]);
    this.dataView.writeF32(m.color0[1]);
    this.dataView.writeF32(m.color0[2]);
    this.dataView.writeF32(m.specular);

    this.dataView.writeF32(m.color1[0]);
    this.dataView.writeF32(m.color1[1]);
    this.dataView.writeF32(m.color1[2]);
    this.dataView.writeF32(m.shadows);

    this.dataView.writeF32(m.weightTT);
    this.dataView.writeF32(m.weightTRT);
    this.dataView.writeF32(m.shift);
    this.dataView.writeF32(m.roughness);

    this.dataView.writeF32(m.colorRng);
    this.dataView.writeF32(m.lumaRng);
    this.dataView.writeF32(m.attenuation);
    this.dataView.writeF32(0.0);
  }

  private writeBackground() {
    const bg = CONFIG.background;
    this.dataView.writeF32(bg.color0[0]);
    this.dataView.writeF32(bg.color0[1]);
    this.dataView.writeF32(bg.color0[2]);
    this.dataView.writeF32(bg.noiseScale);

    this.dataView.writeF32(bg.color1[0]);
    this.dataView.writeF32(bg.color1[1]);
    this.dataView.writeF32(bg.color1[2]);
    this.dataView.writeF32(bg.gradientStrength);
  }

  private encodeDebugMode() {
    const c = CONFIG;
    const hr = CONFIG.hairRender;
    let extraData = 0;

    if (c.displayMode === DISPLAY_MODE.TILES) {
      extraData = hr.dbgTileModeMaxSegments;
    } else if (c.displayMode === DISPLAY_MODE.USED_SLICES) {
      extraData = hr.dbgSlicesModeMaxSlices;
    } else if (c.displayMode === DISPLAY_MODE.FINAL) {
      extraData = hr.dbgShowTiles ? 1 : 0;
    }

    return c.displayMode | (extraData << 8);
  }
}

const TMP_VEC3 = vec3.create();
