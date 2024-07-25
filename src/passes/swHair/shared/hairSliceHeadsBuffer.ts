import { BYTES_U32, CONFIG } from '../../../constants.ts';
import { STATS } from '../../../stats.ts';
import { formatBytes } from '../../../utils/string.ts';
import { WEBGPU_MINIMAL_BUFFER_SIZE } from '../../../utils/webgpu.ts';

const ENTRIES_PER_PROCESSOR =
  CONFIG.hairRender.tileSize *
  CONFIG.hairRender.tileSize *
  CONFIG.hairRender.slicesPerPixel;

const USE_LOCAL_MEMORY = CONFIG.hairRender.useLocalMemoryForSlicesHeads;

export const getLocalMemoryRequirements = () =>
  USE_LOCAL_MEMORY ? ENTRIES_PER_PROCESSOR * BYTES_U32 : 0;

///////////////////////////
/// SHADER CODE - SHARED - UTILS
///////////////////////////

const SHARED_UTILS = /* wgsl */ `

const INVALID_SLICE_DATA_PTR: u32 = 0xffffffffu;

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
  let count = ${ENTRIES_PER_PROCESSOR}u;

  for (var i: u32 = 0u; i < count; i += 1u) {
    _hairSliceHeads[offset + i] = INVALID_SLICE_DATA_PTR;
  }
}
`;

///////////////////////////
/// SHADER CODE - GLOBAL MEMORY
///////////////////////////

/**
 * For each processor, contains `TILE_SIZE * TILE_SIZE * SLICES_PER_PIXEL`
 * entries. Each entry is a pointer into slices data buffer.
 *
 * The memory is per-processor, so we do not need atomics.
 */
const BUFFER_HAIR_SLICES_HEADS_GLOBAL = (
  bindingIdx: number,
  access: 'read_write'
) => /* wgsl */ `


@group(0) @binding(${bindingIdx})
var<storage, ${access}> _hairSliceHeads: array<u32>;

fn _getHeadsProcessorOffset(processorId: u32) -> u32 {
  return processorId * ${ENTRIES_PER_PROCESSOR};
}

${SHARED_UTILS}
`;

///////////////////////////
/// SHADER CODE - LOCAL MEMORY
///////////////////////////

// TODO assert workgroup size is 1
// TODO do not allocate the vram
const BUFFER_HAIR_SLICES_HEADS_LOCAL = (
  _bindingIdx: number,
  _access: 'read_write'
) => /* wgsl */ `

var<workgroup> _hairSliceHeads: array<u32, ${ENTRIES_PER_PROCESSOR}u>;

fn _getHeadsProcessorOffset(processorId: u32) -> u32 {
  return 0u;
}

${SHARED_UTILS}
`;

export const BUFFER_HAIR_SLICES_HEADS = USE_LOCAL_MEMORY
  ? BUFFER_HAIR_SLICES_HEADS_LOCAL
  : BUFFER_HAIR_SLICES_HEADS_GLOBAL;

///////////////////////////
/// GPU BUFFER
///////////////////////////

/** Active := can be addressed by currently working processors */
export function getActiveSlicesCount() {
  const { tileSize, slicesPerPixel, processorCount } = CONFIG.hairRender;
  return tileSize * tileSize * slicesPerPixel * processorCount;
}

type Allocator = (device: GPUDevice) => GPUBuffer | undefined;

function createHairSlicesHeadsBuffer_GLOBAL(device: GPUDevice): GPUBuffer {
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

function createHairSlicesHeadsBuffer_LOCAL(_device: GPUDevice): undefined {
  const grSize = CONFIG.hairRender.finePassWorkgroupSizeX;
  if (grSize !== 1) {
    throw new Error(`Expected finePassWorkgroupSizeX to be 1, was ${grSize}`);
  }
  return undefined;
}

export const createHairSlicesHeadsBuffer: Allocator = USE_LOCAL_MEMORY
  ? createHairSlicesHeadsBuffer_LOCAL
  : createHairSlicesHeadsBuffer_GLOBAL;
