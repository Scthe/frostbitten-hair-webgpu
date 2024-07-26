import { BYTES_F32, BYTES_U32, CONFIG } from '../../../constants.ts';
import { STATS } from '../../../stats.ts';
import { Dimensions, divideCeil } from '../../../utils/index.ts';
import { formatBytes } from '../../../utils/string.ts';
import { u32_type } from '../../../utils/webgpu.ts';

const TILES_BIN_COUNT = CONFIG.hairRender.tileDepthBins;

///////////////////////////
/// SHADER CODE
///////////////////////////

const storeTileDepth = /* wgsl */ `

fn _storeTileHead(
  viewportSize: vec2u,
  tileXY: vec2u, depthBin: u32,
  depthMin: f32, depthMax: f32,
  nextPtr: u32
) -> u32 {
  let tileIdx: u32 = getHairTileIdx(viewportSize, tileXY);
  
  // store depth
  // TODO low precision. Convert this into 0-1 inside the bounding sphere and then quantisize
  let depthMax_U32 = u32(depthMax * f32(MAX_U32));
  // WebGPU clears to 0. So atomicMin() is pointless. Use atomicMax() with inverted values instead
  let depthMin_U32 = u32((1.0 - depthMin) * f32(MAX_U32));
  atomicMax(&_hairTilesResult[tileIdx].maxDepth, depthMax_U32);
  atomicMax(&_hairTilesResult[tileIdx].minDepth, depthMin_U32);

  let lastHeadPtr = atomicExchange(
    &_hairTilesResult[tileIdx].tileSegmentPtr[depthBin],
    nextPtr + 1u
  );

  // there is no ternary in WGSL. There is select(). It was designed by someone THAT HAS NEVER WRITTEN A LINE OF CODE IN THEIR LIFE. I.N.C.O.M.P.E.T.E.N.C.E.
  if (lastHeadPtr == 0u) { return INVALID_TILE_SEGMENT_PTR; } // we add +1 on write to detect never modified ptrs
  return lastHeadPtr - 1u;
}
`;

const getTileDepth = /* wgsl */ `

fn _getTileDepth(viewportSize: vec2u, tileXY: vec2u) -> vec2f {
  let tileIdx: u32 = getHairTileIdx(viewportSize, tileXY);
  let tile = _hairTilesResult[tileIdx];
  return vec2f(
    f32(MAX_U32 - tile.minDepth) / f32(MAX_U32),
    f32(tile.maxDepth) / f32(MAX_U32)
  );
}

fn _getTileSegmentPtr(viewportSize: vec2u, tileXY: vec2u, depthBin: u32) -> u32 {
  let tileIdx: u32 = getHairTileIdx(viewportSize, tileXY);
  let myPtr = _hairTilesResult[tileIdx].tileSegmentPtr[depthBin];
  return myPtr - 1u;
}

`;

/**
 * For each tile contains:
 * - min and max depth
 * - pointer into the tile segments buffer
 */
export const BUFFER_HAIR_TILES_RESULT = (
  bindingIdx: number,
  access: 'read_write' | 'read'
) => /* wgsl */ `

const MAX_U32: u32 = 0xffffffffu;
const INVALID_TILE_SEGMENT_PTR: u32 = 0xffffffffu;
const TILES_BIN_COUNT = ${TILES_BIN_COUNT}u;

struct HairTileResult {
  minDepth: ${u32_type(access)},
  maxDepth: ${u32_type(access)},
  tileSegmentPtr: array<${u32_type(access)}, TILES_BIN_COUNT>,
}

@group(0) @binding(${bindingIdx})
var<storage, ${access}> _hairTilesResult: array<HairTileResult>;

${access == 'read_write' ? storeTileDepth : getTileDepth}
`;

///////////////////////////
/// GPU BUFFER
///////////////////////////

export const getTileCount = (viewportSize: Dimensions): Dimensions => {
  const { tileSize } = CONFIG.hairRender;
  return {
    width: divideCeil(viewportSize.width, tileSize),
    height: divideCeil(viewportSize.height, tileSize),
  };
};

export function createHairTilesResultBuffer(
  device: GPUDevice,
  viewportSize: Dimensions
): GPUBuffer {
  const tileCount = getTileCount(viewportSize);
  console.log(`Creating hair tiles buffer: ${tileCount.width}x${tileCount.height}x${TILES_BIN_COUNT} tiles`); // prettier-ignore
  STATS.update(
    'Tiles',
    `${tileCount.width} x ${tileCount.height} x ${TILES_BIN_COUNT}`
  );

  const entries = tileCount.width * tileCount.height;
  const bytesPerEntry = 2 * BYTES_F32 + TILES_BIN_COUNT * BYTES_U32;
  const size = entries * bytesPerEntry;
  STATS.update('Tiles heads', formatBytes(size));

  const extraUsage = CONFIG.isTest ? GPUBufferUsage.COPY_SRC : 0; // for stats, debug etc.
  return device.createBuffer({
    label: `hair-tiles-result`,
    size,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | extraUsage,
  });
}
