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

import { SHADER_PARAMS, SHADER_CODE } from './aoPass.wgsl.ts';

export class AoPass {
  public static NAME: string = 'AoPass';

  private readonly pipeline: GPURenderPipeline;
  private readonly bindingsCache = new BindingsCache();

  constructor(device: GPUDevice, outTextureFormat: GPUTextureFormat) {
    const shaderModule = device.createShaderModule({
      label: labelShader(AoPass),
      code: SHADER_CODE(),
    });
    this.pipeline = device.createRenderPipeline({
      label: labelPipeline(AoPass),
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

  cmdCalcAo(ctx: PassCtx) {
    const { cmdBuf, profiler, aoTexture } = ctx;
    assertIsGPUTextureView(aoTexture);

    const renderPass = cmdBuf.beginRenderPass({
      label: AoPass.NAME,
      colorAttachments: [
        // TBH no need for clear as we override every pixel
        useColorAttachment(aoTexture, CONFIG.clearAo, 'clear'),
      ],
      timestampWrites: profiler?.createScopeGpu(AoPass.NAME),
    });

    const bindings = this.bindingsCache.getBindings('-', () =>
      this.createBindings(ctx)
    );
    renderPass.setBindGroup(0, bindings);
    renderPass.setPipeline(this.pipeline);
    cmdDrawFullscreenTriangle(renderPass);

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
    } = ctx;
    const b = SHADER_PARAMS.bindings;
    assertIsGPUTextureView(hdrRenderTexture);

    return assignResourcesToBindings(AoPass, device, this.pipeline, [
      globalUniforms.createBindingDesc(b.renderUniforms),
      { binding: b.depthTexture, resource: depthTexture },
      { binding: b.normalsTexture, resource: normalsTexture },
    ]);
  };
}
