import { HairObject } from '../../scene/hair/hairObject.ts';
import { getItemsPerThread } from '../../utils/webgpu.ts';
import { BindingsCache } from '../_shared/bindingsCache.ts';
import {
  labelShader,
  labelPipeline,
  assignResourcesToBindings2,
} from '../_shared/shared.ts';
import { PassCtx } from '../passCtx.ts';
import { SHADER_CODE, SHADER_PARAMS } from './gridPostSimPass.wgsl.ts';

export class GridPostSimPass {
  public static NAME: string = GridPostSimPass.name;

  private readonly pipeline: GPUComputePipeline;
  private readonly bindingsCache = new BindingsCache();

  constructor(device: GPUDevice) {
    const shaderModule = device.createShaderModule({
      label: labelShader(GridPostSimPass),
      code: SHADER_CODE(),
    });
    this.pipeline = device.createComputePipeline({
      label: labelPipeline(GridPostSimPass),
      layout: 'auto',
      compute: {
        module: shaderModule,
        entryPoint: 'main',
      },
    });
  }

  cmdUpdateGridsAfterSim(ctx: PassCtx, hairObject: HairObject) {
    const { cmdBuf, profiler, densityVelocityGrid } = ctx;

    densityVelocityGrid.clearDensityVelocityBuffer(cmdBuf);

    const computePass = cmdBuf.beginComputePass({
      label: GridPostSimPass.NAME,
      timestampWrites: profiler?.createScopeGpu(GridPostSimPass.NAME),
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
    // console.log(`${GridPostSimPass.NAME}.dispatch(${workgroupsX}, 1, 1)`);
    computePass.dispatchWorkgroups(workgroupsX, 1, 1);

    computePass.end();
  }

  private createBindings = (
    ctx: PassCtx,
    hairObject: HairObject
  ): GPUBindGroup => {
    const { device, simulationUniforms, densityVelocityGrid } = ctx;
    const b = SHADER_PARAMS.bindings;

    return assignResourcesToBindings2(
      GridPostSimPass,
      `${hairObject.name}-${hairObject.currentPositionsBufferIdx}`,
      device,
      this.pipeline,
      [
        simulationUniforms.createBindingDesc(b.simulationUniforms),
        hairObject.bindHairData(b.hairData),
        hairObject.bindPointsPositions_PREV(b.positionsPrev),
        hairObject.bindPointsPositions(b.positionsNow),
        densityVelocityGrid.bindDensityVelocityBuffer(b.gridBuffer),
      ]
    );
  };
}
