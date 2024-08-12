import { CONFIG } from '../../constants.ts';
import { HairObject } from '../../scene/hair/hairObject.ts';
import {
  assertIsGPUTextureView,
  getItemsPerThread,
} from '../../utils/webgpu.ts';
import { BindingsCache } from '../_shared/bindingsCache.ts';
import {
  labelShader,
  labelPipeline,
  assignResourcesToBindings2,
} from '../_shared/shared.ts';
import { PassCtx } from '../passCtx.ts';
import { SHADER_CODE, SHADER_PARAMS } from './hairShadingPass.wgsl.ts';

export class HairShadingPass {
  public static NAME: string = 'HairShadingPass';

  private readonly pipeline: GPUComputePipeline;
  private readonly bindingsCache = new BindingsCache();

  constructor(device: GPUDevice) {
    const shaderModule = device.createShaderModule({
      label: labelShader(HairShadingPass),
      code: SHADER_CODE(),
    });
    this.pipeline = device.createComputePipeline({
      label: labelPipeline(HairShadingPass),
      layout: 'auto',
      compute: {
        module: shaderModule,
        entryPoint: 'main',
      },
    });
  }

  onViewportResize = () => {
    this.bindingsCache.clear();
  };

  cmdComputeShadingPoints(ctx: PassCtx, hairObject: HairObject) {
    const { cmdBuf, profiler } = ctx;

    const computePass = cmdBuf.beginComputePass({
      label: HairShadingPass.NAME,
      timestampWrites: profiler?.createScopeGpu(HairShadingPass.NAME),
    });

    const bindings = this.bindingsCache.getBindings(hairObject.name, () =>
      this.createBindings(ctx, hairObject)
    );
    computePass.setPipeline(this.pipeline);
    computePass.setBindGroup(0, bindings);

    // dispatch
    const workgroupsX = getItemsPerThread(
      hairObject.strandsCount,
      SHADER_PARAMS.workgroupSizeX
    );
    const workgroupsY = getItemsPerThread(
      CONFIG.hairRender.shadingPoints,
      SHADER_PARAMS.workgroupSizeY
    );
    // console.log(`${HairShadingPass.NAME}.dispatch(${workgroupsX}, ${workgroupsY}, 1)`); // prettier-ignore
    computePass.dispatchWorkgroups(workgroupsX, workgroupsY, 1);

    computePass.end();
  }

  private createBindings = (ctx: PassCtx, object: HairObject): GPUBindGroup => {
    const {
      device,
      globalUniforms,
      shadowDepthTexture,
      shadowMapSampler,
      depthTexture,
      aoTexture,
    } = ctx;
    const b = SHADER_PARAMS.bindings;
    assertIsGPUTextureView(depthTexture);

    return assignResourcesToBindings2(
      HairShadingPass,
      object.name,
      device,
      this.pipeline,
      [
        globalUniforms.createBindingDesc(b.renderUniforms),
        object.bindHairData(b.hairData),
        object.bindPointsPositions(b.hairPositions),
        object.bindTangents(b.hairTangents),
        object.bindShading(b.hairShading),
        { binding: b.shadowMapTexture, resource: shadowDepthTexture },
        { binding: b.shadowMapSampler, resource: shadowMapSampler },
        { binding: b.aoTexture, resource: aoTexture },
        { binding: b.depthTexture, resource: depthTexture },
      ]
    );
  };
}
