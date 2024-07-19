import { Mat4, mat4 } from 'wgpu-matrix';
import { RenderUniformsBuffer } from './passes/renderUniformsBuffer.ts';
import { Dimensions, debounce } from './utils/index.ts';
import Input from './sys_web/input.ts';
import {
  CONFIG,
  DEPTH_FORMAT,
  DISPLAY_MODE,
  HDR_RENDER_TEX_FORMAT,
} from './constants.ts';
import { Camera } from './camera.ts';
import { GpuProfiler } from './gpuProfiler.ts';
import { Scene } from './scene/scene.ts';
import { assertIsGPUTextureView } from './utils/webgpu.ts';
import {
  createCameraProjectionMat,
  getViewProjectionMatrix,
} from './utils/matrices.ts';
import { PassCtx } from './passes/passCtx.ts';
import { PresentPass } from './passes/presentPass/presentPass.ts';
import { DrawMeshesPass } from './passes/drawMeshes/drawMeshesPass.ts';
import { DrawBackgroundGradientPass } from './passes/drawBackgroundGradient/drawBackgroundGradientPass.ts';
import { HwHairPass } from './passes/hwHair/hwHairPass.ts';
import { HairTilesPass } from './passes/swHair/hairTilesPass.ts';
import { HairCombinePass } from './passes/hairCombine/hairCombinePass.ts';
import { HairFinePass } from './passes/swHair/hairFinePass.ts';

export class Renderer {
  private readonly renderUniformBuffer: RenderUniformsBuffer;
  public readonly cameraCtrl: Camera;
  private projectionMat: Mat4;
  private readonly _viewMatrix = mat4.identity(); // cached to prevent allocs.
  private readonly viewportSize: Dimensions = { width: 0, height: 0 };
  private frameIdx = 0;

  // render target textures
  private depthTexture: GPUTexture = undefined!; // see this.handleViewportResize()
  private depthTextureView: GPUTextureView = undefined!; // see this.handleViewportResize()
  private hdrRenderTexture: GPUTexture = undefined!; // see this.handleViewportResize()
  private hdrRenderTextureView: GPUTextureView = undefined!; // see this.handleViewportResize()

  // passes
  private readonly drawBackgroundGradientPass: DrawBackgroundGradientPass;
  private readonly drawMeshesPass: DrawMeshesPass;
  private readonly hwHairPass: HwHairPass;
  private readonly hairTilesPass: HairTilesPass;
  private readonly hairFinePass: HairFinePass;
  private readonly hairCombinePass: HairCombinePass;
  private readonly presentPass: PresentPass;

  constructor(
    private readonly device: GPUDevice,
    viewportSize: Dimensions,
    preferredCanvasFormat: GPUTextureFormat,
    private readonly profiler?: GpuProfiler
  ) {
    this.cameraCtrl = new Camera();
    this.projectionMat = createCameraProjectionMat(
      CONFIG.camera.projection,
      viewportSize
    );
    this.renderUniformBuffer = new RenderUniformsBuffer(device);

    // passes
    this.drawBackgroundGradientPass = new DrawBackgroundGradientPass(
      device,
      HDR_RENDER_TEX_FORMAT
    );
    this.drawMeshesPass = new DrawMeshesPass(device, HDR_RENDER_TEX_FORMAT);
    this.hwHairPass = new HwHairPass(device, HDR_RENDER_TEX_FORMAT);
    this.hairTilesPass = new HairTilesPass(device);
    this.hairFinePass = new HairFinePass(device);
    this.hairCombinePass = new HairCombinePass(device, HDR_RENDER_TEX_FORMAT);
    this.presentPass = new PresentPass(device, preferredCanvasFormat);

    this.handleViewportResize(viewportSize);
  }

  updateCamera(deltaTime: number, input: Input): Mat4 {
    this.cameraCtrl.update(deltaTime, input);
  }

  cmdRender(
    cmdBuf: GPUCommandEncoder,
    scene: Scene,
    screenTexture: GPUTextureView
  ) {
    assertIsGPUTextureView(screenTexture);

    const viewMatrix = this.cameraCtrl.viewMatrix;
    const vpMatrix = getViewProjectionMatrix(
      viewMatrix,
      this.projectionMat,
      this._viewMatrix
    );
    const ctx: PassCtx = {
      frameIdx: this.frameIdx,
      device: this.device,
      cmdBuf,
      viewport: this.viewportSize,
      scene,
      hdrRenderTexture: this.hdrRenderTextureView,
      profiler: this.profiler,
      viewMatrix,
      vpMatrix,
      projMatrix: this.projectionMat,
      cameraPositionWorldSpace: this.cameraCtrl.positionWorldSpace,
      depthTexture: this.depthTextureView,
      globalUniforms: this.renderUniformBuffer,
      // hair:
      hairTilesBuffer: this.hairTilesPass.hairTilesBuffer,
      hairTileSegmentsBuffer: this.hairTilesPass.hairTileSegmentsBuffer,
      hairRasterizerResultsBuffer:
        this.hairFinePass.hairRasterizerResultsBuffer,
    };

    this.renderUniformBuffer.update(ctx);

    this.drawBackgroundGradientPass.cmdDraw(ctx, 'load');
    this.cmdDrawScene(ctx);

    this.presentPass.cmdDraw(ctx, screenTexture, 'load');

    this.frameIdx += 1;
  }

  private cmdDrawScene(ctx: PassCtx) {
    this.drawMeshesPass.cmdDrawMeshes(ctx);

    if (CONFIG.hairRender.displayMode === DISPLAY_MODE.HW_RENDER) {
      this.hwHairPass.cmdDrawHair(ctx);
      return;
    }

    this.hairTilesPass.clearFramebuffer(ctx);
    this.hairFinePass.clearFramebuffer(ctx);

    this.hairTilesPass.cmdDrawHairToTiles(ctx, ctx.scene.hairObject);
    this.hairFinePass.cmdRasterizeSlicesHair(ctx, ctx.scene.hairObject);
    this.hairCombinePass.cmdCombineRasterResults(ctx);
  }

  private handleViewportResize = (viewportSize: Dimensions) => {
    console.log(`Viewport resize`, viewportSize);

    this.viewportSize.width = viewportSize.width;
    this.viewportSize.height = viewportSize.height;

    this.projectionMat = createCameraProjectionMat(
      CONFIG.camera.projection,
      viewportSize
    );

    if (this.depthTexture) {
      this.depthTexture.destroy();
    }
    if (this.hdrRenderTexture) {
      this.hdrRenderTexture.destroy();
    }

    const vpStr = `${viewportSize.width}x${viewportSize.height}`;

    this.hdrRenderTexture = this.device.createTexture({
      label: `hdr-texture-${vpStr}`,
      size: [viewportSize.width, viewportSize.height],
      format: HDR_RENDER_TEX_FORMAT,
      usage:
        GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
    this.hdrRenderTextureView = this.hdrRenderTexture.createView();

    this.depthTexture = this.device.createTexture({
      label: `depth-texture-${vpStr}`,
      size: [viewportSize.width, viewportSize.height],
      format: DEPTH_FORMAT,
      usage:
        GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
    this.depthTextureView = this.depthTexture.createView();

    // reset bindings that used texture
    this.presentPass.onViewportResize();
    this.drawBackgroundGradientPass.onViewportResize();
    this.hairTilesPass.onViewportResize(this.device, viewportSize);
    this.hairFinePass.onViewportResize(this.device, viewportSize);
    this.hairCombinePass.onViewportResize();
  };

  onCanvasResize = debounce(this.handleViewportResize, 500);
}
