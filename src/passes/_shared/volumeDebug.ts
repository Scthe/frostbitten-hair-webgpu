import { CONFIG, VERTS_IN_TRIANGLE } from '../../constants.ts';
import { PassCtx } from '../passCtx.ts';
import {
  PIPELINE_PRIMITIVE_TRIANGLE_LIST,
  useColorAttachment,
} from './shared.ts';

export function createDebugVolumePipeline(
  device: GPUDevice,
  shaderModule: GPUShaderModule,
  outTextureFormat: GPUTextureFormat,
  label: string
) {
  return device.createRenderPipeline({
    label,
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

export function cmdDrawDbgVolumeQuad(
  ctx: PassCtx,
  pass: { NAME: string },
  pipeline: GPURenderPipeline,
  bindings: GPUBindGroup
) {
  const { cmdBuf, profiler, hdrRenderTexture } = ctx;

  const renderPass = cmdBuf.beginRenderPass({
    label: pass.NAME,
    colorAttachments: [
      useColorAttachment(hdrRenderTexture, CONFIG.clearColor, 'load'),
    ],
    timestampWrites: profiler?.createScopeGpu(pass.NAME),
  });

  // set render pass data
  renderPass.setPipeline(pipeline);
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
