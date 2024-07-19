import { BYTES_U32, CONFIG } from '../../../constants.ts';
import { WEBGPU_MINIMAL_BUFFER_SIZE, u32_type } from '../../../utils/webgpu.ts';

///////////////////////////
/// SHADER CODE
/// TODO how to clear this between slices? Just be carefull with
/// first write and ignore first value from setSlicesHeadPtr()?
///////////////////////////

const setSlicesHeadPtr = /* wgsl */ `

fn _setSlicesHeadPtr(
  processorId: u32,
  pixelInTile: vec2u, sliceIdx: u32,
  value: u32
) -> u32 {
  let idx = _getSliceIdx(processorId, pixelInTile, sliceIdx);
  let lastHead = atomicExchange(&_hairSliceHeads[idx], value);
  return lastHead;
}
`;

const getSlicesHeadPtr = /* wgsl */ `

fn _getSlicesHeadPtr(
  processorId: u32,
  pixelInTile: vec2u, sliceIdx: u32,
) -> u32 {
  let idx = _getSliceIdx(processorId, pixelInTile, sliceIdx);
  return _hairSliceHeads[idx];
}
`;

export const BUFFER_HAIR_SLICES_HEADS = (
  bindingIdx: number,
  access: 'read_write' | 'read'
) => /* wgsl */ `

@group(0) @binding(${bindingIdx})
var<storage, ${access}> _hairSliceHeads: array<${u32_type(access)}>


${access == 'read_write' ? setSlicesHeadPtr : getSlicesHeadPtr}


const SLICES_PER_PIXEL: u32 = ${CONFIG.hairRender.slicesPerPixel};

fn _getSliceIdx(
  processorId: u32,
  pixelInTile: vec2u, sliceIdx: u32,
) -> u32 {
  let offset = processorId * TILE_SIZE * TILE_SIZE * SLICES_PER_PIXEL;
  let offsetInProcessor = (
    pixelInTile.x * TILE_SIZE * TILE_SIZE +
    pixelInTile.y * TILE_SIZE +
    sliceIdx
  );
  return offset + offsetInProcessor;
}
`;

///////////////////////////
/// GPU BUFFER
///////////////////////////

/** Active := can be addressed by currently working processorrs */
export function getActiveSlicesCount() {
  const { tileSize, slicesPerPixel, processorCount } = CONFIG.hairRender;
  return tileSize * tileSize * slicesPerPixel * processorCount;
}

export function createHairSlicesHeadsBuffer(device: GPUDevice): GPUBuffer {
  const entries = getActiveSlicesCount();
  const bytesPerEntry = BYTES_U32;

  return device.createBuffer({
    label: `hair-slice-heads`,
    size: Math.max(entries * bytesPerEntry, WEBGPU_MINIMAL_BUFFER_SIZE),
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
}
