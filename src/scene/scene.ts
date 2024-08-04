import { Mat4 } from 'wgpu-matrix';
import { GPUMesh } from './gpuMesh.ts';
import { HairObject } from './hair/hairObject.ts';
import { SDFCollider } from './sdfCollider/sdfCollider.ts';
import { GridData } from '../passes/simulation/grids/gridData.ts';

export interface Scene {
  objects: GPUMesh[];
  hairObject: HairObject;
  sdfCollider: SDFCollider;
  modelMatrix: Mat4;
  physicsGrid: GridData;
}
