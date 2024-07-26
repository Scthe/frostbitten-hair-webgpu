import { BYTES_U32, CONFIG } from '../../../constants.ts';
import { WEBGPU_MINIMAL_BUFFER_SIZE, u32_type } from '../../../utils/webgpu.ts';
import { getTileCount } from './hairTilesResultBuffer.ts';
import { Dimensions } from '../../../utils/index.ts';
import { STATS } from '../../../stats.ts';
import { formatBytes } from '../../../utils/string.ts';

/*
https://webgpu.github.io/webgpu-samples/?sample=a-buffer#translucent.wgsl
*/

///////////////////////////
/// SHADER CODE
///////////////////////////

const storeTileSegment = /* wgsl */ `

fn _storeTileSegment(
  nextPtr: u32, prevPtr: u32,
  strandIdx: u32, segmentIdx: u32
) {
  let encodedSegment = (segmentIdx << 24) | strandIdx;
  _hairTileSegments.data[nextPtr].strandAndSegmentIdxs = encodedSegment;
  _hairTileSegments.data[nextPtr].next = prevPtr;
}
`;

const getTileSegment = /* wgsl */ `

fn _getTileSegment(
  maxDrawnSegments: u32,
  tileSegmentPtr: u32,
  /** strandIdx, segmentIdx, nextPtr */
  result: ptr<function, vec3u>
) -> bool {
  if (tileSegmentPtr >= maxDrawnSegments || tileSegmentPtr == INVALID_TILE_SEGMENT_PTR) {
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

  const extraUsage = CONFIG.isTest ? GPUBufferUsage.COPY_SRC : 0; // for stats, debug etc.
  return device.createBuffer({
    label: `hair-segments-per-tile`,
    size,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | extraUsage,
  });
}
