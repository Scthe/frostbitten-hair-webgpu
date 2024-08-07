import { createGPU_StorageBuffer } from '../../utils/webgpu.ts';

///////////////////////////
/// SHADER CODE
///////////////////////////

/** Access points positions. Read-only */
export const BUFFER_HAIR_POINTS_POSITIONS_R = (
  bindingIdx: number,
  opts: {
    bufferName: string;
    getterName: string;
  }
) => /* wgsl */ `

@group(0) @binding(${bindingIdx})
var<storage, read> ${opts.bufferName}: array<vec4f>;

fn ${opts.getterName}(
  pointsPerStrand: u32,
  strandIdx: u32,
  pointIdx: u32
) -> vec4f {
  return ${opts.bufferName}[strandIdx * pointsPerStrand + pointIdx];
}
`;

/** Used for rendering */
export const BUFFER_HAIR_POINTS_POSITIONS = (bindingIdx: number) =>
  BUFFER_HAIR_POINTS_POSITIONS_R(bindingIdx, {
    bufferName: '_hairPointPositions',
    getterName: '_getHairPointPosition',
  });

/** Access points positions. Read-write */
export const BUFFER_HAIR_POINTS_POSITIONS_RW = (
  bindingIdx: number,
  opts: {
    bufferName: string;
    setterName: string;
    getterName: string;
  }
) => /* wgsl */ `

@group(0) @binding(${bindingIdx})
var<storage, read_write> ${opts.bufferName}: array<vec4f>;

fn ${opts.getterName}(
  pointsPerStrand: u32,
  strandIdx: u32,
  pointIdx: u32
) -> vec4f {
  return ${opts.bufferName}[strandIdx * pointsPerStrand + pointIdx];
}

fn ${opts.setterName}(
  pointsPerStrand: u32,
  strandIdx: u32,
  pointIdx: u32,
  value: vec4f,
) {
  ${opts.bufferName}[strandIdx * pointsPerStrand + pointIdx] = value;
}
`;

///////////////////////////
/// GPU BUFFER
///////////////////////////

export function createHairPointsPositionsBuffer(
  device: GPUDevice,
  name: string,
  positions: Float32Array,
  extraUsage: GPUBufferUsageFlags
): GPUBuffer {
  // console.log('POSITIONS', typedArr2str(positions, 4));
  return createGPU_StorageBuffer(
    device,
    `${name}-points-positions`,
    positions,
    extraUsage
  );
}
