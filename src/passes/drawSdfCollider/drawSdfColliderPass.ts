import { SDFCollider } from '../../scene/sdfCollider/sdfCollider.ts';
import { BindingsCache } from '../_shared/bindingsCache.ts';
import {
  labelShader,
  labelPipeline,
  assignResourcesToBindings,
} from '../_shared/shared.ts';
import {
  createDebugVolumePipeline,
  cmdDrawDbgVolumeQuad,
} from '../_shared/volumeDebug.ts';
import { PassCtx } from '../passCtx.ts';
import { SHADER_CODE, SHADER_PARAMS } from './drawSdfColliderPass.wgsl.ts';

export class DrawSdfColliderPass {
  public static NAME: string = 'DrawSdfColliderPass';

  private readonly pipeline: GPURenderPipeline;
  private readonly bindingsCache = new BindingsCache();

  constructor(device: GPUDevice, outTextureFormat: GPUTextureFormat) {
    const shaderModule = device.createShaderModule({
      label: labelShader(DrawSdfColliderPass),
      code: SHADER_CODE(),
    });
    this.pipeline = createDebugVolumePipeline(
      device,
      shaderModule,
      outTextureFormat,
      labelPipeline(DrawSdfColliderPass)
    );
  }

  cmdDrawSdf(ctx: PassCtx) {
    const sdf = ctx.scene.sdfCollider;
    const bindings = this.bindingsCache.getBindings(sdf.name, () =>
      this.createBindings(ctx, sdf)
    );

    cmdDrawDbgVolumeQuad(ctx, DrawSdfColliderPass, this.pipeline, bindings);
  }

  private createBindings = (ctx: PassCtx, sdf: SDFCollider): GPUBindGroup => {
    const { device, globalUniforms } = ctx;
    const b = SHADER_PARAMS.bindings;

    return assignResourcesToBindings(
      DrawSdfColliderPass,
      device,
      this.pipeline,
      [
        globalUniforms.createBindingDesc(b.renderUniforms),
        sdf.bindTexture(b.sdfTexture),
        sdf.bindSampler(b.sdfSampler),
      ]
    );
  };
}
