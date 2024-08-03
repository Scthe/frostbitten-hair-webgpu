import { SDFCollider } from './sdfCollider.ts';
import { BoundingBox } from '../../utils/bounds.ts';
import { createSDFTexture, createSdfSampler } from './sdfUtils.ts';

export function createSdfColliderFromBinary(
  device: GPUDevice,
  name: string,
  data: ArrayBuffer
): SDFCollider {
  const dims = new Uint32Array(data, 0, 1)[0];

  let offset = 2; // don't know, don't care
  const dataF32 = new Float32Array(data);
  const bounds: BoundingBox = [
    [dataF32[offset + 0], dataF32[offset + 1], dataF32[offset + 2]],
    [dataF32[offset + 3], dataF32[offset + 4], dataF32[offset + 5]],
  ];
  offset += 6;

  // load positions
  const distances = dataF32.slice(offset);
  /*console.log({
    dims,
    bounds,
    distances: {
      first: distances[0],
      last: distances.at(-1),
      len: distances.length,
    },
  });*/

  const expLen = dims * dims * dims;
  if (distances.length !== expLen) {
    throw new Error(`Invalid SDF binary file. With dims=${dims} expected ${expLen} values. Got ${distances.length}.`); // prettier-ignore
  }

  // create result
  const tex = createSDFTexture(device, name, dims, distances);
  const texView = tex.createView();
  const sampler = createSdfSampler(device, name);

  return new SDFCollider(name, bounds, dims, tex, texView, sampler);
}
