export const GRID_FLOAT_TO_U32_MUL = 1000000.0;

export const GRID_UTILS = (dims: number) => /* wgsl */ `

// There are no float atomics in WGSL. Convert to i32
const GRID_FLOAT_TO_U32_MUL: f32 = ${GRID_FLOAT_TO_U32_MUL};
fn gridEncodeValue(v: f32) -> i32 { return i32(v * GRID_FLOAT_TO_U32_MUL); }
fn gridDecodeValue(v: i32) -> f32 { return f32(v) / GRID_FLOAT_TO_U32_MUL; }


fn _getGridIdx(p: vec3u) -> u32 {
  let GRID_DIMS: u32 = ${dims}u;
  return (
    clamp(p.z, 0u, GRID_DIMS - 1u) * GRID_DIMS * GRID_DIMS +
    clamp(p.y, 0u, GRID_DIMS - 1u) * GRID_DIMS +
    clamp(p.x, 0u, GRID_DIMS - 1u)
  );
}

struct GridCoordinates {
  // XYZ of the 'lower' cell-cube corner. E.g [0, 1, 2]
  cellMin: vec3u,
   // XYZ of the 'upper' cell-cube corner. E.g [1, 2, 3]
   // Effectively $cellMin + (1,1,1)$
  cellMax: vec3u,
  // provided point $p in grid coordinates. E.g. [1.1, 2.4, 3.4]
  pInGrid: vec3f
}


fn _getGridCell(
  gridBoundsMin: vec3f,
  gridBoundsMax: vec3f,
  p: vec3f,
) -> GridCoordinates {
  let GRID_DIMS: u32 = ${dims}u;
  var t: vec3f = saturate(
    (p - gridBoundsMin) / (gridBoundsMax - gridBoundsMin)
  );
  var r: GridCoordinates;
  r.pInGrid = t * f32(GRID_DIMS - 1u);
  r.cellMin = vec3u(floor(t * f32(GRID_DIMS - 1u)));
  r.cellMax = vec3u( ceil(t * f32(GRID_DIMS - 1u)));
  return r;
}

fn _getGridCellWeights(
  cellCornerCo: vec3u,
  originalPoint: vec3f,
) -> vec3f {
  let w_x = clamp(1.0 - f32(abs(originalPoint.x - f32(cellCornerCo.x))), 0.0, 1.0);
  let w_y = clamp(1.0 - f32(abs(originalPoint.y - f32(cellCornerCo.y))), 0.0, 1.0);
  let w_z = clamp(1.0 - f32(abs(originalPoint.z - f32(cellCornerCo.z))), 0.0, 1.0);
  return vec3f(w_x, w_y, w_z);
}

`;
