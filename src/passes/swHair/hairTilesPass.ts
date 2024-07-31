import { BYTES_U32, CONFIG } from '../../constants.ts';
import { HairObject } from '../../scene/hair/hairObject.ts';
import { STATS } from '../../stats.ts';
import { clamp } from '../../utils/index.ts';
import { Dimensions } from '../../utils/index.ts';
import { formatPercentageNumber } from '../../utils/string.ts';
import {
  assertIsGPUTextureView,
  bindBuffer,
  getItemsPerThread,
} from '../../utils/webgpu.ts';
import { BindingsCache } from '../_shared/bindingsCache.ts';
import {
  labelShader,
  labelPipeline,
  assignResourcesToBindings2,
} from '../_shared/shared.ts';
import { PassCtx } from '../passCtx.ts';
import * as SHADER_PER_SEGMENT from './hairTilesPass.perSegment.wgsl.ts';
import * as SHADER_PER_STRAND from './hairTilesPass.perStrand.wgsl.ts';
import { createHairTileSegmentsBuffer } from './shared/hairTileSegmentsBuffer.ts';
import { createHairTilesResultBuffer } from './shared/hairTilesResultBuffer.ts';

const DISPATCH_TYPE = CONFIG.hairRender.tileShaderDispatch;

export class HairTilesPass {
  public static NAME: string = HairTilesPass.name;

  private readonly pipeline: GPUComputePipeline;
  private readonly bindingsCache = new BindingsCache();

  /** result framebuffer as flat buffer */
  public hairTilesBuffer: GPUBuffer = undefined!; // see this.handleViewportResize()
  public hairTileSegmentsBuffer: GPUBuffer = undefined!; // see this.handleViewportResize()

  constructor(device: GPUDevice) {
    const shaderCode =
      DISPATCH_TYPE === 'perSegment'
        ? SHADER_PER_SEGMENT.SHADER_CODE()
        : SHADER_PER_STRAND.SHADER_CODE();

    const shaderModule = device.createShaderModule({
      label: labelShader(HairTilesPass),
      code: shaderCode,
    });
    this.pipeline = device.createComputePipeline({
      label: labelPipeline(HairTilesPass),
      layout: 'auto',
      compute: {
        module: shaderModule,
        entryPoint: 'main',
      },
    });
  }

  /** Clears to 0. We cannot select a number */
  clearFramebuffer(ctx: PassCtx) {
    ctx.cmdBuf.clearBuffer(this.hairTilesBuffer, 0, this.hairTilesBuffer.size);
    ctx.cmdBuf.clearBuffer(this.hairTileSegmentsBuffer, 0, BYTES_U32);
  }

  onViewportResize = (device: GPUDevice, viewportSize: Dimensions) => {
    this.bindingsCache.clear();

    if (this.hairTilesBuffer) {
      this.hairTilesBuffer.destroy();
    }
    if (this.hairTileSegmentsBuffer) {
      this.hairTileSegmentsBuffer.destroy();
    }

    this.hairTilesBuffer = createHairTilesResultBuffer(device, viewportSize);
    this.hairTileSegmentsBuffer = createHairTileSegmentsBuffer(
      device,
      viewportSize
    );
  };

  cmdDrawHairToTiles(ctx: PassCtx, hairObject: HairObject) {
    const { cmdBuf, profiler } = ctx;

    const computePass = cmdBuf.beginComputePass({
      label: HairTilesPass.NAME,
      timestampWrites: profiler?.createScopeGpu(HairTilesPass.NAME),
    });

    const bindings = this.bindingsCache.getBindings(hairObject.name, () =>
      this.createBindings(ctx, hairObject)
    );
    computePass.setPipeline(this.pipeline);
    computePass.setBindGroup(0, bindings);

    // dispatch
    if (DISPATCH_TYPE == 'perSegment') {
      this.cmdDispatchPerSegment(computePass, hairObject);
    } else {
      this.cmdDispatchPerStrand(computePass, hairObject);
    }

    computePass.end();
  }

  private cmdDispatchPerSegment(
    computePass: GPUComputePassEncoder,
    hairObject: HairObject
  ) {
    const params = SHADER_PER_SEGMENT.SHADER_PARAMS;

    const workgroupsX = getItemsPerThread(
      HairTilesPass.getRenderedStrandCount(hairObject),
      params.workgroupSizeX
    );
    const workgroupsY = getItemsPerThread(
      hairObject.pointsPerStrand,
      params.workgroupSizeY
    );
    // console.log(`${HairTilesPass.NAME}.dispatch(${workgroupsX}, ${workgroupsY}, 1)`); // prettier-ignore
    computePass.dispatchWorkgroups(workgroupsX, workgroupsY, 1);
  }

  private cmdDispatchPerStrand(
    computePass: GPUComputePassEncoder,
    hairObject: HairObject
  ) {
    const params = SHADER_PER_STRAND.SHADER_PARAMS;

    const workgroupsX = getItemsPerThread(
      HairTilesPass.getRenderedStrandCount(hairObject),
      params.workgroupSizeX
    );

    // console.log(`${HairTilesPass.NAME}.dispatch(${workgroupsX}, 1, 1)`); // prettier-ignore
    computePass.dispatchWorkgroups(workgroupsX, 1, 1);
  }

  public static getRenderedStrandCount(hairObject: HairObject) {
    const pct = clamp(CONFIG.hairRender.lodRenderPercent, 0, 100);
    const { strandsCount, pointsPerStrand, segmentCount } = hairObject;
    let result = Math.ceil((strandsCount * pct) / 100.0);
    result = clamp(result, 0, strandsCount);

    STATS.update(
      'Rendered strands',
      formatPercentageNumber(result, strandsCount, 0)
    );
    const segments = result * (pointsPerStrand - 1);
    STATS.update(
      'Rendered segments',
      formatPercentageNumber(segments, segmentCount, 0)
    );
    return result;
  }

  private createBindings = (
    { device, globalUniforms, depthTexture }: PassCtx,
    object: HairObject
  ): GPUBindGroup => {
    const b =
      DISPATCH_TYPE == 'perSegment'
        ? SHADER_PER_SEGMENT.SHADER_PARAMS.bindings
        : SHADER_PER_STRAND.SHADER_PARAMS.bindings;
    assertIsGPUTextureView(depthTexture);

    return assignResourcesToBindings2(
      HairTilesPass,
      object.name,
      device,
      this.pipeline,
      [
        globalUniforms.createBindingDesc(b.renderUniforms),
        bindBuffer(b.tilesBuffer, this.hairTilesBuffer),
        bindBuffer(b.tileSegmentsBuffer, this.hairTileSegmentsBuffer),
        object.bindHairData(b.hairData),
        object.bindPointsPositions(b.hairPositions),
        object.bindTangents(b.hairTangents),
        { binding: b.depthTexture, resource: depthTexture },
      ]
    );
  };
}
