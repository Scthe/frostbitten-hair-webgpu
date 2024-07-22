import { BYTES_U32, CONFIG } from '../../../constants.ts';
import { STATS } from '../../../sys_web/stats.ts';
import { Dimensions, divideCeil } from '../../../utils/index.ts';
import { formatBytes } from '../../../utils/string.ts';
import { u32_type } from '../../../utils/webgpu.ts';

///////////////////////////
/// SHADER CODE
///////////////////////////

const storeTileDepth = /* wgsl */ `

fn _storeTileDepth(viewportSize: vec2u, posPx: vec2u, depth: f32) {
  if(
    posPx.x < 0 || posPx.x >= viewportSize.x ||
    posPx.y < 0 || posPx.y >= viewportSize.y
  ) { return; }

  // TODO low precision. Convert this into 0-1 inside the bounding sphere and then quantisize
  let depthU32 = u32(depth * f32(MAX_U32));
  let depthU32_Inv = MAX_U32 - depthU32;


  let tileIdx: u32 = _getHairTileIdx(viewportSize, posPx);
  atomicMax(&_hairTilesResult[tileIdx].maxDepth, depthU32);
  // WebGPU clears to 0. So atomicMin is pointless..
  atomicMax(&_hairTilesResult[tileIdx].minDepth, depthU32_Inv);
}
`;

const getTileDepth = /* wgsl */ `

fn _getTileDepth(viewportSize: vec2u, posPx: vec2u) -> vec2f {
  let tileIdx: u32 = _getHairTileIdx(viewportSize, posPx);
  let tile = _hairTilesResult[tileIdx];
  return vec2f(
    f32(MAX_U32 - tile.minDepth) / f32(MAX_U32),
    f32(tile.maxDepth) / f32(MAX_U32)
  );
}

fn _getTileSegmentPtr(viewportSize: vec2u, posPx: vec2u) -> u32 {
  let tileIdx: u32 = _getHairTileIdx(viewportSize, posPx);
  let tile = _hairTilesResult[tileIdx];
  return tile.tileSegmentPtr;
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

struct HairTileResult {
  minDepth: ${u32_type(access)},
  maxDepth: ${u32_type(access)},
  /** if this is 0, then end of list */
  tileSegmentPtr: ${u32_type(access)},
}

@group(0) @binding(${bindingIdx})
var<storage, ${access}> _hairTilesResult: array<HairTileResult>;

fn _getHairTileIdx(viewportSize: vec2u, posPx: vec2u) -> u32 {
  let tileCount = getTileCount(viewportSize);
  let x = posPx.x / TILE_SIZE;
  let y = posPx.y / TILE_SIZE;
  return y * tileCount.x + x;
}

fn getTileCount(viewportSize: vec2u) -> vec2u {
  return vec2u(divideCeil(viewportSize.x, TILE_SIZE), divideCeil(viewportSize.y, TILE_SIZE));
}

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
  console.log(`Creating hair tiles buffer: ${tileCount.width}x${tileCount.height} tiles`); // prettier-ignore
  STATS.update('Tiles', `${tileCount.width} x ${tileCount.height}`);

  const pixels = tileCount.width * tileCount.height;
  const bytesPerPixel = 3 * BYTES_U32;
  const size = pixels * bytesPerPixel;
  STATS.update('Tiles heads', formatBytes(size));

  const extraUsage = CONFIG.isTest ? GPUBufferUsage.COPY_SRC : 0; // for stats, debug etc.
  return device.createBuffer({
    label: `hair-tiles-result`,
    size,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | extraUsage,
  });
}
