import { BYTES_U32 } from '../../constants.ts';
import { Dimensions } from '../../utils/index.ts';
import { bindBuffer, getItemsPerThread } from '../../utils/webgpu.ts';
import { BindingsCache } from '../_shared/bindingsCache.ts';
import {
  labelShader,
  labelPipeline,
  assignResourcesToBindings,
} from '../_shared/shared.ts';
import { PassCtx } from '../passCtx.ts';
import { SHADER_CODE, SHADER_PARAMS } from './hairTileSortPass.wgsl.ts';
import { getTileCount } from './shared/utils.ts';
import { createHairTileListBuffer } from './shared/tileListBuffer.ts';

export class HairTileSortPass {
  public static NAME: string = 'HairTileSortPass';

  private readonly pipeline: GPUComputePipeline;
  private readonly bindingsCache = new BindingsCache();

  public tileListBuffer: GPUBuffer = undefined!; // see this.handleViewportResize()

  constructor(device: GPUDevice) {
    const shaderModule = device.createShaderModule({
      label: labelShader(HairTileSortPass),
      code: SHADER_CODE(),
    });
    this.pipeline = device.createComputePipeline({
      label: labelPipeline(HairTileSortPass),
      layout: 'auto',
      compute: {
        module: shaderModule,
        entryPoint: 'main',
      },
    });
  }

  cmdClearBeforeRender(ctx: PassCtx) {
    if (this.tileListBuffer) {
      ctx.cmdBuf.clearBuffer(this.tileListBuffer, 0, BYTES_U32);
    }
  }

  onViewportResize = (device: GPUDevice, viewportSize: Dimensions) => {
    this.bindingsCache.clear();

    if (this.tileListBuffer) {
      this.tileListBuffer.destroy();
    }

    this.tileListBuffer = createHairTileListBuffer(device, viewportSize);
  };

  cmdSortHairTiles(ctx: PassCtx) {
    const { cmdBuf, profiler } = ctx;

    const computePass = cmdBuf.beginComputePass({
      label: HairTileSortPass.NAME,
      timestampWrites: profiler?.createScopeGpu(HairTileSortPass.NAME),
    });

    const bindings = this.bindingsCache.getBindings('-', () =>
      this.createBindings(ctx)
    );
    computePass.setPipeline(this.pipeline);
    computePass.setBindGroup(0, bindings);

    // dispatch
    const tileCount = getTileCount(ctx.viewport);
    const workgroupsX = getItemsPerThread(
      tileCount.width * tileCount.height,
      SHADER_PARAMS.workgroupSizeX
    );
    computePass.dispatchWorkgroups(workgroupsX, 1, 1);

    computePass.end();
  }

  private createBindings = (ctx: PassCtx): GPUBindGroup => {
    const {
      device,
      globalUniforms,
      hairTileListBuffer,
      hairSegmentCountPerTileBuffer,
    } = ctx;
    const b = SHADER_PARAMS.bindings;

    return assignResourcesToBindings(HairTileSortPass, device, this.pipeline, [
      globalUniforms.createBindingDesc(b.renderUniforms),
      bindBuffer(b.segmentCountPerTile, hairSegmentCountPerTileBuffer),
      bindBuffer(b.tileList, hairTileListBuffer),
    ]);
  };
}
