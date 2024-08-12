import { CONFIG, VERTS_IN_TRIANGLE } from '../../constants.ts';
import { getHairTriangleCount } from '../../scene/hair/hairIndexBuffer.ts';
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
  public static NAME: string = 'HwHairPass';

  private readonly pipeline: GPURenderPipeline;
  private readonly bindingsCache = new BindingsCache();

  constructor(
    device: GPUDevice,
    outTextureFormat: GPUTextureFormat,
    normalsTextureFormat: GPUTextureFormat
  ) {
    const shaderModule = device.createShaderModule({
      label: labelShader(HwHairPass),
      code: SHADER_CODE(),
    });

    const pipelineDesc = HwHairPass.createPipelineDesc(shaderModule);
    pipelineDesc.fragment?.targets.push(
      {
        format: outTextureFormat,
        // used to control color write from shader. Cause sometimes we use this pass only for normals and depth
        blend: {
          color: {
            srcFactor: 'src-alpha',
            dstFactor: 'one-minus-src-alpha',
          },
          alpha: {
            srcFactor: 'src-alpha',
            dstFactor: 'one-minus-src-alpha',
          },
        },
      },
      { format: normalsTextureFormat }
    );
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
    const {
      cmdBuf,
      profiler,
      depthTexture,
      hdrRenderTexture,
      normalsTexture,
      scene,
    } = ctx;

    // https://developer.mozilla.org/en-US/docs/Web/API/GPUCommandEncoder/beginRenderPass
    const renderPass = cmdBuf.beginRenderPass({
      label: HwHairPass.NAME,
      colorAttachments: [
        useColorAttachment(hdrRenderTexture, CONFIG.clearColor, 'load'),
        useColorAttachment(normalsTexture, CONFIG.clearNormals, 'load'),
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
    hairObject.reportRenderedStrandCount();
  }

  public static cmdRenderHair(
    renderPass: GPURenderPassEncoder,
    hairObject: HairObject
  ) {
    hairObject.bindIndexBuffer(renderPass);

    // render full hair
    // const { triangleCount } = object.buffers.indicesData;
    // render with LOD
    const renderedStrandCnt = hairObject.getRenderedStrandCount();
    const triangleCount = getHairTriangleCount(
      renderedStrandCnt,
      hairObject.pointsPerStrand
    );

    const vertexCount = triangleCount * VERTS_IN_TRIANGLE;
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
        object.bindHairData(b.hairData),
        object.bindShading(b.hairShading),
      ]
    );
  };
}
