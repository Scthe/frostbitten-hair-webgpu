import { CONFIG } from '../../constants.ts';
import { assertIsGPUTextureView } from '../../utils/webgpu.ts';
import { cmdDrawFullscreenTriangle } from '../_shaderSnippets/fullscreenTriangle.wgsl.ts';
import { BindingsCache } from '../_shared/bindingsCache.ts';
import {
  labelShader,
  labelPipeline,
  useColorAttachment,
  assignResourcesToBindings,
  assignResourcesToBindings2,
} from '../_shared/shared.ts';
import { PassCtx } from '../passCtx.ts';

import { SHADER_PARAMS, SHADER_CODE } from './presentPass.wgsl.ts';
import * as DBG_SHADOWS from './dbgShadows.wgsl.ts';
import { getShadowMapPreviewSize } from '../shadowMapPass/shared/getShadowMapPreviewSize.ts';

const LABEL_DBG_SHADOW_MAP = 'dbg-shadow-map';

export class PresentPass {
  public static NAME: string = PresentPass.name;

  private readonly pipeline: GPURenderPipeline;
  private readonly pipelineDbgShadowMap: GPURenderPipeline;
  private readonly bindingsCache = new BindingsCache();

  constructor(device: GPUDevice, outTextureFormat: GPUTextureFormat) {
    // present the result
    let shaderModule = device.createShaderModule({
      label: labelShader(PresentPass),
      code: SHADER_CODE(),
    });
    this.pipeline = this.createPipeline(
      device,
      outTextureFormat,
      shaderModule,
      ''
    );

    // dbg shadow map
    shaderModule = device.createShaderModule({
      label: labelShader(PresentPass, LABEL_DBG_SHADOW_MAP),
      code: DBG_SHADOWS.SHADER_CODE(),
    });
    this.pipelineDbgShadowMap = this.createPipeline(
      device,
      outTextureFormat,
      shaderModule,
      LABEL_DBG_SHADOW_MAP
    );
  }

  private createPipeline = (
    device: GPUDevice,
    outTextureFormat: GPUTextureFormat,
    shaderModule: GPUShaderModule,
    label: string
  ) =>
    device.createRenderPipeline({
      label: labelPipeline(PresentPass, label),
      layout: 'auto',
      vertex: {
        module: shaderModule,
        entryPoint: 'main_vs',
        buffers: [],
      },
      fragment: {
        module: shaderModule,
        entryPoint: 'main_fs',
        targets: [{ format: outTextureFormat }],
      },
      primitive: { topology: 'triangle-list' },
    });

  onViewportResize = () => this.bindingsCache.clear();

  cmdDraw(ctx: PassCtx, screenTexture: GPUTextureView, loadOp: GPULoadOp) {
    const { cmdBuf, profiler } = ctx;
    assertIsGPUTextureView(screenTexture);

    const renderPass = cmdBuf.beginRenderPass({
      label: PresentPass.NAME,
      colorAttachments: [
        // TBH no need for clear as we override every pixel
        useColorAttachment(screenTexture, CONFIG.clearColor, loadOp),
      ],
      timestampWrites: profiler?.createScopeGpu(PresentPass.NAME),
    });

    // render main scene
    const bindings = this.bindingsCache.getBindings('-', () =>
      this.createBindings(ctx)
    );
    renderPass.setBindGroup(0, bindings);
    renderPass.setPipeline(this.pipeline);
    cmdDrawFullscreenTriangle(renderPass);

    // debug views
    if (CONFIG.shadows.showDebugView) {
      this.renderDbgShadowMap(ctx, renderPass);
    }

    // end
    renderPass.end();
  }

  private createBindings = (ctx: PassCtx): GPUBindGroup => {
    const {
      device,
      globalUniforms,
      hdrRenderTexture,
      normalsTexture,
      depthTexture,
      aoTexture,
    } = ctx;
    const b = SHADER_PARAMS.bindings;
    assertIsGPUTextureView(hdrRenderTexture);

    return assignResourcesToBindings(PresentPass, device, this.pipeline, [
      globalUniforms.createBindingDesc(b.renderUniforms),
      { binding: b.resultHDR_Texture, resource: hdrRenderTexture },
      { binding: b.depthTexture, resource: depthTexture },
      { binding: b.normalsTexture, resource: normalsTexture },
      { binding: b.aoTexture, resource: aoTexture },
    ]);
  };

  /////////////////
  /// DBG ShadowMap
  private renderDbgShadowMap(ctx: PassCtx, renderPass: GPURenderPassEncoder) {
    const { viewport } = ctx;
    const pipeline = this.pipelineDbgShadowMap;
    const bindings = this.bindingsCache.getBindings(LABEL_DBG_SHADOW_MAP, () =>
      this.createDbgShadowMapBindings(ctx, pipeline)
    );
    const size = getShadowMapPreviewSize(viewport);
    renderPass.setBindGroup(0, bindings);
    renderPass.setPipeline(pipeline);

    const pos = CONFIG.shadows.debugViewPosition;
    const x = pos[0];
    const y = pos[1];
    renderPass.setViewport(x, y, size, size, 0, 1);
    cmdDrawFullscreenTriangle(renderPass);
  }

  private createDbgShadowMapBindings = (
    ctx: PassCtx,
    pipeline: GPURenderPipeline
  ): GPUBindGroup => {
    const { device, globalUniforms, shadowDepthTexture } = ctx;
    const b = DBG_SHADOWS.SHADER_PARAMS.bindings;
    assertIsGPUTextureView(shadowDepthTexture);

    return assignResourcesToBindings2(
      PresentPass,
      LABEL_DBG_SHADOW_MAP,
      device,
      pipeline,
      [
        globalUniforms.createBindingDesc(b.renderUniforms),
        { binding: b.depthTexture, resource: shadowDepthTexture },
      ]
    );
  };
}
