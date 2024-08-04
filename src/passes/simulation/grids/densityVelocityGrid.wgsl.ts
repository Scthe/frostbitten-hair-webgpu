import { i32_type } from '../../../utils/webgpu.ts';

export const BUFFER_GRID_DENSITY_VELOCITY = (
  bindingIdx: number,
  access: 'read_write' | 'read'
) => /* wgsl */ `

struct DensityVelocityI32 {
  velocityX: ${i32_type(access)},
  velocityY: ${i32_type(access)},
  velocityZ: ${i32_type(access)},
  density: ${i32_type(access)},
}

@group(0) @binding(${bindingIdx})
var<storage, ${access}> _gridDensityVelocity: array<DensityVelocityI32>;

${access === 'read' ? gridRead() : gridWrite()}

fn _getDensityWeight(cellW: vec3f) -> f32 {
  return length(cellW);
}

`;

function gridRead() {
  return /* wgsl */ `

  struct DensityVelocity {
    velocity: vec3f,
    density: f32,
  }

  fn _getGridDensityVelocity(
    gridBoundsMin: vec3f,
    gridBoundsMax: vec3f,
    p: vec3f
  ) -> DensityVelocity {
    // get coords
    let co = _getGridCell(gridBoundsMin, gridBoundsMax, p);
    var result = DensityVelocity(vec3f(0.0), 0.0);
  
    // gather results from all 8 cell-points around
    // dbg: cellMax = cellMin; - only the min cell
    for (var z = co.cellMin.z; z <= co.cellMax.z; z += 1u) {
    for (var y = co.cellMin.y; y <= co.cellMax.y; y += 1u) {
    for (var x = co.cellMin.x; x <= co.cellMax.x; x += 1u) {
      let cellCorner = vec3u(x, y, z);
      let idx = _getGridIdx(cellCorner);
      let cornerWeights = _getGridCellWeights(cellCorner, co.pInGrid);
  
      // load
      let value = _gridDensityVelocity[idx];
      result.velocity.x += cornerWeights.x * gridDecodeValue(value.velocityX);
      result.velocity.y += cornerWeights.y * gridDecodeValue(value.velocityY);
      result.velocity.z += cornerWeights.z * gridDecodeValue(value.velocityZ);
      result.density += _getDensityWeight(cornerWeights) * gridDecodeValue(value.density); // not amazing, but..
      // result.density += cornerWeights.x * select(0., 1., x == 1u); // dbg:  NOTE: this samples 4 points (see y,z-axis) so the gradient is a bit strong
    }}}
  
    // dbg:
    /*// let idx = _getGridIdx(cellMax);
    // let idx = _getGridIdx(cellMin);
    // let idx = 0; // remember, this is cell idx, not u32's offset!
    // let idx = clamp(cellMax.x, 0u, GRID_DIMS - 1u);
    // let value: vec4i = _gridDensityVelocity[idx];
    // result.density = select(0.0, 1.0, value.w != 0);
    // result.density = select(0.0, 1.0, idx == 3u);
    // result.density = select(0.0, 1.0, result.density >= 4);
    // result.density = select(0.0, 1.0, cellMin.x == 2u);
    // result.density = select(0.0, 1.0, cellMax.x == 3u);
    var t: vec3f = saturate((p - gridBoundsMin) / (gridBoundsMax - gridBoundsMin));
    result.density = select(0.0, 1.0, t.z > 0.5); // dbg: mock*/
    return result;
  }

  `;
}

function gridWrite() {
  return /* wgsl */ `

  fn _addGridDensityVelocity(
    gridBoundsMin: vec3f,
    gridBoundsMax: vec3f,
    p: vec3f,
    velocity: vec3f
  ) {
    // get coords
    let co = _getGridCell(gridBoundsMin, gridBoundsMax, p);
  
    // store into all 8 cell-points around
    for (var z = co.cellMin.z; z <= co.cellMax.z; z += 1u) {
    for (var y = co.cellMin.y; y <= co.cellMax.y; y += 1u) {
    for (var x = co.cellMin.x; x <= co.cellMax.x; x += 1u) {
      let cellCorner = vec3u(x, y, z);
      let idx = _getGridIdx(cellCorner);
      let cornerWeights = _getGridCellWeights(cellCorner, co.pInGrid);
  
      // store
      // velocity
      let cellVelocity: vec3f = velocity * cornerWeights;
      var value: i32 = gridEncodeValue(cellVelocity.x);
      atomicAdd(&_gridDensityVelocity[idx].velocityX, value);
      value = gridEncodeValue(cellVelocity.y);
      atomicAdd(&_gridDensityVelocity[idx].velocityY, value);
      value = gridEncodeValue(cellVelocity.z);
      atomicAdd(&_gridDensityVelocity[idx].velocityZ, value);
      // density
      let density = _getDensityWeight(cornerWeights);
      value = gridEncodeValue(density);
      atomicAdd(&_gridDensityVelocity[idx].density, value);
    }}}
  }

  `;
}
