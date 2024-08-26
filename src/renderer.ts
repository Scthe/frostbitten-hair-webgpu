import { Mat4, mat4 } from 'wgpu-matrix';
import { RenderUniformsBuffer } from './passes/renderUniformsBuffer.ts';
import { Dimensions, debounce } from './utils/index.ts';
import Input from './sys_web/input.ts';
import {
  AO_TEX_FORMAT,
  CONFIG,
  DEPTH_FORMAT,
  DISPLAY_MODE,
  HDR_RENDER_TEX_FORMAT,
  NORMALS_TEX_FORMAT,
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
import { HairShadingPass } from './passes/hairShadingPass/hairShadingPass.ts';
import { ShadowMapPass } from './passes/shadowMapPass/shadowMapPass.ts';
import { AoPass } from './passes/aoPass/aoPass.ts';
import { HairObject } from './scene/hair/hairObject.ts';
import { SimulationUniformsBuffer } from './passes/simulation/simulationUniformsBuffer.ts';
import { HairSimIntegrationPass } from './passes/simulation/hairSimIntegrationPass.ts';
import { DrawSdfColliderPass } from './passes/drawSdfCollider/drawSdfColliderPass.ts';
import { DrawGridDbgPass } from './passes/drawGridDbg/drawGridDbgPass.ts';
import { GridPostSimPass } from './passes/simulation/gridPostSimPass.ts';
import { GridPreSimPass } from './passes/simulation/gridPreSimPass.ts';
import { DrawGizmoPass } from './passes/drawGizmo/drawGizmoPass.ts';
import { HairTileSortPass } from './passes/swHair/hairTileSortPass.ts';

export class Renderer {
  public readonly cameraCtrl: Camera;
  public projectionMat: Mat4;
  private readonly _viewProjectionMatrix = mat4.identity(); // cached to prevent allocs.
  private readonly viewportSize: Dimensions = { width: 0, height: 0 };
  private frameIdx = 0;

  // render target textures
  private depthTexture: GPUTexture = undefined!; // see this.handleViewportResize()
  private depthTextureView: GPUTextureView = undefined!; // see this.handleViewportResize()
  private hdrRenderTexture: GPUTexture = undefined!; // see this.handleViewportResize()
  private hdrRenderTextureView: GPUTextureView = undefined!; // see this.handleViewportResize()
  private normalsTexture: GPUTexture = undefined!; // see this.handleViewportResize()
  private normalsTextureView: GPUTextureView = undefined!; // see this.handleViewportResize()
  private aoTexture: GPUTexture = undefined!; // see this.handleViewportResize()
  private aoTextureView: GPUTextureView = undefined!; // see this.handleViewportResize()

  // rendering
  private readonly renderUniformBuffer: RenderUniformsBuffer;
  // passes
  private readonly drawBackgroundGradientPass: DrawBackgroundGradientPass;
  private readonly shadowMapPass: ShadowMapPass;
  private readonly aoPass: AoPass;
  private readonly drawMeshesPass: DrawMeshesPass;
  private readonly drawGizmoPass: DrawGizmoPass;
  private readonly hwHairPass: HwHairPass;
  private readonly hairTilesPass: HairTilesPass;
  private readonly hairShadingPass: HairShadingPass;
  private readonly hairFinePass: HairFinePass;
  private readonly hairTileSortPass: HairTileSortPass;
  private readonly hairCombinePass: HairCombinePass;
  private readonly presentPass: PresentPass;

  // simulation
  private readonly simulationUniformsBuffer: SimulationUniformsBuffer;
  // passes
  private readonly hairSimIntegrationPass: HairSimIntegrationPass;
  private readonly gridPreSimPass: GridPreSimPass;
  private readonly gridPostSimPass: GridPostSimPass;
  private readonly drawSdfColliderPass: DrawSdfColliderPass;
  private readonly drawGridDbgPass: DrawGridDbgPass;

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
    this.shadowMapPass = new ShadowMapPass(device);
    this.aoPass = new AoPass(device, AO_TEX_FORMAT);
    this.drawMeshesPass = new DrawMeshesPass(
      device,
      HDR_RENDER_TEX_FORMAT,
      NORMALS_TEX_FORMAT
    );
    this.drawGizmoPass = new DrawGizmoPass(device, HDR_RENDER_TEX_FORMAT);
    this.hwHairPass = new HwHairPass(
      device,
      HDR_RENDER_TEX_FORMAT,
      NORMALS_TEX_FORMAT
    );
    this.hairTilesPass = new HairTilesPass(device);
    this.hairTileSortPass = new HairTileSortPass(device);
    this.hairShadingPass = new HairShadingPass(device);
    this.hairFinePass = new HairFinePass(device);
    this.hairCombinePass = new HairCombinePass(device, HDR_RENDER_TEX_FORMAT);
    this.presentPass = new PresentPass(device, preferredCanvasFormat);

    // simulation
    this.simulationUniformsBuffer = new SimulationUniformsBuffer(device);
    this.hairSimIntegrationPass = new HairSimIntegrationPass(device);
    this.gridPreSimPass = new GridPreSimPass(device);
    this.gridPostSimPass = new GridPostSimPass(device);
    this.drawSdfColliderPass = new DrawSdfColliderPass(
      device,
      HDR_RENDER_TEX_FORMAT
    );
    this.drawGridDbgPass = new DrawGridDbgPass(device, HDR_RENDER_TEX_FORMAT);

    this.handleViewportResize(viewportSize);
  }

  updateCamera(deltaTime: number, input: Input) {
    this.cameraCtrl.update(deltaTime, input);
  }

  /** Update stuff before first frame. Usually things that depend on depth/normals */
  beforeFirstFrame(scene: Scene) {
    const cmdBuf = this.device.createCommandEncoder({
      label: 'renderer--before-first-frame',
    });

    const hairSimCfg = CONFIG.hairSimulation;
    const ctx: PassCtx = this.createPassCtx(cmdBuf, scene);

    // update GPU uniforms
    this.renderUniformBuffer.update(ctx);
    this.simulationUniformsBuffer.update(ctx);

    // send the initial strand positions into the grid for density grad
    if (hairSimCfg.physicsForcesGrid.enableUpdates) {
      this.gridPostSimPass.cmdUpdateGridsAfterSim(ctx, scene.hairObject);
    }

    // init stuff for first frame
    this.drawMeshesPass.cmdDrawMeshes(ctx);

    const { hairObject } = ctx.scene;
    this.updateResourcesForNextFrame(ctx, hairObject);

    this.device.queue.submit([cmdBuf.finish()]);
  }

  cmdRender(
    cmdBuf: GPUCommandEncoder,
    scene: Scene,
    screenTexture: GPUTextureView
  ) {
    assertIsGPUTextureView(screenTexture);
    const hairSimCfg = CONFIG.hairSimulation;
    const ctx: PassCtx = this.createPassCtx(cmdBuf, scene);
    const { displayMode } = CONFIG;

    // update GPU uniforms
    this.renderUniformBuffer.update(ctx);
    this.simulationUniformsBuffer.update(ctx);

    // simulation
    this.simulateHair(ctx, scene.hairObject);

    // draws
    this.drawBackgroundGradientPass.cmdDraw(ctx);
    this.cmdDrawScene(ctx);
    if (
      displayMode === DISPLAY_MODE.HW_RENDER ||
      displayMode === DISPLAY_MODE.FINAL
    ) {
      this.drawGizmoPass.cmdDrawGizmo(ctx);
    }

    // dbg
    if (hairSimCfg.sdf.showDebugView) {
      this.drawSdfColliderPass.cmdDrawSdf(ctx);
    } else if (hairSimCfg.physicsForcesGrid.showDebugView) {
      this.drawGridDbgPass.cmdDrawGridDbg(ctx);
    }

    // present: draw to final render texture
    this.presentPass.cmdDraw(ctx, screenTexture, 'load');

    // done
    this.frameIdx += 1;
  }

  private simulateHair(ctx: PassCtx, hairObject: HairObject) {
    const { cmdBuf, physicsForcesGrid } = ctx;
    const hairSimCfg = CONFIG.hairSimulation;

    if (hairSimCfg.nextFrameResetSimulation) {
      hairObject.resetSimulation(cmdBuf);
      physicsForcesGrid.clearDensityGradAndWindBuffer(cmdBuf);
      physicsForcesGrid.clearDensityVelocityBuffer(cmdBuf);

      hairSimCfg.nextFrameResetSimulation = false;
      return;
    }

    if (!hairSimCfg.enabled) {
      physicsForcesGrid.clearDensityGradAndWindBuffer(cmdBuf);
      physicsForcesGrid.clearDensityVelocityBuffer(cmdBuf);
      return;
    }

    if (hairSimCfg.physicsForcesGrid.enableUpdates) {
      this.gridPreSimPass.cmdUpdateGridsBeforeSim(ctx, hairObject);
    }

    this.hairSimIntegrationPass.cmdSimulateHairPositions(ctx, hairObject);

    if (hairSimCfg.physicsForcesGrid.enableUpdates) {
      this.gridPostSimPass.cmdUpdateGridsAfterSim(ctx, hairObject);
    }
  }

  private cmdDrawScene(ctx: PassCtx) {
    const { hairObject } = ctx.scene;

    this.shadowMapPass.cmdUpdateShadowMap(ctx);

    this.drawMeshesPass.cmdDrawMeshes(ctx);

    const { displayMode } = CONFIG;
    if (
      displayMode === DISPLAY_MODE.HW_RENDER ||
      // debug modes that can use early-out without sw raster
      displayMode === DISPLAY_MODE.DEPTH ||
      displayMode === DISPLAY_MODE.AO ||
      displayMode === DISPLAY_MODE.NORMALS
    ) {
      this.hwHairPass.cmdDrawHair(ctx);
      this.aoPass.cmdCalcAo(ctx); // might or might not be used if displayMode is right
      this.hairShadingPass.cmdComputeShadingPoints(ctx, hairObject); // requires depth
      return;
    }

    this.hairTilesPass.cmdClearBeforeRender(ctx);
    this.hairFinePass.cmdClearBeforeRender(ctx);
    this.hairTileSortPass.cmdClearBeforeRender(ctx);

    // hair rasterize pass 1
    this.hairTilesPass.cmdDrawHairToTiles(ctx, hairObject);

    if (
      displayMode !== DISPLAY_MODE.TILES &&
      displayMode !== DISPLAY_MODE.TILES_PPLL
    ) {
      this.hairTileSortPass.cmdSortHairTiles(ctx);
      // hair rasterize pass 2
      this.hairFinePass.cmdRasterizeSlicesHair(ctx, hairObject);
    }

    // combine meshes + hair
    this.hairCombinePass.cmdCombineRasterResults(ctx);

    this.updateResourcesForNextFrame(ctx, hairObject);
  }

  private updateResourcesForNextFrame(ctx: PassCtx, hairObject: HairObject) {
    // we use hardware rasterizer as software one is pain to write the values.
    // If we had 64bit atomics then sure. But without it, the alternatives are a bit complex.
    // While depth can just be an atomicMin<u32> during tile pass, the normal/tangent..
    // In nanite-webpgu I've used 16 bit for depth and 2*u8 oct. encoded normals.
    // But this is hair, tiny depth imperfections will be visible. Alternatives are.. complex.
    // And I'm lazy.
    this.hwHairPass.cmdDrawHair(ctx); // writes hair to depth+normal buffer
    this.aoPass.cmdCalcAo(ctx); // requires depth+normals
    this.hairShadingPass.cmdComputeShadingPoints(ctx, hairObject); // requires depth
  }

  public get viewMatrix() {
    return this.cameraCtrl.viewMatrix;
  }

  private createPassCtx(cmdBuf: GPUCommandEncoder, scene: Scene): PassCtx {
    const vpMatrix = getViewProjectionMatrix(
      this.viewMatrix,
      this.projectionMat,
      this._viewProjectionMatrix
    );
    return {
      frameIdx: this.frameIdx,
      device: this.device,
      cmdBuf,
      viewport: this.viewportSize,
      scene,
      hdrRenderTexture: this.hdrRenderTextureView,
      normalsTexture: this.normalsTextureView,
      aoTexture: this.aoTextureView,
      profiler: this.profiler,
      viewMatrix: this.viewMatrix,
      vpMatrix,
      projMatrix: this.projectionMat,
      cameraPositionWorldSpace: this.cameraCtrl.positionWorldSpace,
      depthTexture: this.depthTextureView,
      shadowDepthTexture: this.shadowMapPass.shadowDepthTextureView,
      shadowMapSampler: this.shadowMapPass.shadowMapSampler,
      globalUniforms: this.renderUniformBuffer,
      simulationUniforms: this.simulationUniformsBuffer,
      physicsForcesGrid: scene.physicsGrid,
      // hair:
      hairTilesBuffer: this.hairTilesPass.hairTilesBuffer,
      hairTileSegmentsBuffer: this.hairTilesPass.hairTileSegmentsBuffer,
      hairSegmentCountPerTileBuffer:
        this.hairTilesPass.segmentCountPerTileBuffer,
      hairRasterizerResultsBuffer:
        this.hairFinePass.hairRasterizerResultsBuffer,
      hairTileListBuffer: this.hairTileSortPass.tileListBuffer,
    };
  }

  private handleViewportResize = (viewportSize: Dimensions) => {
    console.log(`Viewport resize`, viewportSize);

    this.viewportSize.width = viewportSize.width;
    this.viewportSize.height = viewportSize.height;

    this.projectionMat = createCameraProjectionMat(
      CONFIG.camera.projection,
      viewportSize
    );

    this.recreateTextures(viewportSize);

    // reset bindings that used texture
    this.presentPass.onViewportResize();
    this.drawBackgroundGradientPass.onViewportResize();
    this.hairTilesPass.onViewportResize(this.device, viewportSize);
    this.hairFinePass.onViewportResize(this.device, viewportSize);
    this.hairTileSortPass.onViewportResize(this.device, viewportSize);
    this.hairCombinePass.onViewportResize();
    this.aoPass.onViewportResize();
    this.hairShadingPass.onViewportResize();
    this.drawMeshesPass.onViewportResize();
  };

  private recreateTextures(viewportSize: Dimensions) {
    if (this.depthTexture) {
      this.depthTexture.destroy();
    }
    if (this.hdrRenderTexture) {
      this.hdrRenderTexture.destroy();
    }
    if (this.normalsTexture) {
      this.normalsTexture.destroy();
    }
    if (this.aoTexture) {
      this.aoTexture.destroy();
    }

    const vpStr = `${viewportSize.width}x${viewportSize.height}`;
    const renderTargetUsages: GPUTextureUsageFlags =
      GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING;

    this.hdrRenderTexture = this.device.createTexture({
      label: `hdr-texture-${vpStr}`,
      size: [viewportSize.width, viewportSize.height],
      format: HDR_RENDER_TEX_FORMAT,
      usage: renderTargetUsages,
    });
    this.hdrRenderTextureView = this.hdrRenderTexture.createView();

    this.normalsTexture = this.device.createTexture({
      label: `normals-texture-${vpStr}`,
      size: [viewportSize.width, viewportSize.height],
      format: NORMALS_TEX_FORMAT,
      usage: renderTargetUsages,
    });
    this.normalsTextureView = this.normalsTexture.createView();

    this.depthTexture = this.device.createTexture({
      label: `depth-texture-${vpStr}`,
      size: [viewportSize.width, viewportSize.height],
      format: DEPTH_FORMAT,
      usage: renderTargetUsages,
    });
    this.depthTextureView = this.depthTexture.createView();

    const aoSizeMul = CONFIG.ao.textureSizeMul;
    const aoSize: Dimensions = {
      width: Math.ceil(viewportSize.width * aoSizeMul),
      height: Math.ceil(viewportSize.height * aoSizeMul),
    };
    this.aoTexture = this.device.createTexture({
      label: `ao-texture-${vpStr}`,
      size: [aoSize.width, aoSize.height],
      format: AO_TEX_FORMAT,
      usage: renderTargetUsages,
    });
    this.aoTextureView = this.aoTexture.createView();
  }

  onCanvasResize = debounce(this.handleViewportResize, 500);
}
