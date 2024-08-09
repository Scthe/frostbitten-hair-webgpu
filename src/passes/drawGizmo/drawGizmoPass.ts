import { CONFIG } from '../../constants.ts';
import { BindingsCache } from '../_shared/bindingsCache.ts';
import {
  labelShader,
  labelPipeline,
  useColorAttachment,
  assignResourcesToBindings,
} from '../_shared/shared.ts';
import { PassCtx } from '../passCtx.ts';
import { SHADER_CODE, SHADER_PARAMS } from './drawGizmoPass.wgsl.ts';

export class DrawGizmoPass {
  public static NAME: string = DrawGizmoPass.name;

  private readonly pipeline: GPURenderPipeline;
  private readonly bindingsCache = new BindingsCache();

  constructor(device: GPUDevice, outTextureFormat: GPUTextureFormat) {
    const shaderModule = device.createShaderModule({
      label: labelShader(DrawGizmoPass),
      code: SHADER_CODE(),
    });

    this.pipeline = device.createRenderPipeline({
      label: labelPipeline(DrawGizmoPass),
      layout: 'auto',
      vertex: {
        module: shaderModule,
        entryPoint: 'main_vs',
      },
      fragment: {
        module: shaderModule,
        entryPoint: 'main_fs',
        targets: [{ format: outTextureFormat }],
      },
      primitive: {
        cullMode: 'none',
        topology: 'triangle-list',
      },
    });
  }

  onViewportResize = () => {
    this.bindingsCache.clear();
  };

  cmdDrawGizmo(ctx: PassCtx) {
    const { cmdBuf, profiler, hdrRenderTexture } = ctx;

    const renderPass = cmdBuf.beginRenderPass({
      label: DrawGizmoPass.NAME,
      colorAttachments: [
        useColorAttachment(hdrRenderTexture, CONFIG.clearColor, 'load'),
      ],
      timestampWrites: profiler?.createScopeGpu(DrawGizmoPass.NAME),
    });

    // set render pass data
    const bindings = this.bindingsCache.getBindings('-', () =>
      this.createBindings(ctx)
    );
    renderPass.setPipeline(this.pipeline);
    renderPass.setBindGroup(0, bindings);
    renderPass.draw(
      6, // vertex count
      3, // instance count
      0, // first index
      0 // first instance
    );

    // fin
    renderPass.end();
  }

  private createBindings = (ctx: PassCtx): GPUBindGroup => {
    const { device, globalUniforms } = ctx;
    const b = SHADER_PARAMS.bindings;

    return assignResourcesToBindings(DrawGizmoPass, device, this.pipeline, [
      globalUniforms.createBindingDesc(b.renderUniforms),
    ]);
  };
}
