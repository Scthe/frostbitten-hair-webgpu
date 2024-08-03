import { vec3 } from 'wgpu-matrix';
import { SDFCollider, SdfPoint3D } from './sdfCollider.ts';
import { BoundingBox } from '../../utils/bounds.ts';
import { createSDFTexture, createSdfSampler } from './sdfUtils.ts';

interface SdfCreateOpts {
  bounds: BoundingBox;
  /** How many points on each axis */
  dims: number;
}

/** Mostly for visualization debugging */
export function createMockSdfCollider(
  device: GPUDevice,
  name: string,
  opts: SdfCreateOpts
): SDFCollider {
  const { bounds, dims: dims_ } = opts;
  const dims = Math.floor(dims_);
  if (dims < 2) {
    throw new Error(`Invalid SDF dims: ${dims_}`);
  }
  const segmentCount = dims - 1; // there is a better name in SDF terminology. Yet I've spend 2 weeks on hair rendering, so this is the name I'm gonna use.
  // console.log(opts);

  // calculate grid
  const [boundsMin, boundsMax] = bounds;
  const size = vec3.subtract(boundsMax, boundsMin);
  const cellSize = vec3.scale(size, 1.0 / segmentCount);
  /*console.log({
    size,
    cellSize,
    entries: dims * dims * dims,
    bytes: dims * dims * dims * //BYTES_F32,
  });*/

  // fill data
  const data = new Float32Array(dims * dims * dims);
  for (const [uvw, p] of generateSDFPoints(boundsMin, cellSize, dims)) {
    // uvw = values in [0, dim)
    // p = values in world space

    const mockCollider = [0, 1.4403254985809326, 0.008672002702951431];
    // const mockCollider = [0, 1.3715709447860718, -0.0005870014429092407];
    const radius = 0.05;

    const d = vec3.distance(p, mockCollider) - radius;
    // console.log(idx, uvw, ' -> ', p, ', d=', d);
    const idx = getIdx(dims, uvw);
    data[idx] = d;
  }

  // create texture
  // https://fynv.github.io/webgpu_test/client/volume_isosurface.html
  const tex = createSDFTexture(device, name, dims, data);
  const texView = tex.createView();
  const sampler = createSdfSampler(device, name);

  return new SDFCollider(name, bounds, dims, tex, texView, sampler);
}

function* generateSDFPoints(
  boundsMin: SdfPoint3D,
  cellSize: SdfPoint3D,
  dim: number
) {
  for (let z = 0; z < dim; z++) {
    for (let y = 0; y < dim; y++) {
      for (let x = 0; x < dim; x++) {
        const p: SdfPoint3D = [
          boundsMin[0] + cellSize[0] * x,
          boundsMin[1] + cellSize[1] * y,
          boundsMin[2] + cellSize[2] * z,
        ];
        const uvw: SdfPoint3D = [x, y, z];
        yield [uvw, p];
      }
    }
  }
}

function getIdx(dim: number, p: SdfPoint3D) {
  return (
    p[2] * dim * dim + //
    p[1] * dim +
    p[0]
  );
}
