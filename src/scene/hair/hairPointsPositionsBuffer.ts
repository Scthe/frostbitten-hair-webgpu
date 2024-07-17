import { createGPU_StorageBuffer } from '../../utils/webgpu.ts';

///////////////////////////
/// SHADER CODE
///////////////////////////

export const BUFFER_HAIR_POINTS_POSITIONS = (bindingIdx: number) => /* wgsl */ `

@group(0) @binding(${bindingIdx})
var<storage, read> _hairPointPositions: array<vec4f>;

fn _getHairPointPosition(
  pointsPerStrand: u32,
  strandIdx: u32,
  pointIdx: u32
) -> vec4f {
  return _hairPointPositions[strandIdx * pointsPerStrand + pointIdx];
}
`;

///////////////////////////
/// GPU BUFFER
///////////////////////////

export function createHairPointsPositionsBuffer(
  device: GPUDevice,
  name: string,
  positions: Float32Array
): GPUBuffer {
  // console.log('POSITIONS', typedArr2str(positions, 4));
  return createGPU_StorageBuffer(device, `${name}-points-positions`, positions);
}
