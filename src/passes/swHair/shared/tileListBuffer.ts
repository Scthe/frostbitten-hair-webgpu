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
  // processedTiles: u32, // TODO [NO] move here instead of hairTileSegmentsBuffer? Or is it better if fine pass stays read-only there?
  data: array<u32>, // tileIds
}

@group(0) @binding(${bindingIdx})
var<storage, ${access}> _hairTileData: TilesList;
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

  const extraUsage = CONFIG.isTest ? GPUBufferUsage.COPY_SRC : 0;

  return device.createBuffer({
    label: `hair-tile-list`,
    size: entries * BYTES_U32,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | extraUsage,
  });

  /*const data = new Uint32Array(tileCount + 1);
  data[0] = tileCount;
  for (let i = 0; i < tileCount; i++) {
    data[i + 1] = i;
  }

  return createGPU_StorageBuffer(device, `hair-tile-list`, data);*/
}

export function parseTileList(data: Uint32Array) {
  return {
    drawnTiles: data[0],
    data: Array(...data.slice(1, 1 + data[0])) as number[],
  };
}
