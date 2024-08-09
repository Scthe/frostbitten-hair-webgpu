import { BYTES_VEC3, BYTES_VEC2 } from '../constants.ts';
import { Bounds3d } from '../utils/bounds.ts';

/** Original mesh as imported from the OBJ file */
export interface GPUMesh {
  name: string;
  vertexCount: number;
  triangleCount: number;
  positionsBuffer: GPUBuffer;
  normalsBuffer: GPUBuffer;
  uvBuffer: GPUBuffer;
  indexBuffer: GPUBuffer;
  bounds: Bounds3d;
  /** Object rendered just to show where collider is */
  isColliderPreview: boolean;
}

export const VERTEX_ATTRIBUTE_POSITION: GPUVertexBufferLayout = {
  attributes: [
    {
      shaderLocation: 0, // position
      offset: 0,
      format: 'float32x3',
    },
  ],
  arrayStride: BYTES_VEC3,
  stepMode: 'vertex',
};

export const VERTEX_ATTRIBUTES: GPUVertexBufferLayout[] = [
  VERTEX_ATTRIBUTE_POSITION,
  {
    attributes: [
      {
        shaderLocation: 1, // normals
        offset: 0,
        format: 'float32x3', // only nanite object uses octahedron normals
      },
    ],
    arrayStride: BYTES_VEC3,
    stepMode: 'vertex',
  },
  {
    attributes: [
      {
        shaderLocation: 2, // uv
        offset: 0,
        format: 'float32x2',
      },
    ],
    arrayStride: BYTES_VEC2,
    stepMode: 'vertex',
  },
];
