import { BYTES_U32, CONFIG } from '../../../constants.ts';
import { STATS } from '../../../sys_web/stats.ts';
import { formatBytes } from '../../../utils/string.ts';
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

/**
 * Memory pool for slice data. Each processor contains own subregion
 * to make it easier to free() the memory between tiles. Each slice
 * data contains color and a pointer to next entry.
 */
export const BUFFER_HAIR_SLICES_DATA = (
  bindingIdx: number,
  access: 'read_write'
) => /* wgsl */ `

const SLICE_DATA_PER_PROCESSOR_COUNT = ${SLICE_DATA_PER_PROCESSOR_COUNT}u;

struct SliceData {
  value: vec4u,
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
  let value = vec4u(
    pack2x16float(color.rg),
    pack2x16float(color.ba),
    previousPtr,
    0u
  );
  _hairSliceData[offset].value = value;
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
  (*data).value = _hairSliceData[offset].value;
  return true;
}
`;

///////////////////////////
/// GPU BUFFER
///////////////////////////

export function createHairSlicesDataBuffer(device: GPUDevice): GPUBuffer {
  const { processorCount } = CONFIG.hairRender;
  const entries = SLICE_DATA_PER_PROCESSOR_COUNT * processorCount;
  const bytesPerEntry = 4 * BYTES_U32;
  const size = Math.max(entries * bytesPerEntry, WEBGPU_MINIMAL_BUFFER_SIZE);
  STATS.update('Slices data', formatBytes(size));

  return device.createBuffer({
    label: `hair-slices-data`,
    size,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
}
