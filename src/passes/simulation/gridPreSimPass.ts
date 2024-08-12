import { CONFIG } from '../../constants.ts';
import { HairObject } from '../../scene/hair/hairObject.ts';
import { getItemsPerThread } from '../../utils/webgpu.ts';
import { BindingsCache } from '../_shared/bindingsCache.ts';
import {
  labelShader,
  labelPipeline,
  assignResourcesToBindings2,
} from '../_shared/shared.ts';
import { PassCtx } from '../passCtx.ts';
import { SHADER_CODE, SHADER_PARAMS } from './gridPreSimPass.wgsl.ts';

export class GridPreSimPass {
  public static NAME: string = 'GridPreSimPass';

  private readonly pipeline: GPUComputePipeline;
  private readonly bindingsCache = new BindingsCache();

  constructor(device: GPUDevice) {
    const shaderModule = device.createShaderModule({
      label: labelShader(GridPreSimPass),
      code: SHADER_CODE(),
    });
    this.pipeline = device.createComputePipeline({
      label: labelPipeline(GridPreSimPass),
      layout: 'auto',
      compute: {
        module: shaderModule,
        entryPoint: 'main',
      },
    });
  }

  cmdUpdateGridsBeforeSim(ctx: PassCtx, hairObject: HairObject) {
    const { cmdBuf, profiler, physicsForcesGrid } = ctx;

    physicsForcesGrid.clearDensityGradAndWindBuffer(cmdBuf);

    const computePass = cmdBuf.beginComputePass({
      label: GridPreSimPass.NAME,
      timestampWrites: profiler?.createScopeGpu(GridPreSimPass.NAME),
    });

    const bindings = this.bindingsCache.getBindings(
      `${hairObject.name}-${hairObject.currentPositionsBufferIdx}`,
      () => this.createBindings(ctx, hairObject)
    );
    computePass.setPipeline(this.pipeline);
    computePass.setBindGroup(0, bindings);

    // dispatch
    const gridDims = CONFIG.hairSimulation.physicsForcesGrid.dims;
    const threadsTotal = gridDims * gridDims * gridDims;
    const workgroupsX = getItemsPerThread(
      threadsTotal,
      SHADER_PARAMS.workgroupSizeX
    );
    // console.log(`${GridPreSimPass.NAME}.dispatch(${workgroupsX}, 1, 1)`);
    computePass.dispatchWorkgroups(workgroupsX, 1, 1);

    computePass.end();
  }

  private createBindings = (
    ctx: PassCtx,
    hairObject: HairObject
  ): GPUBindGroup => {
    const { device, simulationUniforms, physicsForcesGrid, scene } = ctx;
    const b = SHADER_PARAMS.bindings;
    const sdf = scene.sdfCollider;

    return assignResourcesToBindings2(
      GridPreSimPass,
      `${hairObject.name}-${hairObject.currentPositionsBufferIdx}`,
      device,
      this.pipeline,
      [
        simulationUniforms.createBindingDesc(b.simulationUniforms),
        physicsForcesGrid.bindDensityVelocityBuffer(b.densityVelocityBuffer),
        physicsForcesGrid.bindDensityGradAndWindBuffer(b.densityGradWindBuffer),
        sdf.bindTexture(b.sdfTexture),
        sdf.bindSampler(b.sdfSampler),
      ]
    );
  };
}
