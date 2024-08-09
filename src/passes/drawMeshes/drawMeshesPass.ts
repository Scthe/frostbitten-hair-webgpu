import { CONFIG, VERTS_IN_TRIANGLE } from '../../constants.ts';
import { GPUMesh, VERTEX_ATTRIBUTES } from '../../scene/gpuMesh.ts';
import { assertIsGPUTextureView } from '../../utils/webgpu.ts';
import { BindingsCache } from '../_shared/bindingsCache.ts';
import {
  labelShader,
  labelPipeline,
  PIPELINE_PRIMITIVE_TRIANGLE_LIST,
  useColorAttachment,
  useDepthStencilAttachment,
  assignResourcesToBindings2,
  PIPELINE_DEPTH_ON,
} from '../_shared/shared.ts';
import { PassCtx } from '../passCtx.ts';
import { SHADER_CODE, SHADER_PARAMS } from './drawMeshesPass.wgsl.ts';

export class DrawMeshesPass {
  public static NAME: string = DrawMeshesPass.name;

  private readonly pipeline: GPURenderPipeline;
  private readonly bindingsCache = new BindingsCache();

  constructor(
    device: GPUDevice,
    outTextureFormat: GPUTextureFormat,
    normalsTextureFormat: GPUTextureFormat
  ) {
    const shaderModule = device.createShaderModule({
      label: labelShader(DrawMeshesPass),
      code: SHADER_CODE(),
    });

    this.pipeline = device.createRenderPipeline({
      label: labelPipeline(DrawMeshesPass),
      layout: 'auto',
      vertex: {
        module: shaderModule,
        entryPoint: 'main_vs',
        buffers: VERTEX_ATTRIBUTES,
      },
      fragment: {
        module: shaderModule,
        entryPoint: 'main_fs',
        targets: [
          { format: outTextureFormat },
          { format: normalsTextureFormat },
        ],
      },
      primitive: PIPELINE_PRIMITIVE_TRIANGLE_LIST,
      depthStencil: PIPELINE_DEPTH_ON,
    });
  }

  onViewportResize = () => {
    this.bindingsCache.clear();
  };

  cmdDrawMeshes(ctx: PassCtx) {
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
      label: DrawMeshesPass.NAME,
      colorAttachments: [
        useColorAttachment(hdrRenderTexture, CONFIG.clearColor, 'load'),
        useColorAttachment(normalsTexture, CONFIG.clearNormals, 'clear'),
      ],
      depthStencilAttachment: useDepthStencilAttachment(depthTexture, 'clear'),
      timestampWrites: profiler?.createScopeGpu(DrawMeshesPass.NAME),
    });

    // set render pass data
    renderPass.setPipeline(this.pipeline);

    for (const object of scene.objects) {
      this.renderObject(ctx, renderPass, object);
    }

    // fin
    renderPass.end();
  }

  private renderObject(
    ctx: PassCtx,
    renderPass: GPURenderPassEncoder,
    object: GPUMesh
  ) {
    const bindings = this.bindingsCache.getBindings(object.name, () =>
      this.createBindings(ctx, object)
    );

    renderPass.setBindGroup(0, bindings);
    renderPass.setVertexBuffer(0, object.positionsBuffer);
    renderPass.setVertexBuffer(1, object.normalsBuffer);
    renderPass.setVertexBuffer(2, object.uvBuffer);
    renderPass.setIndexBuffer(object.indexBuffer, 'uint32');

    const vertexCount = object.triangleCount * VERTS_IN_TRIANGLE;
    const firstInstance = object.isColliderPreview
      ? SHADER_PARAMS.firstInstance.colliderPreview
      : SHADER_PARAMS.firstInstance.sintel;
    renderPass.drawIndexed(
      vertexCount,
      1, // instance count
      0, // first index
      0, // base vertex
      firstInstance // first instance
    );
  }

  private createBindings = (ctx: PassCtx, object: GPUMesh): GPUBindGroup => {
    const {
      device,
      globalUniforms,
      shadowDepthTexture,
      shadowMapSampler,
      aoTexture,
    } = ctx;
    const b = SHADER_PARAMS.bindings;
    assertIsGPUTextureView(shadowDepthTexture);
    assertIsGPUTextureView(aoTexture);

    return assignResourcesToBindings2(
      DrawMeshesPass,
      object.name,
      device,
      this.pipeline,
      [
        globalUniforms.createBindingDesc(b.renderUniforms),
        { binding: b.shadowMapTexture, resource: shadowDepthTexture },
        { binding: b.shadowMapSampler, resource: shadowMapSampler },
        { binding: b.aoTexture, resource: aoTexture },
      ]
    );
  };
}
