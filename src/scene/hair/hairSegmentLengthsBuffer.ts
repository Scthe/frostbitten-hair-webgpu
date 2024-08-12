import { vec3 } from 'wgpu-matrix';
import { createGPU_StorageBuffer } from '../../utils/webgpu.ts';

///////////////////////////
/// SHADER CODE
///////////////////////////

export const BUFFER_HAIR_SEGMENT_LENGTHS = (bindingIdx: number) => /* wgsl */ `

@group(0) @binding(${bindingIdx})
var<storage, read> _hairSegmentLengths: array<f32>;

fn _getHairSegmentLength(
  pointsPerStrand: u32,
  strandIdx: u32,
  segmentIdx: u32
) -> f32 {
  return _hairSegmentLengths[strandIdx * pointsPerStrand + segmentIdx];
}
`;

///////////////////////////
/// GPU BUFFER
///////////////////////////

export function createHairSegmentLengthsBuffer(
  device: GPUDevice,
  name: string,
  pointsPerStrand: number,
  positions: Float32Array
): GPUBuffer {
  const getPosition = (idx: number) => [
    positions[idx * 4 + 0],
    positions[idx * 4 + 1],
    positions[idx * 4 + 2],
  ];
  // console.log('positions', typedArr2str(positions, 4));

  const totalPoints = positions.length / 4;
  const lengthsF32 = new Float32Array(totalPoints);

  for (let i = 0; i < totalPoints; i++) {
    if (i % pointsPerStrand == pointsPerStrand - 1) {
      // the value with index corresponding to strand tip.
      // Should never be accessed in the first place, so does not matter.
      // Just in case we repeat value just before the tip
      lengthsF32[i] = vec3.distance(getPosition(i - 1), getPosition(i));
    } else {
      lengthsF32[i] = vec3.distance(getPosition(i), getPosition(i + 1));
    }
  }

  // console.log('SEGMENT_LENGTHS', typedArr2str(lengthsF32, 4));
  return createGPU_StorageBuffer(device, `${name}-segmentLengths`, lengthsF32);
}
