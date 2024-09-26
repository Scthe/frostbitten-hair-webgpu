import { BYTES_U32, CONFIG, SliceHeadsMemory } from '../../../constants.ts';
import { STATS } from '../../../stats.ts';
import { formatBytes } from '../../../utils/string.ts';
import { WEBGPU_MINIMAL_BUFFER_SIZE } from '../../../utils/webgpu.ts';

const ENTRIES_PER_PROCESSOR =
  CONFIG.hairRender.tileSize *
  CONFIG.hairRender.tileSize *
  CONFIG.hairRender.slicesPerPixel;

const TILE_SIZE = CONFIG.hairRender.tileSize;
const WORKGROUP_SIZE = TILE_SIZE * TILE_SIZE;
const PROCESSOR_COUNT = CONFIG.hairRender.processorCount;
const SLICE_HEADS_MEMORY = CONFIG.hairRender.sliceHeadsMemory;

export const getLocalMemoryRequirements = () =>
  SLICE_HEADS_MEMORY === 'workgroup' ? ENTRIES_PER_PROCESSOR * BYTES_U32 : 0;

const MEMORY_PARALLEL_SIZE = () => {
  if (SLICE_HEADS_MEMORY === 'workgroup') return WORKGROUP_SIZE;
  if (SLICE_HEADS_MEMORY === 'global') return PROCESSOR_COUNT;
  return 1; // registers
};

const MEMORY_PROCESSOR_OFFSET = () => {
  if (SLICE_HEADS_MEMORY === 'workgroup') return '_local_invocation_index';
  if (SLICE_HEADS_MEMORY === 'global') return 'processorId';
  return '0u'; // registers
};

///////////////////////////
/// SHADER CODE - SHARED - UTILS
///////////////////////////

const SHARED_UTILS = /* wgsl */ `

const INVALID_SLICE_DATA_PTR: u32 = 0xffffffffu;

fn _getHeadsSliceIdx(
  processorId: u32,
  pixelInTile: vec2u, sliceIdx: u32,
) -> u32 {
  let OFFSET = ${MEMORY_PARALLEL_SIZE()}u;
  return (
    pixelInTile.y * OFFSET * TILE_SIZE * SLICES_PER_PIXEL +
    pixelInTile.x * OFFSET * SLICES_PER_PIXEL +
    sliceIdx * OFFSET +
    ${MEMORY_PROCESSOR_OFFSET()}
  );
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

fn _clearSlicesHeadPtrs(pixelInTilePos: vec2u, processorId: u32) {
  for (var s: u32 = 0u; s < SLICES_PER_PIXEL; s += 1u) {
    _clearSliceHeadPtr(processorId, pixelInTilePos, s);
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
 * I did try other memory access patterns (memory offsets per processor),
 * but it wasn't faster. You would also need to implement sorted tile queue
 * to balance workload for all tiles in a workgroup.
 *
 * The memory is per-processor, so we do not need atomics.
 */
const BUFFER_HAIR_SLICES_HEADS_GLOBAL = (
  bindingIdx: number,
  access: 'read_write'
) => /* wgsl */ `


@group(0) @binding(${bindingIdx})
var<storage, ${access}> _hairSliceHeads: array<u32>;

${SHARED_UTILS}
`;

///////////////////////////
/// SHADER CODE - LOCAL MEMORY
///////////////////////////

const LOCAL_MEMORY_ACCESS =
  SLICE_HEADS_MEMORY === 'workgroup' ? 'workgroup' : 'private';
const LOCAL_MEMORY_SIZE =
  SLICE_HEADS_MEMORY === 'workgroup'
    ? ENTRIES_PER_PROCESSOR * WORKGROUP_SIZE
    : ENTRIES_PER_PROCESSOR;

const BUFFER_HAIR_SLICES_HEADS_LOCAL = (
  _bindingIdx: number,
  _access: 'read_write'
) => /* wgsl */ `

var<${LOCAL_MEMORY_ACCESS}> _hairSliceHeads: array<u32, ${LOCAL_MEMORY_SIZE}u>;

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
    size: Math.max(size, WEBGPU_MINIMAL_BUFFER_SIZE),
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
}

function createHairSlicesHeadsBuffer_LOCAL(_device: GPUDevice): undefined {
  calcMemoryReqs();
  return undefined;
}

export const createHairSlicesHeadsBuffer: Allocator =
  SLICE_HEADS_MEMORY === 'global'
    ? createHairSlicesHeadsBuffer_GLOBAL
    : createHairSlicesHeadsBuffer_LOCAL;

function calcMemoryReqs() {
  const { processorCount } = CONFIG.hairRender;

  const entries = processorCount * ENTRIES_PER_PROCESSOR;
  const bytesPerEntry = BYTES_U32;
  const size = entries * bytesPerEntry;

  const memRegionNames: Record<SliceHeadsMemory, string> = {
    global: 'VRAM',
    workgroup: 'WKGRP',
    registers: 'REGS',
  };
  const memRegionName = memRegionNames[SLICE_HEADS_MEMORY];

  STATS.update('Slices heads', `${memRegionName} ${formatBytes(size)}`);
  STATS.update(
    ' \\ Per processor',
    formatBytes(ENTRIES_PER_PROCESSOR * bytesPerEntry)
  );

  return size;
}
