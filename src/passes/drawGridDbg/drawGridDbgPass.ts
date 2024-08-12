import { BindingsCache } from '../_shared/bindingsCache.ts';
import {
  labelShader,
  assignResourcesToBindings,
  labelPipeline,
} from '../_shared/shared.ts';
import {
  createDebugVolumePipeline,
  cmdDrawDbgVolumeQuad,
} from '../_shared/volumeDebug.ts';
import { PassCtx } from '../passCtx.ts';
import { SHADER_CODE, SHADER_PARAMS } from './drawGridDbgPass.wgsl.ts';

export class DrawGridDbgPass {
  public static NAME: string = 'DrawGridDbgPass';

  private readonly pipeline: GPURenderPipeline;
  private readonly bindingsCache = new BindingsCache();

  constructor(device: GPUDevice, outTextureFormat: GPUTextureFormat) {
    const shaderModule = device.createShaderModule({
      label: labelShader(DrawGridDbgPass),
      code: SHADER_CODE(),
    });
    this.pipeline = createDebugVolumePipeline(
      device,
      shaderModule,
      outTextureFormat,
      labelPipeline(DrawGridDbgPass)
    );
  }

  cmdDrawGridDbg(ctx: PassCtx) {
    const bindings = this.bindingsCache.getBindings('-', () =>
      this.createBindings(ctx)
    );

    cmdDrawDbgVolumeQuad(ctx, DrawGridDbgPass, this.pipeline, bindings);
  }

  private createBindings = (ctx: PassCtx): GPUBindGroup => {
    const { device, globalUniforms, physicsForcesGrid } = ctx;
    const b = SHADER_PARAMS.bindings;

    return assignResourcesToBindings(DrawGridDbgPass, device, this.pipeline, [
      globalUniforms.createBindingDesc(b.renderUniforms),
      physicsForcesGrid.bindDensityVelocityBuffer(b.densityVelocityBuffer),
      physicsForcesGrid.bindDensityGradAndWindBuffer(b.densityGradWindBuffer),
    ]);
  };
}
