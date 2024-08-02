import { vec3 } from 'wgpu-matrix';
import { BoundingBox, BoundingBoxPoint } from '../../utils/bounds.ts';
import { SDFCollider } from './sdfCollider.ts';
import { BYTES_F32 } from '../../constants.ts';

// https://www.w3.org/TR/webgpu/#float32-filterable
const TEXTURE_FORMAT: GPUTextureFormat = 'r32float';

type Point3D = BoundingBoxPoint;

interface SdfCreateOpts {
  bounds: BoundingBox;
  /** Enlarge bounds */
  padding: number;
  /** How many points on each axis */
  dims: number;
}

export function createSdfCollider(
  device: GPUDevice,
  name: string,
  opts: SdfCreateOpts
): SDFCollider {
  const { bounds, padding, dims: dims_ } = opts;
  const dims = Math.floor(dims_);
  if (dims < 2) {
    throw new Error(`Invalid SDF dims: ${dims_}`);
  }
  const segmentCount = dims - 1; // there is a better name in SDF terminology. Yet I've spend 2 weeks on hair rendering, so this is the name I'm gonna use.
  // console.log('--------- createSdfCollider ---------');
  // console.log(opts);

  // calculate grid
  const [boundsMin_, boundsMax_] = bounds;
  const boundsMin = vec3.scale(boundsMin_, padding);
  const boundsMax = vec3.scale(boundsMax_, padding);
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
    const radius = 0.05;
    const d = vec3.distance(p, mockCollider) - radius;
    // console.log(uvw, ' -> ', p, ', d=', d);
    const idx = getIdx(dims, uvw);
    data[idx] = d;
  }

  // create texture
  // https://fynv.github.io/webgpu_test/client/volume_isosurface.html
  const texSize: GPUExtent3D = {
    width: dims,
    height: dims,
    depthOrArrayLayers: dims,
  };
  const tex = device.createTexture({
    label: `${name}-texture`,
    dimension: '3d',
    size: texSize,
    format: TEXTURE_FORMAT,
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
  });
  device.queue.writeTexture(
    { texture: tex },
    data,
    { bytesPerRow: BYTES_F32 * dims, rowsPerImage: dims },
    texSize
  );
  const texView = tex.createView();
  const sampler = device.createSampler({
    label: `${name}-sampler`,
    addressModeU: 'clamp-to-edge',
    addressModeV: 'clamp-to-edge',
    addressModeW: 'clamp-to-edge',
    magFilter: 'linear',
    minFilter: 'linear',
  });

  return new SDFCollider(name, bounds, dims, tex, texView, sampler);
}

function* generateSDFPoints(
  boundsMin: Point3D,
  cellSize: Point3D,
  dim: number
) {
  for (let x = 0; x < dim; x++) {
    for (let y = 0; y < dim; y++) {
      for (let z = 0; z < dim; z++) {
        const p: Point3D = [
          boundsMin[0] + cellSize[0] * x,
          boundsMin[1] + cellSize[1] * y,
          boundsMin[2] + cellSize[2] * z,
        ];
        const uvw: Point3D = [x, y, z];
        yield [uvw, p];
      }
    }
  }
}

function getIdx(dim: number, p: Point3D) {
  return (
    p[0] * dim * dim + //
    p[1] * dim +
    p[2]
  );
}
