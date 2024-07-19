import { BYTES_U32, CONFIG } from '../../../constants.ts';
import { WEBGPU_MINIMAL_BUFFER_SIZE } from '../../../utils/webgpu.ts';
import { getTileCount } from './hairTilesResultBuffer.ts';
import { Dimensions } from '../../../utils/index.ts';

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
  let fragIndex = atomicAdd(&_drawnHairSegments.drawnSegmentsCount, 1u) + 1;

  // If we run out of space to store the fragments, we just lose them
  if (fragIndex < maxDrawnSegments) {
    let lastHead = atomicExchange(&_hairTilesResult[tileIdx].tileSegmentPtr, fragIndex);
    let encodedSegment = (segmentIdx << 24) | strandIdx;
    _drawnHairSegments.data[fragIndex].strandAndSegmentIdxs = encodedSegment;
    _drawnHairSegments.data[fragIndex].next = lastHead;
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

  let data = _drawnHairSegments.data[tileSegmentPtr];
  (*result).x = data.strandAndSegmentIdxs & 0x00ffffff;
  (*result).y = data.strandAndSegmentIdxs >> 24;
  (*result).z = data.next;
  return true;
}
`;

export const BUFFER_HAIR_SEGMENTS_PER_TILE = (
  bindingIdx: number,
  access: 'read_write' | 'read'
) => /* wgsl */ `

struct LinkedListElement {
  strandAndSegmentIdxs: u32,
  /** if this is 0, then end of list */
  next: u32
};

struct DrawnHairSegments {
  drawnSegmentsCount: ${access === 'read_write' ? 'atomic<u32>' : 'u32'},
  data: array<LinkedListElement>
};

@group(0) @binding(${bindingIdx})
var<storage, ${access}> _drawnHairSegments: DrawnHairSegments;


${access == 'read_write' ? storeTileSegment : getTileSegment}
`;

///////////////////////////
/// GPU BUFFER
///////////////////////////

export function getLengthOfHairSegmentsPerTileBuffer(viewportSize: Dimensions) {
  const tileCount = getTileCount(viewportSize);
  const cnt = Math.ceil(
    tileCount.width * tileCount.height * CONFIG.hairRender.avgSegmentsPerTile
  );
  return 1 + cnt;
}

export function createHairSegmentsPerTileBuffer(
  device: GPUDevice,
  viewportSize: Dimensions
): GPUBuffer {
  const entries = getLengthOfHairSegmentsPerTileBuffer(viewportSize);
  const bytesPerEntry = 2 * BYTES_U32;

  return device.createBuffer({
    label: `hair-segments-per-tile`,
    size: Math.max(entries * bytesPerEntry, WEBGPU_MINIMAL_BUFFER_SIZE),
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
}
