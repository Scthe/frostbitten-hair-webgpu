import { CONFIG, VERTS_IN_TRIANGLE } from '../../constants.ts';
import { GPUMesh, VERTEX_ATTRIBUTES } from '../../scene/gpuMesh.ts';
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

  constructor(device: GPUDevice, outTextureFormat: GPUTextureFormat) {
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
        targets: [{ format: outTextureFormat }],
      },
      primitive: PIPELINE_PRIMITIVE_TRIANGLE_LIST,
      depthStencil: PIPELINE_DEPTH_ON,
    });
  }

  cmdDrawMeshes(ctx: PassCtx) {
    const { cmdBuf, profiler, depthTexture, hdrRenderTexture, scene } = ctx;

    // https://developer.mozilla.org/en-US/docs/Web/API/GPUCommandEncoder/beginRenderPass
    const renderPass = cmdBuf.beginRenderPass({
      label: DrawMeshesPass.NAME,
      colorAttachments: [
        useColorAttachment(hdrRenderTexture, CONFIG.clearColor, 'load'),
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
    object: GPUMesh
  ): GPUBindGroup => {
    const b = SHADER_PARAMS.bindings;
    // const diffuseTextureView = getDiffuseTexture(scene, object);
    // assertIsGPUTextureView(diffuseTextureView);

    return assignResourcesToBindings2(
      DrawMeshesPass,
      object.name,
      device,
      this.pipeline,
      [
        globalUniforms.createBindingDesc(b.renderUniforms),
        // { binding: b.diffuseTexture, resource: diffuseTextureView },
        // { binding: b.sampler, resource: scene.samplerLinear },
      ]
    );
  };
}
