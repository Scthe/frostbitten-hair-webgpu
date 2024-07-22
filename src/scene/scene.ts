import { mat4 } from 'wgpu-matrix';
import { GPUMesh } from './gpuMesh.ts';
import { HairObject } from './hair/hairObject.ts';

export interface Scene {
  objects: GPUMesh[];
  hairObject: HairObject;
  modelMatrix: mat4.Mat4;
}
