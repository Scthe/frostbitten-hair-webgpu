import { CONFIG, VERTS_IN_TRIANGLE } from '../../constants.ts';
import { GPUMesh, VERTEX_ATTRIBUTE_POSITION } from '../../scene/gpuMesh.ts';
import { BindingsCache } from '../_shared/bindingsCache.ts';
import {
  labelShader,
  labelPipeline,
  PIPELINE_PRIMITIVE_TRIANGLE_LIST,
  useDepthStencilAttachment,
  PIPELINE_DEPTH_ON,
  assignResourcesToBindings,
} from '../_shared/shared.ts';
import { PassCtx } from '../passCtx.ts';
import { SHADER_CODE, SHADER_PARAMS } from './shadowMapPass.wgsl.ts';

export class ShadowMapPass {
  public static NAME: string = ShadowMapPass.name;

  private readonly pipeline: GPURenderPipeline;
  private readonly bindingsCache = new BindingsCache();
  private readonly shadowDepthTexture: GPUTexture;
  public readonly shadowDepthTextureView: GPUTextureView;

  constructor(device: GPUDevice) {
    const shaderModule = device.createShaderModule({
      label: labelShader(ShadowMapPass),
      code: SHADER_CODE(),
    });

    this.pipeline = device.createRenderPipeline({
      label: labelPipeline(ShadowMapPass),
      layout: 'auto',
      vertex: {
        module: shaderModule,
        entryPoint: 'main_vs',
        buffers: [VERTEX_ATTRIBUTE_POSITION],
      },
      fragment: {
        module: shaderModule,
        entryPoint: 'main_fs',
        targets: [],
      },
      primitive: {
        ...PIPELINE_PRIMITIVE_TRIANGLE_LIST,
        cullMode: 'none', // see https://docs.microsoft.com/en-us/windows/desktop/DxTechArts/common-techniques-to-improve-shadow-depth-maps#back-face-and-front-face
      },
      depthStencil: {
        ...PIPELINE_DEPTH_ON,
        format: CONFIG.shadows.depthFormat,
      },
    });

    const cfg = CONFIG.shadows;
    this.shadowDepthTexture = device.createTexture({
      label: `shadowmap-depth-texture`,
      size: [cfg.textureSize, cfg.textureSize, 1],
      format: cfg.depthFormat,
      usage:
        GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
    this.shadowDepthTextureView = this.shadowDepthTexture.createView();
  }

  cmdUpdateShadowMap(ctx: PassCtx) {
    const { cmdBuf, profiler, shadowDepthTexture, scene } = ctx;

    // https://developer.mozilla.org/en-US/docs/Web/API/GPUCommandEncoder/beginRenderPass
    const renderPass = cmdBuf.beginRenderPass({
      label: ShadowMapPass.NAME,
      colorAttachments: [],
      depthStencilAttachment: useDepthStencilAttachment(
        shadowDepthTexture,
        'clear'
      ),
      timestampWrites: profiler?.createScopeGpu(ShadowMapPass.NAME),
    });

    // set render pass data
    renderPass.setPipeline(this.pipeline);
    const bindings = this.bindingsCache.getBindings('meshes', () =>
      this.createBindings(ctx)
    );

    renderPass.setBindGroup(0, bindings);

    for (const object of scene.objects) {
      this.renderObject(renderPass, object);
    }

    // fin
    renderPass.end();
  }

  private renderObject(renderPass: GPURenderPassEncoder, object: GPUMesh) {
    renderPass.setVertexBuffer(0, object.positionsBuffer);
    renderPass.setIndexBuffer(object.indexBuffer, 'uint32');

    const vertexCount = object.triangleCount * VERTS_IN_TRIANGLE;
    renderPass.drawIndexed(
      vertexCount,
      1, // instance count
      0, // first index
      0, // base vertex
      0 // first instance
    );
  }

  private createBindings = ({
    device,
    globalUniforms,
  }: PassCtx): GPUBindGroup => {
    const b = SHADER_PARAMS.bindings;

    return assignResourcesToBindings(ShadowMapPass, device, this.pipeline, [
      globalUniforms.createBindingDesc(b.renderUniforms),
    ]);
  };
}
