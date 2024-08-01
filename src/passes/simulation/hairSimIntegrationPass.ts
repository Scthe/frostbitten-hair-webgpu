import { HairObject } from '../../scene/hair/hairObject.ts';
import { getItemsPerThread } from '../../utils/webgpu.ts';
import { BindingsCache } from '../_shared/bindingsCache.ts';
import {
  labelShader,
  labelPipeline,
  assignResourcesToBindings2,
} from '../_shared/shared.ts';
import { PassCtx } from '../passCtx.ts';
import { SHADER_CODE, SHADER_PARAMS } from './hairSimIntegrationPass.wgsl.ts';

export class HairSimIntegrationPass {
  public static NAME: string = HairSimIntegrationPass.name;

  private readonly pipeline: GPUComputePipeline;
  private readonly bindingsCache = new BindingsCache();

  constructor(device: GPUDevice) {
    const shaderModule = device.createShaderModule({
      label: labelShader(HairSimIntegrationPass),
      code: SHADER_CODE(),
    });
    this.pipeline = device.createComputePipeline({
      label: labelPipeline(HairSimIntegrationPass),
      layout: 'auto',
      compute: {
        module: shaderModule,
        entryPoint: 'main',
      },
    });
  }

  cmdSimulateHairPositions(ctx: PassCtx, hairObject: HairObject) {
    const { cmdBuf, profiler } = ctx;

    const computePass = cmdBuf.beginComputePass({
      label: HairSimIntegrationPass.NAME,
      timestampWrites: profiler?.createScopeGpu(HairSimIntegrationPass.NAME),
    });

    const bindings = this.bindingsCache.getBindings(
      `${hairObject.name}-${hairObject.currentPositionsBufferIdx}`,
      () => this.createBindings(ctx, hairObject)
    );
    computePass.setPipeline(this.pipeline);
    computePass.setBindGroup(0, bindings);

    // dispatch
    const workgroupsX = getItemsPerThread(
      hairObject.strandsCount,
      SHADER_PARAMS.workgroupSizeX
    );
    // console.log(`${HairSimIntegrationPass.NAME}.dispatch(${workgroupsX}, 1, 1)`);
    computePass.dispatchWorkgroups(workgroupsX, 1, 1);

    computePass.end();

    // every pass after that will use updated values
    hairObject.swapPositionBuffersAfterSimIntegration();
  }

  private createBindings = (
    ctx: PassCtx,
    hairObject: HairObject
  ): GPUBindGroup => {
    const { device, simulationUniforms } = ctx;
    const b = SHADER_PARAMS.bindings;

    return assignResourcesToBindings2(
      HairSimIntegrationPass,
      `${hairObject.name}-${hairObject.currentPositionsBufferIdx}`,
      device,
      this.pipeline,
      [
        simulationUniforms.createBindingDesc(b.simulationUniforms),
        hairObject.bindHairData(b.hairData),
        hairObject.bindInitialSegmentLengths(b.segmentLengths),
        hairObject.bindPointsPositions_PREV(b.positionsPrev),
        hairObject.bindPointsPositions(b.positionsNow),
      ]
    );
  };
}
