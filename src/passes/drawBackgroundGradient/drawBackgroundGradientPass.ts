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
import {
  SHADER_CODE,
  SHADER_PARAMS,
} from './drawBackgroundGradientPass.wgsl.ts';

export class DrawBackgroundGradientPass {
  public static NAME: string = DrawBackgroundGradientPass.name;

  private readonly pipeline: GPURenderPipeline;
  private readonly bindingsCache = new BindingsCache();

  constructor(device: GPUDevice, outTextureFormat: GPUTextureFormat) {
    const shaderModule = device.createShaderModule({
      label: labelShader(DrawBackgroundGradientPass),
      code: SHADER_CODE(),
    });

    this.pipeline = device.createRenderPipeline({
      label: labelPipeline(DrawBackgroundGradientPass),
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

  cmdDraw(ctx: PassCtx) {
    const { cmdBuf, profiler, hdrRenderTexture } = ctx;
    assertIsGPUTextureView(hdrRenderTexture);

    const renderPass = cmdBuf.beginRenderPass({
      label: DrawBackgroundGradientPass.NAME,
      colorAttachments: [
        // TBH no need for clear as we override every pixel
        useColorAttachment(hdrRenderTexture, CONFIG.clearColor, 'load'),
      ],
      timestampWrites: profiler?.createScopeGpu(
        DrawBackgroundGradientPass.NAME
      ),
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
  }: PassCtx): GPUBindGroup => {
    const b = SHADER_PARAMS.bindings;

    return assignResourcesToBindings(
      DrawBackgroundGradientPass,
      device,
      this.pipeline,
      [globalUniforms.createBindingDesc(b.renderUniforms)]
    );
  };
}
