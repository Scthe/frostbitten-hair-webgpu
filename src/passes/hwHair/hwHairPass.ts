import { CONFIG, VERTS_IN_TRIANGLE } from '../../constants.ts';
import { HairObject } from '../../scene/hair/hairObject.ts';
import { BindingsCache } from '../_shared/bindingsCache.ts';
import {
  labelShader,
  labelPipeline,
  useColorAttachment,
  useDepthStencilAttachment,
  assignResourcesToBindings2,
  PIPELINE_DEPTH_ON,
} from '../_shared/shared.ts';
import { PassCtx } from '../passCtx.ts';
import { SHADER_CODE, SHADER_PARAMS } from './hwHairPass.wgsl.ts';

export class HwHairPass {
  public static NAME: string = HwHairPass.name;

  private readonly pipeline: GPURenderPipeline;
  private readonly bindingsCache = new BindingsCache();

  constructor(device: GPUDevice, outTextureFormat: GPUTextureFormat) {
    const shaderModule = device.createShaderModule({
      label: labelShader(HwHairPass),
      code: SHADER_CODE(),
    });

    const pipelineDesc = HwHairPass.createPipelineDesc(shaderModule);
    pipelineDesc.fragment?.targets.push({ format: outTextureFormat });
    this.pipeline = device.createRenderPipeline(pipelineDesc);
  }

  public static createPipelineDesc(
    shaderModule: GPUShaderModule
  ): GPURenderPipelineDescriptor {
    return {
      label: labelPipeline(HwHairPass),
      layout: 'auto',
      vertex: {
        module: shaderModule,
        entryPoint: 'main_vs',
        buffers: [],
      },
      fragment: {
        module: shaderModule,
        entryPoint: 'main_fs',
        targets: [],
      },
      primitive: {
        cullMode: 'none',
        topology: 'triangle-list',
        stripIndexFormat: undefined,
      },
      depthStencil: PIPELINE_DEPTH_ON,
    };
  }

  cmdDrawHair(ctx: PassCtx) {
    const { cmdBuf, profiler, depthTexture, hdrRenderTexture, scene } = ctx;

    // https://developer.mozilla.org/en-US/docs/Web/API/GPUCommandEncoder/beginRenderPass
    const renderPass = cmdBuf.beginRenderPass({
      label: HwHairPass.NAME,
      colorAttachments: [
        useColorAttachment(hdrRenderTexture, CONFIG.clearColor, 'load'),
      ],
      depthStencilAttachment: useDepthStencilAttachment(depthTexture, 'load'),
      timestampWrites: profiler?.createScopeGpu(HwHairPass.NAME),
    });

    // set render pass data
    renderPass.setPipeline(this.pipeline);

    // render hair
    const hairObject = scene.hairObject;
    const bindings = this.bindingsCache.getBindings(hairObject.name, () =>
      this.createBindings(ctx, hairObject)
    );
    renderPass.setBindGroup(0, bindings);
    HwHairPass.cmdRenderHair(renderPass, hairObject);

    // fin
    renderPass.end();
  }

  public static cmdRenderHair(
    renderPass: GPURenderPassEncoder,
    object: HairObject
  ) {
    object.bindIndexBuffer(renderPass);

    const vertexCount =
      object.buffers.indicesData.triangleCount * VERTS_IN_TRIANGLE;
    renderPass.drawIndexed(
      vertexCount,
      1, // instance count
      0, // first index
      0, // base vertex
      0 // first instance
    );
  }

  private createBindings = (
    { device, globalUniforms }: PassCtx,
    object: HairObject
  ): GPUBindGroup => {
    const b = SHADER_PARAMS.bindings;

    return assignResourcesToBindings2(
      HwHairPass,
      object.name,
      device,
      this.pipeline,
      [
        globalUniforms.createBindingDesc(b.renderUniforms),
        object.bindPointsPositions(b.hairPositions),
        object.bindTangents(b.hairTangents),
      ]
    );
  };
}
