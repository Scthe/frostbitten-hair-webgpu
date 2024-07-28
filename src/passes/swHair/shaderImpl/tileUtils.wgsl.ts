import { CONFIG } from '../../../constants.ts';

export const SHADER_TILE_UTILS = /* wgsl */ `

const TILE_SIZE: u32 = ${CONFIG.hairRender.tileSize}u;
const TILE_DEPTH_BINS_COUNT = ${CONFIG.hairRender.tileDepthBins}u;

fn getTileCount(viewportSize: vec2u) -> vec2u {
  return vec2u(
    divideCeil(viewportSize.x, TILE_SIZE),
    divideCeil(viewportSize.y, TILE_SIZE)
  );
}

fn getHairTileIdx(viewportSize: vec2u, tileXY: vec2u, depthBin: u32) -> u32 {
  let tileCount = getTileCount(viewportSize);
  return (
    tileXY.y * tileCount.x  * TILE_DEPTH_BINS_COUNT +
    tileXY.x * TILE_DEPTH_BINS_COUNT +
    depthBin
  );
}

/** Changes tileIdx into (tileX, tileY) coordinates (NOT IN PIXELS!) */
fn getTileXY(viewportSize: vec2u, tileIdx: u32) -> vec2u {
  let tileCount = getTileCount(viewportSize);
  let row = tileIdx / tileCount.x;
  return vec2u(tileIdx - tileCount.x * row, row);
}

fn getHairTileXY_FromPx(px: vec2u) -> vec2u {
  return vec2u(
    px.x / TILE_SIZE,
    px.y / TILE_SIZE
  );
}

/** Get tile's bounding box IN PIXELS */
fn getTileBoundsPx(viewportSize: vec2u, tileXY: vec2u) -> vec4u {
  let boundsMin = scissorWithViewport(viewportSize, vec2u(
    tileXY.x * TILE_SIZE,
    tileXY.y * TILE_SIZE
  ));
  let boundsMax = scissorWithViewport(viewportSize, vec2u(
    (tileXY.x + 1u) * TILE_SIZE,
    (tileXY.y + 1u) * TILE_SIZE
  ));
  return vec4u(boundsMin, boundsMax);
}

`;
