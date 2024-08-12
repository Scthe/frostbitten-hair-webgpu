// deno-lint-ignore-file no-explicit-any
import { assertAlmostEquals, assertEquals } from 'assert';
import { BYTES_F32, CONFIG } from '../../constants.ts';
import {
  assertBinarySnapshot,
  createMockGpuDevice,
  getLastArgs,
  relativePath,
} from '../../sys_deno/testUtils.ts';
import { createSdfColliderFromBinary } from './createSdfColliderFromBinary.ts';

const SNAPSHOT_FILE = relativePath(import.meta, '__test__/sdf-binary.snapshot.bin'); // prettier-ignore

Deno.test('SDF :: from binary file', async () => {
  CONFIG.isTest = true;

  const path = relativePath(import.meta, '__test__/test-sdf.bin');
  const rawFileData = Deno.readFileSync(path);

  const mockDevice = createMockGpuDevice();

  const collider = createSdfColliderFromBinary(
    mockDevice,
    'test-sdf',
    rawFileData.buffer
  );

  const EXP_DIMS = 5;
  assertEquals(collider.dims, EXP_DIMS);
  const [boundsMin, boundsMax] = collider.bounds;
  assertEquals(boundsMin[0], -0.07146620005369186);
  assertEquals(boundsMin[1], 1.3298900127410889);
  assertEquals(boundsMin[2], -0.11404839903116226);
  assertEquals(boundsMax[0], 0.07146620005369186);
  assertEquals(boundsMax[1], 1.6911249160766602);
  assertEquals(boundsMax[2], 0.11287439614534378);

  // check create texture
  const texDesc: GPUTextureDescriptor = getLastArgs(mockDevice.createTexture)[0]; // prettier-ignore
  assertEquals(texDesc.dimension, '3d');
  assertTextureBounds(texDesc.size, EXP_DIMS);

  // check write data
  const texWriteArgs = getLastArgs(mockDevice.queue.writeTexture);
  const writeOffset = texWriteArgs[2];
  const writeSize = texWriteArgs[3];
  assertEquals(writeOffset, {
    bytesPerRow: EXP_DIMS * BYTES_F32,
    rowsPerImage: EXP_DIMS,
  });
  assertTextureBounds(writeSize, EXP_DIMS);

  // check distances
  const distances = texWriteArgs[1];
  assertAlmostEquals(distances[0], 0.05447781831026077);
  await assertBinarySnapshot(SNAPSHOT_FILE, distances);
});

function assertTextureBounds(actual: any, expDims: number) {
  assertEquals(actual.width, expDims);
  assertEquals(actual.height, expDims);
  assertEquals(actual.depthOrArrayLayers, expDims);
}
