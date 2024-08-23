import { BYTES_U32, CONFIG } from '../../../constants.ts';
import { Dimensions } from '../../../utils/index.ts';
import { StorageAccess, u32_type } from '../../../utils/webgpu.ts';
import { getTileCount } from './utils.ts';

///////////////////////////
/// SHADER CODE
///////////////////////////

export const BUFFER_TILE_LIST = (
  bindingIdx: number,
  access: StorageAccess
) => /* wgsl */ `

struct TilesList {
  drawnTiles: ${u32_type(access)},
  // processedTiles: u32, // TODO move here instead of hairTileSegmentsBuffer? Or is it better if fine pass stays read-only there?
  data: array<u32>, // tileIds
}

@group(0) @binding(${bindingIdx})
var<storage, ${access}> _hairTileData: TilesList;

${access == 'read_write' ? addTileToTaskQueue : getNextTileToProcess}
`;

const addTileToTaskQueue = /* wgsl */ `
  fn _addTileToTaskQueue(tileIdx: u32) {
    let writeIdx = atomicAdd(&_hairTileData.drawnTiles, 1u);
    _hairTileData.data[writeIdx] = tileIdx;
  }
`;

const getNextTileToProcess = /* wgsl */ `
  fn _getNextTileIdx(tileCount: u32) -> u32 {
    // we could do 'atomicAdd(_, 1)' on each thread. But which thread in wkgrp
    // receives the smallest value? It is the one that decides if we are done.
    // 'atomicAdd(_, 1)' does not give us guarantee inside wkgrp. And clever ways
    // to find this are more complicated then the following code.
    if (_local_invocation_index == 0u) {
      let wkgrpThreadCnt = ${CONFIG.hairRender.finePassWorkgroupSizeX}u;
      _tileStartOffset = atomicAdd(&_hairRasterizerResults.tileQueueAtomicIdx, wkgrpThreadCnt);
      _isDone = _tileStartOffset >= tileCount;
    }
  
    // workgroupUniformLoad() has implicit barrier
    let tileStartOffset = workgroupUniformLoad(&_tileStartOffset);
    let idx =  tileStartOffset + _local_invocation_index;
    return _hairTileData.data[idx];
  }
`;

///////////////////////////
/// GPU BUFFER
///////////////////////////

export function createHairTileListBuffer(
  device: GPUDevice,
  viewportSize: Dimensions
): GPUBuffer {
  const tileCount2d = getTileCount(viewportSize);
  const tileCount = tileCount2d.width * tileCount2d.height;

  // 4 cause I will probably forget to inc. this if I add more fields
  const entries = 4 + tileCount;

  return device.createBuffer({
    label: `hair-tile-list`,
    size: entries * BYTES_U32,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });

  /*const data = new Uint32Array(tileCount + 1);
  data[0] = tileCount;
  for (let i = 0; i < tileCount; i++) {
    data[i + 1] = i;
  }

  return createGPU_StorageBuffer(device, `hair-tile-list`, data);*/
}
