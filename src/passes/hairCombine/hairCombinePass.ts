import { assertIsGPUTextureView } from '../../utils/webgpu.ts';
import { SHADER_PARAMS, SHADER_CODE } from './hairCombinePass.wgsl.ts';
import { PassCtx } from '../passCtx.ts';
import { cmdDrawFullscreenTriangle } from '../_shaderSnippets/fullscreenTriangle.wgsl.ts';
import { BindingsCache } from '../_shared/bindingsCache.ts';
import {
  labelShader,
  labelPipeline,
  useColorAttachment,
  assignResourcesToBindings2,
  PIPELINE_DEPTH_ON,
  useDepthStencilAttachment,
} from '../_shared/shared.ts';
import { CONFIG } from '../../constants.ts';

export class HairCombinePass {
  public static NAME: string = HairCombinePass.name;

  private readonly pipeline: GPURenderPipeline;
  private readonly bindingsCache = new BindingsCache();

  constructor(device: GPUDevice, outTextureFormat: GPUTextureFormat) {
    const shaderModule = device.createShaderModule({
      label: labelShader(HairCombinePass),
      code: SHADER_CODE(),
    });

    this.pipeline = device.createRenderPipeline({
      label: labelPipeline(HairCombinePass),
      layout: 'auto',
      vertex: {
        module: shaderModule,
        entryPoint: 'main_vs',
        buffers: [],
      },
      fragment: {
        module: shaderModule,
        entryPoint: 'main_fs',
        targets: [
          {
            format: outTextureFormat,
            blend: {
              // color is based on the alpha from the shader's output.
              // So we can decide in code. But it also has a discard() there.
              color: {
                srcFactor: 'src-alpha',
                dstFactor: 'one-minus-src-alpha',
                operation: 'add',
              },
              alpha: {
                srcFactor: 'one',
                dstFactor: 'one',
                operation: 'add',
              },
            },
          },
        ],
      },
      primitive: { topology: 'triangle-list' },
      depthStencil: PIPELINE_DEPTH_ON,
    });
  }

  onViewportResize = () => this.bindingsCache.clear();

  cmdCombineRasterResults(
    ctx: PassCtx,
    hairRasterizeResult: GPUBuffer,
    hairSegmentsPerTileBuffer: GPUBuffer
  ) {
    const { cmdBuf, profiler, hdrRenderTexture, depthTexture } = ctx;
    assertIsGPUTextureView(hdrRenderTexture);

    const renderPass = cmdBuf.beginRenderPass({
      label: HairCombinePass.NAME,
      colorAttachments: [
        // do not clear!
        useColorAttachment(hdrRenderTexture, CONFIG.clearColor, 'load'),
      ],
      depthStencilAttachment: useDepthStencilAttachment(depthTexture, 'load'),
      timestampWrites: profiler?.createScopeGpu(HairCombinePass.NAME),
    });

    const bindings = this.bindingsCache.getBindings(depthTexture.label, () =>
      this.createBindings(ctx, hairRasterizeResult, hairSegmentsPerTileBuffer)
    );
    renderPass.setBindGroup(0, bindings);
    renderPass.setPipeline(this.pipeline);
    cmdDrawFullscreenTriangle(renderPass);
    renderPass.end();
  }

  private createBindings = (
    { device, globalUniforms }: PassCtx,
    hairRasterizeResult: GPUBuffer,
    hairSegmentsPerTileBuffer: GPUBuffer
  ): GPUBindGroup => {
    const b = SHADER_PARAMS.bindings;

    return assignResourcesToBindings2(
      HairCombinePass,
      HairCombinePass.NAME,
      device,
      this.pipeline,
      [
        globalUniforms.createBindingDesc(b.renderUniforms),
        {
          binding: b.hairResult,
          resource: { buffer: hairRasterizeResult },
        },
        {
          binding: b.segmentsPerTileBuffer,
          resource: { buffer: hairSegmentsPerTileBuffer },
        },
      ]
    );
  };
}
