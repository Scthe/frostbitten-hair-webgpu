import { BYTES_U32, CONFIG } from '../../constants.ts';
import { HairObject } from '../../scene/hair/hairObject.ts';
import { STATS } from '../../sys_web/stats.ts';
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
import { SHADER_CODE, SHADER_PARAMS } from './hairTilesPass.wgsl.ts';
import { createHairTileSegmentsBuffer } from './shared/hairTileSegmentsBuffer.ts';
import { createHairTilesResultBuffer } from './shared/hairTilesResultBuffer.ts';

export class HairTilesPass {
  public static NAME: string = HairTilesPass.name;

  private readonly pipeline: GPUComputePipeline;
  private readonly bindingsCache = new BindingsCache();

  /** result framebuffer as flat buffer */
  public hairTilesBuffer: GPUBuffer = undefined!; // see this.handleViewportResize()
  public hairTileSegmentsBuffer: GPUBuffer = undefined!; // see this.handleViewportResize()

  constructor(device: GPUDevice) {
    const shaderModule = device.createShaderModule({
      label: labelShader(HairTilesPass),
      code: SHADER_CODE(),
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
    const workgroupsX = getItemsPerThread(
      this.getRenderedStrandCount(hairObject),
      SHADER_PARAMS.workgroupSizeX
    );
    const workgroupsY = getItemsPerThread(
      hairObject.pointsPerStrand,
      SHADER_PARAMS.workgroupSizeY
    );
    // console.log(`${HairTilesPass.NAME}.dispatch(${workgroupsX}, ${workgroupsY}, 1)`); // prettier-ignore
    computePass.dispatchWorkgroups(workgroupsX, workgroupsY, 1);

    computePass.end();
  }

  private getRenderedStrandCount(hairObject: HairObject) {
    const pct = CONFIG.hairRender.lodRenderPercent;
    const { strandsCount, pointsPerStrand, segmentCount } = hairObject;
    let result = Math.ceil((strandsCount * pct) / 100.0);
    result = clamp(result, 0, strandsCount);

    STATS.update(
      'Rendered strands',
      formatPercentageNumber(result, strandsCount)
    );
    const segments = result * (pointsPerStrand - 1);
    STATS.update(
      'Rendered segments',
      formatPercentageNumber(segments, segmentCount)
    );
    return result;
  }

  private createBindings = (
    { device, globalUniforms, depthTexture }: PassCtx,
    object: HairObject
  ): GPUBindGroup => {
    const b = SHADER_PARAMS.bindings;
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
