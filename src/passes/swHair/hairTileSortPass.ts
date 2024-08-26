import { BYTES_U32, CONFIG } from '../../constants.ts';
import { Dimensions } from '../../utils/index.ts';
import {
  bindBuffer,
  cmdClearWholeBuffer,
  getItemsPerThread,
} from '../../utils/webgpu.ts';
import { BindingsCache } from '../_shared/bindingsCache.ts';
import { createComputePipeline, createLabel } from '../_shared/shared.ts';
import { PassCtx } from '../passCtx.ts';
import * as SHADER_COUNT_TILES from './hairTileSortPass.countTiles.wgsl.ts';
import * as SHADER_SORT from './hairTileSortPass.sort.wgsl.ts';
import { getTileCount } from './shared/utils.ts';
import { createHairTileListBuffer } from './shared/tileListBuffer.ts';
import { assignResourcesToBindings2 } from '../_shared/shared.ts';

const NAME_COUNT_TILES = 'count-tiles';
const NAME_SORT = 'sort';

/**
 * Usual approximate bucket sort (split tiles into buckets).
 *
 * Pass 1: Count tiles for each bucket.
 * Pass 2. Write tiles to array based on their bucket. E.g.
 *         Move stuff from bucket 0 to the start of the array.
 *         Then all stuff from bucket 1, etc.
 *
 * This pass is only needed for optimization. See below for older version without:
 * - https://github.com/Scthe/frostbitten-hair-webgpu/tree/501f01969b4bc65cb7df3b901c1ced4e2da0c84b
 */
export class HairTileSortPass {
  public static NAME: string = 'HairTileSortPass';

  private readonly pipelineCountPerBucket: GPUComputePipeline;
  private readonly pipelineSort: GPUComputePipeline;
  private readonly bindingsCache = new BindingsCache();

  public tileListBuffer: GPUBuffer = undefined!; // see this.handleViewportResize()
  public bucketsDataBuffer: GPUBuffer;

  constructor(device: GPUDevice) {
    const extraUsage = CONFIG.isTest ? GPUBufferUsage.COPY_SRC : 0;
    this.bucketsDataBuffer = device.createBuffer({
      label: createLabel(HairTileSortPass, 'sortBuckets'),
      size: CONFIG.hairRender.sortBuckets * 2 * BYTES_U32,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | extraUsage,
    });

    this.pipelineCountPerBucket = createComputePipeline(
      device,
      HairTileSortPass,
      SHADER_COUNT_TILES.SHADER_CODE(),
      NAME_COUNT_TILES
    );
    this.pipelineSort = createComputePipeline(
      device,
      HairTileSortPass,
      SHADER_SORT.SHADER_CODE(),
      NAME_SORT
    );
  }

  cmdClearBeforeRender(ctx: PassCtx) {
    if (this.tileListBuffer) {
      ctx.cmdBuf.clearBuffer(this.tileListBuffer, 0, BYTES_U32);
    }
    cmdClearWholeBuffer(ctx.cmdBuf, this.bucketsDataBuffer);
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

    this.cmdCountTilesPerBucket(ctx, computePass);
    this.cmdSort(ctx, computePass);

    computePass.end();
  }

  private getDispatchDims_EachTile(ctx: PassCtx, workgroupSize: number) {
    const tileCount = getTileCount(ctx.viewport);
    return getItemsPerThread(tileCount.width * tileCount.height, workgroupSize);
  }

  /////////////////////////
  /// Count Tiles Per Bucket

  private cmdCountTilesPerBucket(
    ctx: PassCtx,
    computePass: GPUComputePassEncoder
  ) {
    const bindings = this.bindingsCache.getBindings(NAME_COUNT_TILES, () =>
      this.createBindings_countTilesPerBucket(ctx)
    );
    computePass.setPipeline(this.pipelineCountPerBucket);
    computePass.setBindGroup(0, bindings);

    // dispatch
    const workgroupsX = this.getDispatchDims_EachTile(
      ctx,
      SHADER_COUNT_TILES.SHADER_PARAMS.workgroupSizeX
    );
    computePass.dispatchWorkgroups(workgroupsX, 1, 1);
  }

  private createBindings_countTilesPerBucket = (ctx: PassCtx): GPUBindGroup => {
    const { device, globalUniforms, hairSegmentCountPerTileBuffer } = ctx;
    const b = SHADER_COUNT_TILES.SHADER_PARAMS.bindings;

    return assignResourcesToBindings2(
      HairTileSortPass,
      NAME_COUNT_TILES,
      device,
      this.pipelineCountPerBucket,
      [
        globalUniforms.createBindingDesc(b.renderUniforms),
        bindBuffer(b.segmentCountPerTile, hairSegmentCountPerTileBuffer),
        bindBuffer(b.sortBuckets, this.bucketsDataBuffer),
      ]
    );
  };

  /////////////////////////
  /// Sort

  private cmdSort(ctx: PassCtx, computePass: GPUComputePassEncoder) {
    const bindings = this.bindingsCache.getBindings(NAME_SORT, () =>
      this.createBindings_Sort(ctx)
    );
    computePass.setPipeline(this.pipelineSort);
    computePass.setBindGroup(0, bindings);

    // dispatch
    const workgroupsX = this.getDispatchDims_EachTile(
      ctx,
      SHADER_SORT.SHADER_PARAMS.workgroupSizeX
    );
    computePass.dispatchWorkgroups(workgroupsX, 1, 1);
  }

  private createBindings_Sort = (ctx: PassCtx): GPUBindGroup => {
    const {
      device,
      globalUniforms,
      hairSegmentCountPerTileBuffer,
      hairTileListBuffer,
    } = ctx;
    const b = SHADER_SORT.SHADER_PARAMS.bindings;

    return assignResourcesToBindings2(
      HairTileSortPass,
      NAME_SORT,
      device,
      this.pipelineSort,
      [
        globalUniforms.createBindingDesc(b.renderUniforms),
        bindBuffer(b.segmentCountPerTile, hairSegmentCountPerTileBuffer),
        bindBuffer(b.tileList, hairTileListBuffer),
        bindBuffer(b.sortBuckets, this.bucketsDataBuffer),
      ]
    );
  };
}
