import { BYTES_U32, CONFIG, SliceHeadsMemory } from '../../../constants.ts';
import { STATS } from '../../../stats.ts';
import { formatBytes } from '../../../utils/string.ts';
import { WEBGPU_MINIMAL_BUFFER_SIZE } from '../../../utils/webgpu.ts';

const ENTRIES_PER_PROCESSOR =
  CONFIG.hairRender.tileSize *
  CONFIG.hairRender.tileSize *
  CONFIG.hairRender.slicesPerPixel;

const SLICE_HEADS_MEMORY = CONFIG.hairRender.sliceHeadsMemory;

export const getLocalMemoryRequirements = () =>
  SLICE_HEADS_MEMORY === 'workgroup' ? ENTRIES_PER_PROCESSOR * BYTES_U32 : 0;

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

fn _clearSliceHeadPtr(
  processorId: u32,
  pixelInTile: vec2u, sliceIdx: u32,
) {
  let idx = _getHeadsSliceIdx(processorId, pixelInTile, sliceIdx);
  _hairSliceHeads[idx] = INVALID_SLICE_DATA_PTR;
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

const LOCAL_MEMORY_ACCESS =
  SLICE_HEADS_MEMORY === 'workgroup' ? 'workgroup' : 'private';

const BUFFER_HAIR_SLICES_HEADS_LOCAL = (
  _bindingIdx: number,
  _access: 'read_write'
) => /* wgsl */ `

var<${LOCAL_MEMORY_ACCESS}> _hairSliceHeads: array<u32, ${ENTRIES_PER_PROCESSOR}u>;

fn _getHeadsProcessorOffset(processorId: u32) -> u32 {
  return 0u;
}

${SHARED_UTILS}
`;

export const BUFFER_HAIR_SLICES_HEADS =
  SLICE_HEADS_MEMORY === 'global'
    ? BUFFER_HAIR_SLICES_HEADS_GLOBAL
    : BUFFER_HAIR_SLICES_HEADS_LOCAL;

///////////////////////////
/// GPU BUFFER
///////////////////////////

type Allocator = (device: GPUDevice) => GPUBuffer | undefined;

function createHairSlicesHeadsBuffer_GLOBAL(device: GPUDevice): GPUBuffer {
  const size = calcMemoryReqs();

  return device.createBuffer({
    label: `hair-slices-heads`,
    size,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
}

function createHairSlicesHeadsBuffer_LOCAL(_device: GPUDevice): undefined {
  const { finePassWorkgroupSizeX: grSize, sliceHeadsMemory } =
    CONFIG.hairRender;
  if (grSize !== 1 && sliceHeadsMemory === 'workgroup') {
    throw new Error(`Expected finePassWorkgroupSizeX to be 1, was ${grSize}`);
  }
  calcMemoryReqs();
  return undefined;
}

export const createHairSlicesHeadsBuffer: Allocator =
  SLICE_HEADS_MEMORY === 'global'
    ? createHairSlicesHeadsBuffer_GLOBAL
    : createHairSlicesHeadsBuffer_LOCAL;

function calcMemoryReqs() {
  const { tileSize, slicesPerPixel, processorCount } = CONFIG.hairRender;

  const entriesPerProcessor = tileSize * tileSize * slicesPerPixel;
  const entries = processorCount * entriesPerProcessor;
  const bytesPerEntry = BYTES_U32;
  const size = Math.max(entries * bytesPerEntry, WEBGPU_MINIMAL_BUFFER_SIZE);

  const memRegionNames: Record<SliceHeadsMemory, string> = {
    global: 'VRAM',
    workgroup: 'WKGRP',
    registers: 'REGS',
  };
  const memRegionName = memRegionNames[SLICE_HEADS_MEMORY];

  STATS.update('Slices heads', `${memRegionName} ${formatBytes(size)}`);
  STATS.update(
    ' \\ Per processor',
    formatBytes(entriesPerProcessor * bytesPerEntry)
  );

  return size;
}
