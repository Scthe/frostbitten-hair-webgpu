import { BYTES_U32, CONFIG } from '../../../constants.ts';
import { Dimensions, divideCeil } from '../../../utils/index.ts';

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

export const BUFFER_HAIR_TILES_RESULT = (
  bindingIdx: number,
  access: 'read_write' | 'read'
) => /* wgsl */ `

const MAX_U32: u32 = 0xffffffffu;

struct HairTileResult {
  minDepth: ${access === 'read_write' ? 'atomic<u32>' : 'u32'},
  maxDepth: ${access === 'read_write' ? 'atomic<u32>' : 'u32'},
  /** if this is 0, then end of list */
  tileSegmentPtr: ${access === 'read_write' ? 'atomic<u32>' : 'u32'},
}

@group(0) @binding(${bindingIdx})
var<storage, ${access}> _hairTilesResult: array<HairTileResult>;

fn _getHairTileIdx(viewportSize: vec2u, posPx: vec2u) -> u32 {
  let TILE_SIZE: u32 = ${CONFIG.hairRender.tileSize}u;
  let tilesInARow = divideCeil(viewportSize.x, TILE_SIZE);
  let x = divideCeil(posPx.x, TILE_SIZE);
  // let y = viewportSize.y - posPx.y; // invert cause WebGPU coordinates
  let y = divideCeil(posPx.y, TILE_SIZE);
  return y * tilesInARow + x;
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
  const pixels = tileCount.width * tileCount.height;
  const bytesPerPixel = 3 * BYTES_U32;
  console.log(`Creating hair tiles buffer: ${tileCount.width}x${tileCount.height} tiles`); // prettier-ignore

  const extraUsage = CONFIG.isTest ? GPUBufferUsage.COPY_SRC : 0; // for stats, debug etc.
  return device.createBuffer({
    label: `hair-tiles-result-${viewportSize.width}x${viewportSize.height}`,
    size: pixels * bytesPerPixel,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | extraUsage,
  });
}
