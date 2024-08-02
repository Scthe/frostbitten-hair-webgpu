import { Mat4 } from 'wgpu-matrix';
import { GPUMesh } from './gpuMesh.ts';
import { HairObject } from './hair/hairObject.ts';
import { SDFCollider } from './sdfCollider/sdfCollider.ts';

export interface Scene {
  objects: GPUMesh[];
  hairObject: HairObject;
  sdfCollider: SDFCollider;
  modelMatrix: Mat4;
}
