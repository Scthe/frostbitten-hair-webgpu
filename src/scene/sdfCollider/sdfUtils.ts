import { BYTES_F32 } from '../../constants.ts';

/** https://www.w3.org/TR/webgpu/#float32-filterable */
const TEXTURE_FORMAT: GPUTextureFormat = 'r32float';

export function createSDFTexture(
  device: GPUDevice,
  name: string,
  dims: number,
  data: Float32Array
) {
  const texSize: GPUExtent3D = {
    width: dims,
    height: dims,
    depthOrArrayLayers: dims,
  };
  const tex = device.createTexture({
    label: `${name}-texture`,
    dimension: '3d',
    size: texSize,
    format: TEXTURE_FORMAT,
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
  });
  device.queue.writeTexture(
    { texture: tex },
    data,
    { bytesPerRow: BYTES_F32 * dims, rowsPerImage: dims },
    texSize
  );
  return tex;
}

export function createSdfSampler(device: GPUDevice, name: string) {
  return device.createSampler({
    label: `${name}-sampler`,
    addressModeU: 'clamp-to-edge',
    addressModeV: 'clamp-to-edge',
    addressModeW: 'clamp-to-edge',
    magFilter: 'linear',
    minFilter: 'linear',
  });
}
