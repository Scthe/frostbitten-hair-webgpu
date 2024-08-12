import * as objLoader from 'webgl-obj-loader';
import {
  createGPU_IndexBuffer,
  createGPU_VertexBuffer,
} from '../utils/webgpu.ts';
import { calculateBounds } from '../utils/bounds.ts';
import { createArray, ensureTypedArray } from '../utils/arrays.ts';
import { GPUMesh } from './gpuMesh.ts';

const Mesh = objLoader.default?.Mesh || objLoader.Mesh; // deno vs chrome

interface ObjMesh {
  indices: number[];
  vertices: number[];
  vertexNormals?: Array<number | typeof NaN>;
  textures?: Array<number | typeof NaN>;
}
const getVertexCount = (mesh: ObjMesh) => Math.ceil(mesh.vertices.length / 3);
const getIndexCount = (mesh: ObjMesh) => Math.ceil(mesh.indices.length / 3);

export function loadObjFile(
  device: GPUDevice,
  name: string,
  objText: string,
  scale = 1
): GPUMesh {
  const mesh = new Mesh(objText) as ObjMesh;
  cleanupRawOBJData(mesh, scale);
  // console.log(mesh);

  const vertexCount = getVertexCount(mesh);
  const triangleCount = getIndexCount(mesh);

  const positions = ensureTypedArray(Float32Array, mesh.vertices);
  const positionsBuffer = createGPU_VertexBuffer(
    device,
    `${name}-positions`,
    positions
  );
  const normalsBuffer = createGPU_VertexBuffer(
    device,
    `${name}-normals`,
    mesh.vertexNormals!
  );
  const uvBuffer = createGPU_VertexBuffer(
    device,
    `${name}-uvs`,
    mesh.textures!
  );
  const indexBuffer = createGPU_IndexBuffer(
    device,
    `${name}-indices`,
    mesh.indices
  );
  const bounds = calculateBounds(positions);
  console.log(`Loaded OBJ object '${name}', bounds`, bounds.sphere);

  return {
    name,
    vertexCount,
    triangleCount,
    positionsBuffer,
    normalsBuffer,
    uvBuffer,
    indexBuffer,
    bounds,
    isColliderPreview: false,
  };
}

const hasNormals = (mesh: ObjMesh) => {
  if (!mesh.vertexNormals || !Array.isArray(mesh.vertexNormals)) return false;
  const firstEl = mesh.vertexNormals[0];
  return typeof firstEl === 'number' && !isNaN(firstEl);
};

type MeshWithTextures = Required<Pick<ObjMesh, 'textures'>>;

const hasUVs = (mesh: ObjMesh): mesh is ObjMesh & MeshWithTextures => {
  if (!mesh.textures || !Array.isArray(mesh.textures)) return false;
  const firstEl = mesh.textures[0];
  return typeof firstEl === 'number' && !isNaN(firstEl);
};

function cleanupRawOBJData(mesh: ObjMesh, scale: number) {
  mesh.vertices = mesh.vertices.map((e: number) => e * scale);

  if (!hasNormals(mesh)) {
    throw new Error(`Expected normals in the OBJ file`);
  }

  if (!hasUVs(mesh)) {
    const vertCnt = getVertexCount(mesh);
    mesh.textures = createArray(vertCnt * 2).fill(0.5);
  } else {
    for (let i = 0; i < mesh.textures.length; i += 1) {
      let v = mesh.textures[i];
      v = v % 1; // to range [0-1]
      v = v < 0 ? 1.0 - Math.abs(v) : v; // negative to positive
      // v = (i & 1) == 0 ? 1 - v : v; // invert X - not needed
      v = (i & 1) == 1 ? 1 - v : v; // invert Y - webgpu coordinate system
      mesh.textures[i] = v;
    }
  }
}
