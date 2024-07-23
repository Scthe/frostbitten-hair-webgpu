import { BYTES_U32, CONFIG } from '../../../constants.ts';
import { STATS } from '../../../stats.ts';
import { formatBytes } from '../../../utils/string.ts';
import { WEBGPU_MINIMAL_BUFFER_SIZE } from '../../../utils/webgpu.ts';

///////////////////////////
/// SHADER CODE
///////////////////////////

/**
 * For each processor, contains `TILE_SIZE * TILE_SIZE * SLICES_PER_PIXEL`
 * entries. Each entry is a pointer into slices data buffer.
 *
 * The memory is per-processor, so we do not need atomics.
 */
export const BUFFER_HAIR_SLICES_HEADS = (
  bindingIdx: number,
  access: 'read_write'
) => /* wgsl */ `

const INVALID_SLICE_DATA_PTR: u32 = 0xffffffffu;

@group(0) @binding(${bindingIdx})
var<storage, ${access}> _hairSliceHeads: array<u32>;

fn _getHeadsProcessorOffset(processorId: u32) -> u32 {
  return processorId * TILE_SIZE * TILE_SIZE * SLICES_PER_PIXEL;
}

fn _getHeadsSliceIdx(
  processorId: u32,
  pixelInTile: vec2u, sliceIdx: u32,
) -> u32 {
  let offset = _getHeadsProcessorOffset(processorId);
  let offsetInProcessor = (
    pixelInTile.y * TILE_SIZE * SLICES_PER_PIXEL +
    pixelInTile.x * SLICES_PER_PIXEL +
    sliceIdx
  );
  return offset + offsetInProcessor;
}

fn _setSlicesHeadPtr(
  processorId: u32,
  pixelInTile: vec2u, sliceIdx: u32,
  nextPtr: u32
) -> u32 {
  let idx = _getHeadsSliceIdx(processorId, pixelInTile, sliceIdx);
  let prevPtr = _hairSliceHeads[idx];
  _hairSliceHeads[idx] = nextPtr;
  return prevPtr;
}

fn _getSlicesHeadPtr(
  processorId: u32,
  pixelInTile: vec2u, sliceIdx: u32,
) -> u32 {
  let idx = _getHeadsSliceIdx(processorId, pixelInTile, sliceIdx);
  return _hairSliceHeads[idx];
}

fn _clearSlicesHeadPtrs(processorId: u32) {
  let offset = _getHeadsProcessorOffset(processorId);
  let count = TILE_SIZE * TILE_SIZE * SLICES_PER_PIXEL;

  for (var i: u32 = 0u; i < count; i += 1u) {
    _hairSliceHeads[offset + i] = INVALID_SLICE_DATA_PTR;
  }
}
`;

///////////////////////////
/// GPU BUFFER
///////////////////////////

/** Active := can be addressed by currently working processors */
export function getActiveSlicesCount() {
  const { tileSize, slicesPerPixel, processorCount } = CONFIG.hairRender;
  return tileSize * tileSize * slicesPerPixel * processorCount;
}

export function createHairSlicesHeadsBuffer(device: GPUDevice): GPUBuffer {
  const entries = getActiveSlicesCount();
  const bytesPerEntry = BYTES_U32;
  const size = Math.max(entries * bytesPerEntry, WEBGPU_MINIMAL_BUFFER_SIZE);
  STATS.update('Slices heads', formatBytes(size));

  return device.createBuffer({
    label: `hair-slices-heads`,
    size,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
}
