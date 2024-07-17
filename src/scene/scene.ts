import { GPUMesh } from './gpuMesh.ts';
import { HairObject } from './hair/hairObject.ts';

export interface Scene {
  objects: GPUMesh[];
  hairObject: HairObject;
}
