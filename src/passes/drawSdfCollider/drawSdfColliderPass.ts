import { CONFIG, VERTS_IN_TRIANGLE } from '../../constants.ts';
import { SDFCollider } from '../../scene/sdfCollider/sdfCollider.ts';
import { BindingsCache } from '../_shared/bindingsCache.ts';
import {
  labelShader,
  labelPipeline,
  PIPELINE_PRIMITIVE_TRIANGLE_LIST,
  useColorAttachment,
  assignResourcesToBindings,
} from '../_shared/shared.ts';
import { PassCtx } from '../passCtx.ts';
import { SHADER_CODE, SHADER_PARAMS } from './drawSdfColliderPass.wgsl.ts';

export class DrawSdfColliderPass {
  public static NAME: string = DrawSdfColliderPass.name;

  private readonly pipeline: GPURenderPipeline;
  private readonly bindingsCache = new BindingsCache();

  constructor(device: GPUDevice, outTextureFormat: GPUTextureFormat) {
    const shaderModule = device.createShaderModule({
      label: labelShader(DrawSdfColliderPass),
      code: SHADER_CODE(),
    });

    this.pipeline = device.createRenderPipeline({
      label: labelPipeline(DrawSdfColliderPass),
      layout: 'auto',
      vertex: {
        module: shaderModule,
        entryPoint: 'main_vs',
        buffers: [],
      },
      fragment: {
        module: shaderModule,
        entryPoint: 'main_fs',
        targets: [
          {
            format: outTextureFormat,
            blend: {
              // color is based on the alpha from the shader's output.
              color: {
                srcFactor: 'src-alpha',
                dstFactor: 'one-minus-src-alpha',
                operation: 'add',
              },
              alpha: {
                srcFactor: 'one',
                dstFactor: 'one',
                operation: 'add',
              },
            },
          },
        ],
      },
      primitive: {
        ...PIPELINE_PRIMITIVE_TRIANGLE_LIST,
        cullMode: 'none',
      },
    });
  }

  onViewportResize = () => {
    this.bindingsCache.clear();
  };

  cmdDrawSdf(ctx: PassCtx) {
    const { cmdBuf, profiler, hdrRenderTexture } = ctx;

    const renderPass = cmdBuf.beginRenderPass({
      label: DrawSdfColliderPass.NAME,
      colorAttachments: [
        useColorAttachment(hdrRenderTexture, CONFIG.clearColor, 'load'),
      ],
      timestampWrites: profiler?.createScopeGpu(DrawSdfColliderPass.NAME),
    });

    // set render pass data
    renderPass.setPipeline(this.pipeline);

    // uniforms
    const sdf = ctx.scene.sdfCollider;
    const bindings = this.bindingsCache.getBindings(sdf.name, () =>
      this.createBindings(ctx, sdf)
    );
    renderPass.setBindGroup(0, bindings);

    // draw
    const vertexCount = 2 * VERTS_IN_TRIANGLE;
    renderPass.draw(
      vertexCount,
      1, // instance count
      0, // first index
      0 // first instance
    );

    // fin
    renderPass.end();
  }

  private createBindings = (ctx: PassCtx, sdf: SDFCollider): GPUBindGroup => {
    const { device, globalUniforms } = ctx;
    const b = SHADER_PARAMS.bindings;

    return assignResourcesToBindings(
      DrawSdfColliderPass,
      device,
      this.pipeline,
      [
        globalUniforms.createBindingDesc(b.renderUniforms),
        sdf.bindTexture(b.sdfTexture),
        sdf.bindSampler(b.sdfSampler),
      ]
    );
  };
}
