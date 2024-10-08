import { divideCeil, getBytes, getClassName, getTypeName } from './index.ts';
import { CONFIG } from '../constants.ts';
import { TypedArray, ensureTypedArray } from './arrays.ts';
import { getLocalMemoryRequirements } from '../passes/swHair/shared/hairSliceHeadsBuffer.ts';

export const WEBGPU_MINIMAL_BUFFER_SIZE = 256;

export async function createGpuDevice() {
  try {
    const adapter = await navigator.gpu.requestAdapter({
      powerPreference: 'high-performance',
    });
    const onError = (msg: string) =>
      console.error(`WebGPU init error: '${msg}'`);

    if (!adapter) {
      // On web: check if https. On ff, WebGPU is under dev flag.
      onError('No adapter found. WebGPU seems to be unavailable.');
      return;
    }

    const canTimestamp = adapter.features.has('timestamp-query');
    const requiredFeatures: GPUFeatureName[] = ['float32-filterable'];
    if (canTimestamp) {
      requiredFeatures.push('timestamp-query');
    }

    // Limits change: https://gpuweb.github.io/gpuweb/#gpusupportedlimits
    const requiredLimits: GPUSupportedLimits = {};
    if (CONFIG.increaseStorageMemoryLimits) {
      // Warning: BigInt is used for memory limits (unsigned long long in WebGPU spec)
      const lims = adapter.limits;

      if (Number.isSafeInteger(lims.maxStorageBufferBindingSize)) {
        requiredLimits.maxStorageBufferBindingSize = Number(lims.maxStorageBufferBindingSize); // prettier-ignore
      }
      if (Number.isSafeInteger(lims.maxBufferSize)) {
        requiredLimits.maxBufferSize = Number(lims.maxBufferSize);
      }

      // defaults just in case
      requiredLimits.maxStorageBufferBindingSize ||= getBytes(1024, 'MB');
      requiredLimits.maxBufferSize ||= getBytes(1024, 'MB');
    }
    requiredLimits.maxComputeWorkgroupStorageSize = Math.max(
      getLocalMemoryRequirements(),
      // 16Kb is the default limit on Chrome, provided to cover for undefined default limit
      adapter.limits.maxComputeWorkgroupStorageSize || getBytes(16, 'KB')
    );
    requiredLimits.maxStorageBuffersPerShaderStage = 10;

    // create device
    const device = await adapter?.requestDevice({
      requiredFeatures,
      // deno-lint-ignore no-explicit-any
      requiredLimits: requiredLimits as any,
    });
    if (!device) {
      onError('Failed to get GPUDevice from the adapter.');
      return;
    }

    return device;
  } catch (e) {
    console.error(e);
    return;
  }
}

export function createGPUBuffer<T extends TypedArray>(
  device: GPUDevice,
  label: string,
  usage: GPUBufferUsageFlags,
  data: T
) {
  const gpuBuffer = device.createBuffer({
    label,
    size: data.byteLength,
    usage,
  });
  /*console.log(`Create buffer [${label}]`, {
    dataLen: data.length,
    dataBytes: data.byteLength,
    gpuSize: gpuBuffer.size,
    // data,
  });*/
  // device.queue.writeBuffer(gpuBuffer, 0, data, 0, data.length);
  device.queue.writeBuffer(gpuBuffer, 0, data, 0);
  return gpuBuffer;
}

export function createGPU_VertexBuffer(
  device: GPUDevice,
  label: string,
  data: Float32Array | number[],
  extraUsage: GPUBufferUsage = 0
) {
  const dataTypedArr = ensureTypedArray(Float32Array, data);
  return createGPUBuffer(
    device,
    label,
    GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST | (extraUsage as number),
    dataTypedArr
  );
}

export function createGPU_IndexBuffer(
  device: GPUDevice,
  label: string,
  data: Uint32Array | number[]
) {
  const dataTypedArr = ensureTypedArray(Uint32Array, data);
  return createGPUBuffer(
    device,
    label,
    GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    dataTypedArr
  );
}

export function createGPU_StorageBuffer(
  device: GPUDevice,
  label: string,
  data: Uint32Array | Float32Array | Int32Array,
  extraUsage: GPUBufferUsageFlags = 0
) {
  const clName = getClassName(data);
  const allowedClasses = [Uint32Array.name, Float32Array.name, Int32Array.name];
  if (!allowedClasses.includes(clName)) {
    throw new Error(`Invalid data provided to createGPU_StorageBuffer(). Expected TypedArray, got ${clName}`) // prettier-ignore
  }

  return createGPUBuffer(
    device,
    label,
    GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | extraUsage,
    data
  );
}

export function cmdClearWholeBuffer(cmdBuf: GPUCommandEncoder, buf: GPUBuffer) {
  cmdBuf.clearBuffer(buf, 0, buf.size);
}

export const getItemsPerThread = divideCeil;

export type StorageAccess = 'read_write' | 'read';

export const u32_type = (access: StorageAccess) =>
  access === 'read_write' ? 'atomic<u32>' : 'u32';

export const i32_type = (access: StorageAccess) =>
  access === 'read_write' ? 'atomic<i32>' : 'i32';

export const bindBuffer = (
  idx: number,
  buffer: GPUBuffer
): GPUBindGroupEntry => ({
  binding: idx,
  resource: { buffer },
});

///////////////
/// Readback GPU -> CPU

export function createReadbackBuffer(device: GPUDevice, orgBuffer: GPUBuffer) {
  return device.createBuffer({
    label: `${orgBuffer}-readback-buffer`,
    size: orgBuffer.size,
    usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
  });
}

export function cmdCopyToReadbackBuffer(
  cmdBuf: GPUCommandEncoder,
  orgBuffer: GPUBuffer,
  readbackBuffer: GPUBuffer
) {
  cmdBuf.copyBufferToBuffer(orgBuffer, 0, readbackBuffer, 0, orgBuffer.size);
}

export async function readBufferToCPU<T>(
  TypedArrayClass: { new (a: ArrayBuffer): T },
  buffer: GPUBuffer
): Promise<T> {
  await buffer.mapAsync(GPUMapMode.READ);
  const arrayBufferData = buffer.getMappedRange();
  // use slice() to copy. The 'arrayBufferData' might be deallocated after unmap (chrome)
  const resultData = new TypedArrayClass(arrayBufferData.slice(0));
  buffer.unmap();
  return resultData;
}

export async function downloadBuffer<T>(
  device: GPUDevice,
  TypedArrayClass: { new (a: ArrayBuffer): T },
  orgBuffer: GPUBuffer
) {
  if (!CONFIG.isTest) {
    console.warn(`Reading '${orgBuffer.label}' buffer back to CPU. This is slow!`); // prettier-ignore
  }

  let readbackBuffer: GPUBuffer | undefined = undefined;
  try {
    readbackBuffer = createReadbackBuffer(device, orgBuffer);

    // copy using command
    const cmdBuf = device.createCommandEncoder({
      label: `${orgBuffer.label}-readback`,
    });
    cmdCopyToReadbackBuffer(cmdBuf, orgBuffer, readbackBuffer);
    device.queue.submit([cmdBuf.finish()]);

    // Warning: try-catch with promises
    const result = await readBufferToCPU(TypedArrayClass, readbackBuffer);

    return result;
  } catch (e) {
    throw e;
  } finally {
    if (readbackBuffer) {
      // readbackBuffer.unmap(); // already unmapped by readBufferToCPU()
      readbackBuffer.destroy();
    }
  }
}

///////////////
/// Textures

/** When reading data from texture to buffer, we need to provide alignments */
export function getPaddedBytesPerRow(width: number, bytesPerPixel: number) {
  const unpaddedBytesPerRow = width * bytesPerPixel;
  const align = 256; // COPY_BYTES_PER_ROW_ALIGNMENT
  const paddedBytesPerRowPadding =
    (align - (unpaddedBytesPerRow % align)) % align;
  return unpaddedBytesPerRow + paddedBytesPerRowPadding;
}

///////////////
/// Utils

// deno-lint-ignore no-explicit-any
export const isGPUTextureView = (maybeTexView: any) =>
  typeof maybeTexView === 'object' &&
  getClassName(maybeTexView) === GPUTextureView.name;

/** TS typings do not see difference between GPUTexture and GPUTextureView */
// deno-lint-ignore no-explicit-any
export const assertIsGPUTextureView = (maybeTexView: any) => {
  if (!isGPUTextureView(maybeTexView)) {
    throw new Error(
      `Expected ${GPUTextureView.name}, got ${getTypeName(maybeTexView)}`
    );
  }
};
