import { Mat4, Vec3 } from 'wgpu-matrix';
import { GpuProfiler } from '../gpuProfiler.ts';
import { Dimensions } from '../utils/index.ts';
import { Scene } from '../scene/scene.ts';
import { RenderUniformsBuffer } from './renderUniformsBuffer.ts';
import { SimulationUniformsBuffer } from './simulation/simulationUniformsBuffer.ts';
import { GridData } from './simulation/grids/gridData.ts';

export interface PassCtx {
  frameIdx: number;
  device: GPUDevice;
  cmdBuf: GPUCommandEncoder;
  vpMatrix: Mat4;
  viewMatrix: Mat4;
  projMatrix: Mat4;
  cameraPositionWorldSpace: Vec3;
  profiler: GpuProfiler | undefined;
  viewport: Dimensions;
  scene: Scene;
  depthTexture: GPUTextureView;
  hdrRenderTexture: GPUTextureView;
  normalsTexture: GPUTextureView;
  aoTexture: GPUTextureView;
  shadowDepthTexture: GPUTextureView;
  shadowMapSampler: GPUSampler;
  globalUniforms: RenderUniformsBuffer;
  simulationUniforms: SimulationUniformsBuffer;
  physicsForcesGrid: GridData;
  // hair:
  hairTilesBuffer: GPUBuffer;
  hairTileSegmentsBuffer: GPUBuffer;
  hairRasterizerResultsBuffer: GPUBuffer;
}
