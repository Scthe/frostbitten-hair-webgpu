import { ClearColor, DEPTH_FORMAT } from '../../constants.ts';
import { assertIsGPUTextureView } from '../../utils/webgpu.ts';

type PassClass = { NAME: string };

export const createLabel = (pass: PassClass, name = '') =>
  `${pass.NAME}${name ? '-' + name : ''}`;

export const labelShader = (pass: PassClass, name = '') =>
  `${createLabel(pass, name)}-shader`;
export const labelPipeline = (pass: PassClass, name = '') =>
  `${createLabel(pass, name)}-pipeline`;
export const labelUniformBindings = (pass: PassClass, name = '') =>
  `${createLabel(pass, name)}-uniforms`;

export const PIPELINE_PRIMITIVE_TRIANGLE_LIST: GPUPrimitiveState = {
  cullMode: 'back',
  topology: 'triangle-list',
  stripIndexFormat: undefined,
};

export const PIPELINE_DEPTH_ON: GPUDepthStencilState = {
  format: DEPTH_FORMAT,
  depthWriteEnabled: true,
  depthCompare: 'less',
};

export const assignResourcesToBindings = (
  pass: PassClass,
  device: GPUDevice,
  pipeline: GPURenderPipeline | GPUComputePipeline,
  entries: GPUBindGroupEntry[]
) => {
  return assignResourcesToBindings2(pass, '', device, pipeline, entries);
};

export const assignResourcesToBindings2 = (
  pass: PassClass,
  name: string,
  device: GPUDevice,
  pipeline: GPURenderPipeline | GPUComputePipeline,
  entries: GPUBindGroupEntry[]
) => {
  const uniformsLayout = pipeline.getBindGroupLayout(0);
  return device.createBindGroup({
    label: labelUniformBindings(pass, name),
    layout: uniformsLayout,
    entries,
  });
};

export const useColorAttachment = (
  colorTexture: GPUTextureView,
  clearColor: ClearColor,
  loadOp: GPULoadOp,
  storeOp: GPUStoreOp = 'store'
): GPURenderPassColorAttachment => {
  assertIsGPUTextureView(colorTexture);
  return {
    view: colorTexture,
    loadOp,
    storeOp,
    clearValue: clearColor,
  };
};

export const useDepthStencilAttachment = (
  depthTexture: GPUTextureView,
  depthLoadOp: GPULoadOp,
  depthStoreOp: GPUStoreOp = 'store'
): GPURenderPassDepthStencilAttachment => {
  assertIsGPUTextureView(depthTexture);
  return {
    view: depthTexture,
    depthClearValue: 1.0,
    depthLoadOp,
    depthStoreOp,
  };
};
