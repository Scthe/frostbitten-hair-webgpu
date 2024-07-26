import { BoundingSphere } from '../../utils/bounds.ts';
import { TypedArrayView } from '../../utils/typedArrayView.ts';
import {
  WEBGPU_MINIMAL_BUFFER_SIZE,
  createGPU_StorageBuffer,
} from '../../utils/webgpu.ts';
import { TfxFileData } from './tfxFileLoader.ts';

///////////////////////////
/// SHADER CODE
///////////////////////////

export const BUFFER_HAIR_DATA = (bindingIdx: number) => /* wgsl */ `

struct HairData {
  boundingSphere: vec4f,
  strandsCount: u32,
  pointsPerStrand: u32,
};

@group(0) @binding(${bindingIdx})
var<storage, read> _hairData: HairData;
`;

///////////////////////////
/// GPU BUFFER
///////////////////////////

export function createHairDataBuffer(
  device: GPUDevice,
  name: string,
  tfxData: TfxFileData,
  boundingSphere: BoundingSphere
): GPUBuffer {
  const BYTES = WEBGPU_MINIMAL_BUFFER_SIZE;

  const data = new ArrayBuffer(BYTES);
  const dataView = new TypedArrayView(data);
  dataView.writeF32(boundingSphere.center[0]);
  dataView.writeF32(boundingSphere.center[1]);
  dataView.writeF32(boundingSphere.center[2]);
  dataView.writeF32(boundingSphere.radius);
  dataView.writeU32(tfxData.header.numHairStrands);
  dataView.writeU32(tfxData.header.numVerticesPerStrand);

  return createGPU_StorageBuffer(device, `${name}-hair-data`, dataView.asU32);
}
