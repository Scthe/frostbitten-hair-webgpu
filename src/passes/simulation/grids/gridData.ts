import { vec3 } from 'wgpu-matrix';
import { BYTES_VEC4, CONFIG, GridDebugValue } from '../../../constants.ts';
import { BoundingBox, scaleBoundingBox } from '../../../utils/bounds.ts';
import {
  WEBGPU_MINIMAL_BUFFER_SIZE,
  bindBuffer,
  createGPU_StorageBuffer,
} from '../../../utils/webgpu.ts';
import { TypedArrayView } from '../../../utils/typedArrayView.ts';
import { GRID_FLOAT_TO_U32_MUL } from './grids.wgsl.ts';
import { STATS } from '../../../stats.ts';
import { formatBytes } from '../../../utils/string.ts';

export class GridData {
  public static GRID_DATA_SNIPPET = /* wgsl */ `

  struct GridData {
    boundsMin: vec4f,
    boundsMax: vec3f,
    debugDisplayValue: u32, // also encodes if abs the value
  }
  
  fn getGridDebugDepthSlice() -> f32 {
    let FLOAT_EPSILON: f32 = 1e-7;
    return clamp(_uniforms.gridData.boundsMin.w, FLOAT_EPSILON, 1.0 - FLOAT_EPSILON);
  }
  `;
  public static BUFFER_SIZE = 2 * BYTES_VEC4;

  private readonly densityVelocityBuffer: GPUBuffer;
  private readonly densityGradAndWindBuffer: GPUBuffer;
  public readonly bounds: BoundingBox;

  constructor(device: GPUDevice, bounds_: BoundingBox) {
    this.bounds = scaleBoundingBox(
      bounds_,
      CONFIG.hairSimulation.physicsForcesGrid.scale
    );
    if (CONFIG.isTest) {
      this.densityVelocityBuffer = undefined!;
      this.densityGradAndWindBuffer = undefined!;
      return;
    }

    const dims = CONFIG.hairSimulation.physicsForcesGrid.dims;
    const [boundsMin, boundsMax] = this.bounds;
    const size = vec3.subtract(boundsMax, boundsMin);
    const cellSize = vec3.scale(size, 1 / (dims - 1));
    const cellCount = dims * dims * dims;
    console.log(`Physics grid (dims=${dims}x${dims}x${dims}, ${cellCount} points, cellSize=${cellSize}), bounds:`, this.bounds); // prettier-ignore

    this.densityVelocityBuffer = createPhysicsForcesBuffer(
      device,
      'grid-density-velocity',
      dims
    );
    this.densityGradAndWindBuffer = createPhysicsForcesBuffer(
      device,
      'grid-density-grad-and-wind',
      dims
    );
  }

  clearDensityVelocityBuffer(cmdBuf: GPUCommandEncoder) {
    cmdBuf.clearBuffer(
      this.densityVelocityBuffer,
      0,
      this.densityVelocityBuffer.size
    );
  }

  clearDensityGradAndWindBuffer(cmdBuf: GPUCommandEncoder) {
    cmdBuf.clearBuffer(
      this.densityGradAndWindBuffer,
      0,
      this.densityGradAndWindBuffer.size
    );
  }

  bindDensityVelocityBuffer = (bindingIdx: number) =>
    bindBuffer(bindingIdx, this.densityVelocityBuffer);

  bindDensityGradAndWindBuffer = (bindingIdx: number) =>
    bindBuffer(bindingIdx, this.densityGradAndWindBuffer);

  getDebuggedGridBuffer() {
    const v = CONFIG.hairSimulation.physicsForcesGrid.debugValue;
    return v == GridDebugValue.WIND || v == GridDebugValue.DENSITY_GRADIENT
      ? this.densityGradAndWindBuffer
      : this.densityVelocityBuffer;
  }

  writeToDataView(dataView: TypedArrayView) {
    const c = CONFIG.hairSimulation.physicsForcesGrid;
    const [boundsMin, boundsMax] = this.bounds;

    dataView.writeF32(boundsMin[0]);
    dataView.writeF32(boundsMin[1]);
    dataView.writeF32(boundsMin[2]);
    dataView.writeF32(c.debugSlice);

    dataView.writeF32(boundsMax[0]);
    dataView.writeF32(boundsMax[1]);
    dataView.writeF32(boundsMax[2]);
    dataView.writeU32(c.debugValue + (c.debugAbsValue ? 16 : 0));
  }
}

function createPhysicsForcesBuffer(
  device: GPUDevice,
  name: string,
  dims: number
): GPUBuffer {
  const cellCount = dims * dims * dims;
  const intsPerCell = 4;
  const entriesCnt = Math.max(
    WEBGPU_MINIMAL_BUFFER_SIZE,
    cellCount * intsPerCell
  );
  // console.log(`Create density velocity grid. Dims=${dims}x${dims}x${dims} (${cellCount} points)`); // prettier-ignore

  // mock data.
  // Use with CONFIG.hairSimulation.densityVelocityGrid.enableUpdates = false to debug visualization
  const data = new Int32Array(entriesCnt);
  const f32_2_i32 = (x: number) => Math.floor(x * GRID_FLOAT_TO_U32_MUL);
  // const f32_2_i32 = (x: number) => Math.floor(x);

  for (let z = 0; z < dims; z++) {
    for (let y = 0; y < dims; y++) {
      for (let x = 0; x < dims; x++) {
        const idx =
          z * dims * dims + //
          y * dims +
          x;
        // velocity
        // data[4 * idx + 0] = f32_2_i32(z >= 2 ? -1 : 1);
        // data[4 * idx + 1] = f32_2_i32(z >= 2 ? -1 : 1);
        // data[4 * idx + 2] = f32_2_i32(z >= 2 ? -1 : 1);
        // density
        const c = x == 1 || x == 5; // true
        data[4 * idx + 3] = f32_2_i32(c ? 1 : 0);
      }
    }
  }
  // console.log(data);

  const result = createGPU_StorageBuffer(device, name, data);
  STATS.update('Physics grid', '2 * ' + formatBytes(result.size));
  return result;
}
