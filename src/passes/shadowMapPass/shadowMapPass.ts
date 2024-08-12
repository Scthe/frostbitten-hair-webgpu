import { CONFIG, VERTS_IN_TRIANGLE } from '../../constants.ts';
import { GPUMesh, VERTEX_ATTRIBUTE_POSITION } from '../../scene/gpuMesh.ts';
import { HairObject } from '../../scene/hair/hairObject.ts';
import { BindingsCache } from '../_shared/bindingsCache.ts';
import {
  labelShader,
  labelPipeline,
  PIPELINE_PRIMITIVE_TRIANGLE_LIST,
  useDepthStencilAttachment,
  PIPELINE_DEPTH_ON,
  assignResourcesToBindings,
  assignResourcesToBindings2,
} from '../_shared/shared.ts';
import { HwHairPass } from '../hwHair/hwHairPass.ts';
import { PassCtx } from '../passCtx.ts';
import * as SHADER_MESHES from './shadowMapPass.wgsl.ts';
import * as SHADER_HAIR from './shadowMapHairPass.wgsl.ts';
import { createShadowSampler } from './shared/sampleShadows.wgsl.ts';

/** https://github.com/Scthe/WebFX/blob/09713a3e7ebaa1484ff53bd8a007908a5340ca8e/src/webfx/passes/ShadowPass.ts */
export class ShadowMapPass {
  public static NAME: string = 'ShadowMapPass';

  private readonly pipelineMeshes: GPURenderPipeline;
  private readonly pipelineHair: GPURenderPipeline;
  private readonly bindingsCache = new BindingsCache();
  public readonly shadowMapSampler: GPUSampler;
  // render targets:
  private readonly shadowDepthTexture: GPUTexture;
  public readonly shadowDepthTextureView: GPUTextureView;

  constructor(device: GPUDevice) {
    this.shadowMapSampler = createShadowSampler(device);

    // meshes
    const shaderModuleMeshes = device.createShaderModule({
      label: labelShader(ShadowMapPass),
      code: SHADER_MESHES.SHADER_CODE(),
    });
    this.pipelineMeshes = device.createRenderPipeline({
      label: labelPipeline(ShadowMapPass),
      layout: 'auto',
      vertex: {
        module: shaderModuleMeshes,
        entryPoint: 'main_vs',
        buffers: [VERTEX_ATTRIBUTE_POSITION],
      },
      fragment: {
        module: shaderModuleMeshes,
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

    // hair
    const shaderModuleHair = device.createShaderModule({
      label: labelShader(ShadowMapPass),
      code: SHADER_HAIR.SHADER_CODE(),
    });
    const pipelineDesc = HwHairPass.createPipelineDesc(shaderModuleHair);
    this.pipelineHair = device.createRenderPipeline(pipelineDesc);

    // render targets
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

    // render meshes
    renderPass.setPipeline(this.pipelineMeshes);
    let bindings = this.bindingsCache.getBindings('meshes', () =>
      this.createBindingsMeshes(ctx)
    );
    renderPass.setBindGroup(0, bindings);
    for (const object of scene.objects) {
      this.renderMesh(renderPass, object);
    }

    // render hair
    const hairObject = scene.hairObject;
    renderPass.setPipeline(this.pipelineHair);
    bindings = this.bindingsCache.getBindings(`hair-${hairObject.name}`, () =>
      this.createBindingsHair(ctx, hairObject)
    );
    renderPass.setBindGroup(0, bindings);
    HwHairPass.cmdRenderHair(renderPass, hairObject);

    // fin
    renderPass.end();
  }

  private renderMesh(renderPass: GPURenderPassEncoder, object: GPUMesh) {
    if (object.isColliderPreview) {
      return;
    }
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

  private createBindingsMeshes = ({
    device,
    globalUniforms,
  }: PassCtx): GPUBindGroup => {
    const b = SHADER_MESHES.SHADER_PARAMS.bindings;

    return assignResourcesToBindings(
      ShadowMapPass,
      device,
      this.pipelineMeshes,
      [globalUniforms.createBindingDesc(b.renderUniforms)]
    );
  };

  private createBindingsHair = (
    { device, globalUniforms }: PassCtx,
    object: HairObject
  ): GPUBindGroup => {
    const b = SHADER_HAIR.SHADER_PARAMS.bindings;

    return assignResourcesToBindings2(
      HwHairPass,
      object.name,
      device,
      this.pipelineHair,
      [
        globalUniforms.createBindingDesc(b.renderUniforms),
        object.bindPointsPositions(b.hairPositions),
        object.bindTangents(b.hairTangents),
      ]
    );
  };
}
