// NOTE: we don't have to use atomics here, as each point has own thread.
// This also means we can just use normal floats!
export const BUFFER_GRID_DENSITY_GRADIENT_AND_WIND = (
  bindingIdx: number,
  access: 'read_write' | 'read'
) => /* wgsl */ `

struct DensityGradAndWind {
  densityGrad: vec3f,
  windStrength: f32, // we know direction from uniforms
}

@group(0) @binding(${bindingIdx})
var<storage, ${access}> _gridDensityGradAndWindVelocity: array<DensityGradAndWind>;

${access === 'read_write' ? setterFn() : ''}



fn _getGridDensityGradAndWind(
  gridBoundsMin: vec3f,
  gridBoundsMax: vec3f,
  p: vec3f
) -> DensityGradAndWind {
  // get coords
  let co = _getGridCell(gridBoundsMin, gridBoundsMax, p);
  var result = DensityGradAndWind(vec3f(0.0), 0.0);

  // gather results from all 8 cell-points around
  // dbg: cellMax = cellMin; - only the min cell
  for (var z = co.cellMin.z; z <= co.cellMax.z; z += 1u) {
  for (var y = co.cellMin.y; y <= co.cellMax.y; y += 1u) {
  for (var x = co.cellMin.x; x <= co.cellMax.x; x += 1u) {
    let cellCorner = vec3u(x, y, z);
    let cornerWeights = _getGridCellWeights(cellCorner, co.pInGrid);
    let value = _getGridDensityGradAndWindAtPoint(cellCorner);

    // load
    result.densityGrad  += cornerWeights * value.densityGrad;
    result.windStrength += _getGridCellWeight(cornerWeights) * value.windStrength;
  }}}

  return result;
}


fn _getGridDensityGradAndWindAtPoint(p: vec3u) -> DensityGradAndWind {
  let idx = _getGridIdx(p);
  return _gridDensityGradAndWindVelocity[idx];
}

`;

function setterFn() {
  return /* wgsl */ `

  fn _setGridDensityGradAndWind(
    p: vec3u,
    densityGrad: vec3f,
    windStrength: f32
  ) {
    let idx = _getGridIdx(p);
    _gridDensityGradAndWindVelocity[idx] = DensityGradAndWind(
      densityGrad,
      windStrength,
    );
  }

  `;
}
