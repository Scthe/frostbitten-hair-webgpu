import { CONFIG } from '../../constants.ts';
import { assertIsGPUTextureView } from '../../utils/webgpu.ts';
import { cmdDrawFullscreenTriangle } from '../_shaderSnippets/fullscreenTriangle.wgsl.ts';
import { BindingsCache } from '../_shared/bindingsCache.ts';
import {
  labelShader,
  labelPipeline,
  useColorAttachment,
  assignResourcesToBindings,
} from '../_shared/shared.ts';
import { PassCtx } from '../passCtx.ts';

import { SHADER_PARAMS, SHADER_CODE } from './presentPass.wgsl.ts';

export class PresentPass {
  public static NAME: string = PresentPass.name;

  private readonly pipeline: GPURenderPipeline;
  private readonly bindingsCache = new BindingsCache();

  constructor(device: GPUDevice, outTextureFormat: GPUTextureFormat) {
    const shaderModule = device.createShaderModule({
      label: labelShader(PresentPass),
      code: SHADER_CODE(),
    });

    this.pipeline = device.createRenderPipeline({
      label: labelPipeline(PresentPass),
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
  }

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

    const bindings = this.bindingsCache.getBindings('-', () =>
      this.createBindings(ctx)
    );
    renderPass.setBindGroup(0, bindings);
    renderPass.setPipeline(this.pipeline);
    cmdDrawFullscreenTriangle(renderPass);
    renderPass.end();
  }

  private createBindings = ({
    device,
    globalUniforms,
    hdrRenderTexture,
  }: PassCtx): GPUBindGroup => {
    const b = SHADER_PARAMS.bindings;

    return assignResourcesToBindings(PresentPass, device, this.pipeline, [
      globalUniforms.createBindingDesc(b.renderUniforms),
      { binding: b.textureSrc, resource: hdrRenderTexture },
    ]);
  };
}
