import { BYTES_U32, BYTES_VEC4, CONFIG } from '../../../constants.ts';
import { WEBGPU_MINIMAL_BUFFER_SIZE } from '../../../utils/webgpu.ts';

///////////////////////////
/// SHADER CODE
///
/// We also have to split whole memory into per-processor subregions
/// as the free() is impossible to implement otherwise.
/// Once processor moves to another tile, all memory alloc.
/// from previous tile does not matter.
///////////////////////////

const cfgHair = CONFIG.hairRender;
const SLICE_DATA_PER_PROCESSOR_COUNT =
  cfgHair.avgFragmentsPerSlice *
  cfgHair.slicesPerPixel *
  cfgHair.tileSize *
  cfgHair.tileSize;

export const BUFFER_HAIR_SLICES_DATA = (
  bindingIdx: number,
  access: 'read_write'
) => /* wgsl */ `

const SLICE_DATA_PER_PROCESSOR_COUNT = ${SLICE_DATA_PER_PROCESSOR_COUNT}u;

struct SliceData {
  // TODO alignment is terrible, padding wastes nigh-50% of the space
  color: vec4f,
  nextPtr: u32,
  padding0: u32,
  padding1: u32,
  padding2: u32,
}

@group(0) @binding(${bindingIdx})
var<storage, ${access}> _hairSliceData: array<SliceData>;

fn _getSliceDataProcessorOffset(processorId: u32) -> u32 {
  return processorId * SLICE_DATA_PER_PROCESSOR_COUNT;
}

fn _hasMoreSliceDataSlots(slicePtr: u32) -> bool {
  return slicePtr < SLICE_DATA_PER_PROCESSOR_COUNT;
}

fn _setSliceData(
  processorId: u32,
  slicePtr: u32,
  color: vec4f, previousPtr: u32 // both are data to be written
) {
  let offset = _getSliceDataProcessorOffset(processorId) + slicePtr;
  _hairSliceData[offset].color = color;
  _hairSliceData[offset].nextPtr = previousPtr;
}

fn _getSliceData(
  processorId: u32,
  slicePtr: u32,
  data: ptr<function, SliceData>
) -> bool {
  if (
    slicePtr == INVALID_SLICE_DATA_PTR || 
    slicePtr >= SLICE_DATA_PER_PROCESSOR_COUNT
  ) { return false; }
  
  let offset = _getSliceDataProcessorOffset(processorId) + slicePtr;
  (*data).color = _hairSliceData[offset].color;
  (*data).nextPtr = _hairSliceData[offset].nextPtr;
  return true;
  // return false;
}
`;

///////////////////////////
/// GPU BUFFER
///////////////////////////

export function createHairSlicesDataBuffer(device: GPUDevice): GPUBuffer {
  const { processorCount } = CONFIG.hairRender;
  const entries = SLICE_DATA_PER_PROCESSOR_COUNT * processorCount;
  const bytesPerEntry = BYTES_VEC4 + 4 * BYTES_U32;

  return device.createBuffer({
    label: `hair-slices-ppll-data`,
    size: Math.max(entries * bytesPerEntry, WEBGPU_MINIMAL_BUFFER_SIZE),
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
}
