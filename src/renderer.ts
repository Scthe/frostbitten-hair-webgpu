import { Mat4, mat4 } from 'wgpu-matrix';
import { RenderUniformsBuffer } from './passes/renderUniformsBuffer.ts';
import { Dimensions, debounce } from './utils/index.ts';
import Input from './sys_web/input.ts';
import { CONFIG, DEPTH_FORMAT, HDR_RENDER_TEX_FORMAT } from './constants.ts';
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

    this.drawBackgroundGradientPass = new DrawBackgroundGradientPass(
      device,
      HDR_RENDER_TEX_FORMAT
    );
    this.drawMeshesPass = new DrawMeshesPass(device, HDR_RENDER_TEX_FORMAT);
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
    };

    this.renderUniformBuffer.update2(ctx);

    this.drawBackgroundGradientPass.cmdDraw(ctx, 'load');
    this.cmdDrawScene(ctx);

    this.presentPass.cmdDraw(ctx, screenTexture, 'load');

    this.frameIdx += 1;
  }

  private cmdDrawScene(ctx: PassCtx) {
    this.drawMeshesPass.cmdDrawMeshes(ctx);
    /*
    const softwareRasterizeEnabled = ctx.softwareRasterizerEnabled;
    if (softwareRasterizeEnabled) {
      this.rasterizeSwPass.clearFramebuffer(ctx);
    }

    // draw objects
    for (let i = 0; i < naniteObjects.length; i++) {
      const naniteObject = naniteObjects[i];
      const loadOp: GPULoadOp = i == 0 ? 'clear' : 'load';

      if (!CONFIG.nanite.render.freezeGPU_Visibilty) {
        if (CONFIG.cullingInstances.enabled) {
          this.cullInstancesPass.cmdCullInstances(ctx, naniteObject);
        }
        this.cullMeshletsPass.cmdCullMeshlets(ctx, naniteObject);
      }

      // draw: hardware
      this.rasterizeHwPass.cmdHardwareRasterize(ctx, naniteObject, loadOp);

      // draw: software
      if (softwareRasterizeEnabled) {
        this.rasterizeSwPass.cmdSoftwareRasterize(ctx, naniteObject);
      }
    }

    // combine hardware + software rasterizer results
    if (softwareRasterizeEnabled) {
      this.rasterizeCombine.cmdCombineRasterResults(ctx);
    }
    */
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
  };

  onCanvasResize = debounce(this.handleViewportResize, 500);
}
