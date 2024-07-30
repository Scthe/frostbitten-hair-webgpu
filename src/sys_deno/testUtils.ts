import * as path from 'std-path';
import { assertEquals } from 'assert';
import { existsSync } from 'fs';
import { mat4 } from 'wgpu-matrix';
import { Camera } from '../camera.ts';
import { CONFIG } from '../constants.ts';
import { PassCtx } from '../passes/passCtx.ts';
import { createErrorSystem, rethrowWebGPUError } from '../utils/errors.ts';
import { Dimensions } from '../utils/index.ts';
import {
  createCameraProjectionMat,
  getModelViewProjectionMatrix,
} from '../utils/matrices.ts';
import { createGpuDevice } from '../utils/webgpu.ts';
import { HairObject } from '../scene/hair/hairObject.ts';

export function absPathFromRepoRoot(filePath: string) {
  const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
  return path.resolve(__dirname, '..', '..', filePath);
}

export function relativePath(
  importMeta: { dirname?: string },
  filePath: string
) {
  return path.resolve(importMeta?.dirname || '', filePath);
}

type ValidateWebGPUCallsFn = () => Promise<void>;

export async function createGpuDevice_TESTS(): Promise<
  [GPUDevice, ValidateWebGPUCallsFn]
> {
  const device = await createGpuDevice();
  if (!device) throw new Error('No webgpu device');

  const errorSystem = createErrorSystem(device);
  errorSystem.startErrorScope();
  const validateFn = async () => {
    await errorSystem.reportErrorScopeAsync(rethrowWebGPUError);
  };

  CONFIG.isTest = true;
  return [device, validateFn];
}

export const createMockPassCtx = (
  device: GPUDevice,
  cmdBuf: GPUCommandEncoder
): PassCtx => {
  const viewport: Dimensions = {
    width: 800,
    height: 600,
  };

  const cameraCtrl = new Camera();
  const projMatrix = createCameraProjectionMat(
    CONFIG.camera.projection,
    viewport
  );
  const vpMatrix = getModelViewProjectionMatrix(
    mat4.identity(),
    cameraCtrl.viewMatrix,
    projMatrix
  );

  const hairObject: HairObject = {
    bounds: {
      box: [[0, 0, 0], [1, 1, 1]], // prettier-ignore
      sphere: { center: [0, 0, 0], radius: 1 },
    },
    // deno-lint-ignore no-explicit-any
  } as any;

  return {
    frameIdx: 0,
    device,
    cmdBuf,
    vpMatrix,
    viewMatrix: cameraCtrl.viewMatrix,
    projMatrix,
    cameraPositionWorldSpace: cameraCtrl.positionWorldSpace,
    profiler: undefined,
    viewport,
    scene: {
      modelMatrix: mat4.identity(),
      hairObject,
      objects: [],
    },
    depthTexture: undefined!,
    hdrRenderTexture: undefined!,
    normalsTexture: undefined!,
    aoTexture: undefined!,
    shadowDepthTexture: undefined!,
    shadowMapSampler: undefined!,
    globalUniforms: undefined!,
    hairRasterizerResultsBuffer: undefined!,
    hairTilesBuffer: undefined!,
    hairTileSegmentsBuffer: undefined!,
  };
};

export async function assertBinarySnapshot(
  filepath: string,
  bytes: ArrayBuffer
) {
  const bytesU8 = new Uint8Array(bytes);

  if (existsSync(filepath)) {
    console.log(`Comparing snapshots: '${filepath}'`);
    const expected = await Deno.readFile(filepath);
    // expected[0] = 11; // test that it fails
    assertEquals(
      bytesU8,
      expected,
      'Uint8Array result does not match snapshot',
      {
        formatter: () => '<buffers-too-long-to-print>',
      }
    );
  } else {
    console.log(`Creating new snapshot: '${filepath}'`);
    await Deno.writeFile(filepath, bytesU8);
  }
}
