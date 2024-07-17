import { vec3 } from 'wgpu-matrix';
import { TfxFileData } from './tfxFileLoader.ts';
import { createGPU_StorageBuffer } from '../../utils/webgpu.ts';

///////////////////////////
/// SHADER CODE
///////////////////////////

export const BUFFER_HAIR_TANGENTS = (bindingIdx: number) => /* wgsl */ `

@group(0) @binding(${bindingIdx})
var<storage, read> _hairTangents: array<vec4f>;

fn _getHairTangent(
  pointsPerStrand: u32,
  strandIdx: u32,
  pointIdx: u32
) -> vec4f {
  return _hairTangents[strandIdx * pointsPerStrand + pointIdx];
}
`;

///////////////////////////
/// GPU BUFFER
///////////////////////////

type Vec3 = [number, number, number];

function subtractNorm(a: Vec3, b: Vec3): Vec3 {
  const c = vec3.subtract(a, b);
  // deno-lint-ignore no-explicit-any
  return vec3.normalize(c, c) as any;
}

export function createHairTangentsBuffer(
  device: GPUDevice,
  name: string,
  tfxFile: TfxFileData
): GPUBuffer {
  const {
    vertexPositions,
    header: { numHairStrands, numVerticesPerStrand },
  } = tfxFile;

  // NOTE: positions are in XYZW, so 4 components
  const tangents = new Float32Array(vertexPositions.length);

  const getVertexPos = (idx: number): Vec3 => [
    vertexPositions[idx * 4],
    vertexPositions[idx * 4 + 1],
    vertexPositions[idx * 4 + 2],
  ];
  const setTangent = (idx: number, t: Vec3) => {
    tangents[idx * 4 + 0] = t[0];
    tangents[idx * 4 + 1] = t[1];
    tangents[idx * 4 + 2] = t[2];
    tangents[idx * 4 + 3] = 0.0;
  };

  for (let iStrand = 0; iStrand < numHairStrands; iStrand++) {
    const indexRootVertMaster = iStrand * numVerticesPerStrand;

    // vertex 1 through n-1
    for (let i = 0; i < numVerticesPerStrand; i++) {
      const isTip = i == numVerticesPerStrand - 1; // e.g. 31 in 32-vertices-per-strand
      const k = isTip ? i - 1 : i; // use one before last
      const vert = getVertexPos(indexRootVertMaster + k);
      const vertNext = getVertexPos(indexRootVertMaster + k + 1);
      const tangent = subtractNorm(vertNext, vert); // vert toward vertNext
      setTangent(indexRootVertMaster + i, tangent);
    }
  }
  // console.log('TANGENTS', typedArr2str(tangents, 4));

  return createGPU_StorageBuffer(device, `${name}-tangents`, tangents);
}
