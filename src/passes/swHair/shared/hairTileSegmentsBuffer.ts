import { BYTES_U32, CONFIG } from '../../../constants.ts';
import { WEBGPU_MINIMAL_BUFFER_SIZE, u32_type } from '../../../utils/webgpu.ts';
import { getTileCount } from './hairTilesResultBuffer.ts';
import { Dimensions } from '../../../utils/index.ts';
import { STATS } from '../../../sys_web/stats.ts';
import { formatBytes } from '../../../utils/string.ts';

/*
https://webgpu.github.io/webgpu-samples/?sample=a-buffer#translucent.wgsl
*/

///////////////////////////
/// SHADER CODE
///////////////////////////

const storeTileSegment = /* wgsl */ `

fn _storeTileSegment(
  viewportSize: vec2u, posPx: vec2u,
  maxDrawnSegments: u32,
  strandIdx: u32, segmentIdx: u32
) {
  if(
    posPx.x < 0 || posPx.x >= viewportSize.x ||
    posPx.y < 0 || posPx.y >= viewportSize.y
  ) { return; }

  let tileIdx: u32 = _getHairTileIdx(viewportSize, posPx);

  // '0' denotes end of the list. We skip that cell
  let fragIndex = atomicAdd(&_hairTileSegments.drawnSegmentsCount, 1u) + 1;

  // If we run out of space to store the fragments, we just lose them
  if (fragIndex < maxDrawnSegments) {
    let lastHead = atomicExchange(&_hairTilesResult[tileIdx].tileSegmentPtr, fragIndex);
    let encodedSegment = (segmentIdx << 24) | strandIdx;
    _hairTileSegments.data[fragIndex].strandAndSegmentIdxs = encodedSegment;
    _hairTileSegments.data[fragIndex].next = lastHead;
  }
}
`;

const getTileSegment = /* wgsl */ `

fn _getTileSegment(
  maxDrawnSegments: u32,
  tileSegmentPtr: u32,
  /** strandIdx, segmentIdx, nextPtr */
  result: ptr<function, vec3u>
) -> bool {
  if (tileSegmentPtr >= maxDrawnSegments || tileSegmentPtr == 0) {
    return false;
  }

  let data = _hairTileSegments.data[tileSegmentPtr];
  (*result).x = data.strandAndSegmentIdxs & 0x00ffffff;
  (*result).y = data.strandAndSegmentIdxs >> 24;
  (*result).z = data.next;
  return true;
}
`;

/**
 * Per-tile linked list of packed (strandId, segmentId).
 */
export const BUFFER_HAIR_TILE_SEGMENTS = (
  bindingIdx: number,
  access: 'read_write' | 'read'
) => /* wgsl */ `

struct LinkedListElement {
  strandAndSegmentIdxs: u32,
  /** if this is 0, then end of list */
  next: u32
};

struct DrawnHairSegments {
  drawnSegmentsCount: ${u32_type(access)},
  data: array<LinkedListElement>
};

@group(0) @binding(${bindingIdx})
var<storage, ${access}> _hairTileSegments: DrawnHairSegments;


${access == 'read_write' ? storeTileSegment : getTileSegment}
`;

///////////////////////////
/// GPU BUFFER
///////////////////////////

export function getLengthOfHairTileSegmentsBuffer(viewportSize: Dimensions) {
  const tileCount = getTileCount(viewportSize);
  const cnt = Math.ceil(
    tileCount.width * tileCount.height * CONFIG.hairRender.avgSegmentsPerTile
  );
  return 1 + cnt;
}

export function createHairTileSegmentsBuffer(
  device: GPUDevice,
  viewportSize: Dimensions
): GPUBuffer {
  const entries = getLengthOfHairTileSegmentsBuffer(viewportSize);
  const bytesPerEntry = 2 * BYTES_U32;
  const size = Math.max(entries * bytesPerEntry, WEBGPU_MINIMAL_BUFFER_SIZE);
  STATS.update('Tiles segments', formatBytes(size));

  return device.createBuffer({
    label: `hair-segments-per-tile`,
    size,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
}
