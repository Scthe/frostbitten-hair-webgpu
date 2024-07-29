import { createGPU_IndexBuffer } from '../../utils/webgpu.ts';
import { TfxFileData } from './tfxFileLoader.ts';

///////////////////////////
/// GPU BUFFER
///////////////////////////

/** Used only for the naive hw hair rendering technique */
export type HairIndexBuffer = ReturnType<typeof createHairIndexBuffer>;

export const getHairTriangleCount = (
  numHairStrands: number,
  numVerticesPerStrand: number
) => {
  const iCount = numHairStrands * (numVerticesPerStrand - 1) * 6;
  return Math.floor(iCount / 3);
};

/** https://github.com/Scthe/WebFX/blob/master/src/webfx/tfxLoader.ts#L30 */
export function createHairIndexBuffer(
  device: GPUDevice,
  name: string,
  tfxData: TfxFileData
) {
  const { numHairStrands, numVerticesPerStrand } = tfxData.header;
  // if you have 4 points in a strand, there are 3 segments
  const idxElements = numHairStrands * (numVerticesPerStrand - 1);
  const idxCpu = Array(idxElements * 6).fill(0);

  let id = 0;
  let iCount = 0; // actually a vertices count

  // 0 --- 1
  // |  /  |
  // 2 --- 3
  for (let i = 0; i < numHairStrands; i++) {
    for (let j = 0; j < numVerticesPerStrand - 1; j++) {
      idxCpu[iCount++] = 2 * id;
      idxCpu[iCount++] = 2 * id + 1;
      idxCpu[iCount++] = 2 * id + 2;
      idxCpu[iCount++] = 2 * id + 2;
      idxCpu[iCount++] = 2 * id + 1;
      idxCpu[iCount++] = 2 * id + 3;
      id++;
    }
    id++;
  }

  const idxData = Uint32Array.from(idxCpu);
  const indexBuffer = createGPU_IndexBuffer(device, `${name}-indices`, idxData);
  // console.log('INDICES', typedArr2str(idxData, 6));

  return {
    indexBuffer,
    indexFormat: 'uint32' as GPUIndexFormat,
    triangleCount: Math.floor(iCount / 3),
  };
}
