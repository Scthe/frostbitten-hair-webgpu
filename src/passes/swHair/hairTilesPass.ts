import { BYTES_U32 } from '../../constants.ts';
import { HairObject } from '../../scene/hair/hairObject.ts';
import { Dimensions } from '../../utils/index.ts';
import {
  assertIsGPUTextureView,
  bindBuffer,
  cmdClearWholeBuffer,
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
import { createHairSegmentCountPerTileBuffer } from './shared/segmentCountPerTileBuffer.ts';

export class HairTilesPass {
  public static NAME: string = 'HairTilesPass';

  private readonly pipeline: GPUComputePipeline;
  private readonly bindingsCache = new BindingsCache();

  /** result framebuffer as flat buffer */
  public hairTilesBuffer: GPUBuffer = undefined!; // see this.handleViewportResize()
  public hairTileSegmentsBuffer: GPUBuffer = undefined!; // see this.handleViewportResize()
  public segmentCountPerTileBuffer: GPUBuffer = undefined!; // see this.handleViewportResize()

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

  cmdClearBeforeRender(ctx: PassCtx) {
    cmdClearWholeBuffer(ctx.cmdBuf, this.hairTilesBuffer);
    cmdClearWholeBuffer(ctx.cmdBuf, this.segmentCountPerTileBuffer);
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
    if (this.segmentCountPerTileBuffer) {
      this.segmentCountPerTileBuffer.destroy();
    }

    this.hairTilesBuffer = createHairTilesResultBuffer(device, viewportSize);
    this.hairTileSegmentsBuffer = createHairTileSegmentsBuffer(
      device,
      viewportSize
    );
    this.segmentCountPerTileBuffer = createHairSegmentCountPerTileBuffer(
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

    this.cmdDispatchPerSegment(computePass, hairObject);

    computePass.end();

    // stats
    hairObject.reportRenderedStrandCount();
  }

  private cmdDispatchPerSegment(
    computePass: GPUComputePassEncoder,
    hairObject: HairObject
  ) {
    const workgroupsX = getItemsPerThread(
      hairObject.getRenderedStrandCount(),
      SHADER_PARAMS.workgroupSizeX
    );
    const workgroupsY = getItemsPerThread(
      hairObject.pointsPerStrand,
      SHADER_PARAMS.workgroupSizeY
    );
    // console.log(`${HairTilesPass.NAME}.dispatch(${workgroupsX}, ${workgroupsY}, 1)`); // prettier-ignore
    computePass.dispatchWorkgroups(workgroupsX, workgroupsY, 1);
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
        bindBuffer(b.segmentCountPerTileBuffer, this.segmentCountPerTileBuffer),
        object.bindHairData(b.hairData),
        object.bindPointsPositions(b.hairPositions),
        object.bindTangents(b.hairTangents),
        { binding: b.depthTexture, resource: depthTexture },
      ]
    );
  };
}
