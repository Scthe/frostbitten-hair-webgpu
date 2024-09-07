import { BYTES_U32 } from '../../../constants.ts';
import { Dimensions } from '../../../utils/index.ts';
import { StorageAccess, u32_type } from '../../../utils/webgpu.ts';
import { getTileCount } from './utils.ts';

///////////////////////////
/// SHADER CODE
///////////////////////////

export const BUFFER_SEGMENT_COUNT_PER_TILE = (
  bindingIdx: number,
  access: StorageAccess
) => /* wgsl */ `

@group(0) @binding(${bindingIdx})
var<storage, ${access}> _hairSegmentCountPerTile: array<${u32_type(access)}>;

${access == 'read_write' ? incTileSegmentCount : ''}
`;

const incTileSegmentCount = /* wgsl */ `
  fn _incTileSegmentCount(viewportSize: vec2u, tileXY: vec2u) {
    let tileIdx = getHairTileIdx(viewportSize, tileXY);
    atomicAdd(&_hairSegmentCountPerTile[tileIdx], 1u);
  }
`;

///////////////////////////
/// GPU BUFFER
///////////////////////////

export function createHairSegmentCountPerTileBuffer(
  device: GPUDevice,
  viewportSize: Dimensions
): GPUBuffer {
  const tileCount = getTileCount(viewportSize);
  const entries = tileCount.width * tileCount.height;
  const size = entries * BYTES_U32;

  return device.createBuffer({
    label: `hair-segment-count-per-tile`,
    size,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
}
