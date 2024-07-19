import { BYTES_U32 } from '../../constants.ts';
import { HairObject } from '../../scene/hair/hairObject.ts';
import { Dimensions } from '../../utils/index.ts';
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
import { SHADER_CODE, SHADER_PARAMS } from './hairTilesPass.wgsl.ts';
import { createHairSegmentsPerTileBuffer } from './shared/hairSegmentsPerTileBuffer.ts';
import { createHairTilesResultBuffer } from './shared/hairTilesResultBuffer.ts';

export class HairTilesPass {
  public static NAME: string = HairTilesPass.name;

  private readonly pipeline: GPUComputePipeline;
  private readonly bindingsCache = new BindingsCache();

  /** result framebuffer as flat buffer */
  public resultBuffer: GPUBuffer = undefined!; // see this.handleViewportResize()
  public hairSegmentsPerTileBuffer: GPUBuffer = undefined!; // see this.handleViewportResize()

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
    ctx.cmdBuf.clearBuffer(this.resultBuffer);
    ctx.cmdBuf.clearBuffer(this.hairSegmentsPerTileBuffer, 0, BYTES_U32);
  }

  onViewportResize = (device: GPUDevice, viewportSize: Dimensions) => {
    this.bindingsCache.clear();

    if (this.resultBuffer) {
      this.resultBuffer.destroy();
    }
    if (this.hairSegmentsPerTileBuffer) {
      this.hairSegmentsPerTileBuffer.destroy();
    }

    this.resultBuffer = createHairTilesResultBuffer(device, viewportSize);
    this.hairSegmentsPerTileBuffer = createHairSegmentsPerTileBuffer(
      device,
      viewportSize
    );
  };

  cmdDrawHairToTiles(ctx: PassCtx, hairObject: HairObject) {
    const { cmdBuf, profiler } = ctx;

    // no need to clear previous values, as we override every pixel
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
      hairObject.strandsCount,
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
        { binding: b.resultBuffer, resource: { buffer: this.resultBuffer } },
        {
          binding: b.segmentsPerTileBuffer,
          resource: { buffer: this.hairSegmentsPerTileBuffer },
        },
        object.bindHairData(b.hairData),
        object.bindPointsPositions(b.hairPositions),
        object.bindTangents(b.hairTangents),
        { binding: b.depthTexture, resource: depthTexture },
      ]
    );
  };
}
