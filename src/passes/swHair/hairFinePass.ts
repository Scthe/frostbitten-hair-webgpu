import { CONFIG } from '../../constants.ts';
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
import { SHADER_CODE, SHADER_PARAMS } from './hairFinePass.wgsl.ts';
import { createHairRasterizerResultsBuffer } from './shared/hairRasterizerResultBuffer.ts';
import { createHairSlicesHeadsBuffer } from './shared/hairSliceHeadsBuffer.ts';
import { createHairSlicesDataBuffer } from './shared/hairSlicesDataBuffer.ts';

export class HairFinePass {
  public static NAME: string = 'HairFinePass';

  private readonly pipeline: GPUComputePipeline;
  private readonly bindingsCache = new BindingsCache();

  public hairSlicesHeadsBuffer: GPUBuffer | undefined;
  public hairSlicesDataBuffer: GPUBuffer;
  public hairRasterizerResultsBuffer: GPUBuffer = undefined!; // see this.handleViewportResize()

  constructor(device: GPUDevice) {
    const shaderModule = device.createShaderModule({
      label: labelShader(HairFinePass),
      code: SHADER_CODE(),
    });
    this.pipeline = device.createComputePipeline({
      label: labelPipeline(HairFinePass),
      layout: 'auto',
      compute: {
        module: shaderModule,
        entryPoint: 'main',
      },
    });

    this.hairSlicesHeadsBuffer = createHairSlicesHeadsBuffer(device);
    this.hairSlicesDataBuffer = createHairSlicesDataBuffer(device);
  }

  cmdClearBeforeRender(ctx: PassCtx) {
    if (this.hairSlicesHeadsBuffer) {
      cmdClearWholeBuffer(ctx.cmdBuf, this.hairSlicesHeadsBuffer);
    }
    cmdClearWholeBuffer(ctx.cmdBuf, this.hairRasterizerResultsBuffer); // TODO not needed?
  }

  onViewportResize = (device: GPUDevice, viewportSize: Dimensions) => {
    this.bindingsCache.clear();

    if (this.hairRasterizerResultsBuffer) {
      this.hairRasterizerResultsBuffer.destroy();
    }

    this.hairRasterizerResultsBuffer = createHairRasterizerResultsBuffer(
      device,
      viewportSize
    );
  };

  cmdRasterizeSlicesHair(ctx: PassCtx, hairObject: HairObject) {
    const { cmdBuf, profiler } = ctx;

    const computePass = cmdBuf.beginComputePass({
      label: HairFinePass.NAME,
      timestampWrites: profiler?.createScopeGpu(HairFinePass.NAME),
    });

    const bindings = this.bindingsCache.getBindings(hairObject.name, () =>
      this.createBindings(ctx, hairObject)
    );
    computePass.setPipeline(this.pipeline);
    computePass.setBindGroup(0, bindings);

    // dispatch
    const workgroupsX = getItemsPerThread(
      CONFIG.hairRender.processorCount,
      SHADER_PARAMS.workgroupSizeX
    );
    // console.log(`${HairFinePass.NAME}.dispatch(${workgroupsX}, 1, 1)`);
    computePass.dispatchWorkgroups(workgroupsX, 1, 1);

    computePass.end();
  }

  private createBindings = (ctx: PassCtx, object: HairObject): GPUBindGroup => {
    const {
      device,
      globalUniforms,
      depthTexture,
      hairTilesBuffer,
      hairTileSegmentsBuffer,
      hairTileListBuffer,
    } = ctx;
    const b = SHADER_PARAMS.bindings;
    assertIsGPUTextureView(depthTexture);

    const entries: GPUBindGroupEntry[] = [
      globalUniforms.createBindingDesc(b.renderUniforms),
      bindBuffer(b.tilesBuffer, hairTilesBuffer),
      bindBuffer(b.tileSegmentsBuffer, hairTileSegmentsBuffer),
      bindBuffer(b.hairSlicesData, this.hairSlicesDataBuffer),
      bindBuffer(b.rasterizerResult, this.hairRasterizerResultsBuffer),
      bindBuffer(b.tileList, hairTileListBuffer),
      object.bindHairData(b.hairData),
      object.bindPointsPositions(b.hairPositions),
      object.bindTangents(b.hairTangents),
      object.bindShading(b.hairShading),
      { binding: b.depthTexture, resource: depthTexture },
    ];

    // no needed if using workgroup/registers memory
    if (this.hairSlicesHeadsBuffer) {
      entries.push(bindBuffer(b.hairSlicesHeads, this.hairSlicesHeadsBuffer));
    }

    return assignResourcesToBindings2(
      HairFinePass,
      object.name,
      device,
      this.pipeline,
      entries
    );
  };
}
