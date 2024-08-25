import {
  createGpuDevice_TESTS,
  createMockPassCtx,
} from '../../sys_deno/testUtils.ts';
import { Dimensions, clamp } from '../../utils/index.ts';
import {
  cmdCopyToReadbackBuffer,
  createGPU_StorageBuffer,
  createReadbackBuffer,
  readBufferToCPU,
} from '../../utils/webgpu.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import { CONFIG } from '../../constants.ts';
import { HairTileSortPass } from './hairTileSortPass.ts';
import {
  createHairTileListBuffer,
  parseTileList,
} from './shared/tileListBuffer.ts';
import { createArray } from '../../utils/arrays.ts';
import { assertEquals, assertLessOrEqual } from 'assert';

const TILE_COUNT = 16;
const TEST_PREFFIX = 'test-tiles-sort';

Deno.test('HairTileSortPass', async () => {
  CONFIG.hairRender.sortBuckets = 8;
  const [device, reportWebGPUErrAsync] = await createGpuDevice_TESTS();

  const viewportSize: Dimensions = {
    width: TILE_COUNT * CONFIG.hairRender.tileSize,
    height: 1,
  };
  const uniforms = new RenderUniformsBuffer(device);
  const pass = new HairTileSortPass(device);
  pass.onViewportResize(device, viewportSize);
  const bucketsReadbackBuffer = createReadbackBuffer(
    device,
    pass.bucketsDataBuffer
  );

  const hairTileListBuffer = createHairTileListBuffer(device, viewportSize);
  const hairTileListReadbackBuffer = createReadbackBuffer(
    device,
    hairTileListBuffer
  );

  const segmentsPerTile = new Uint32Array(TILE_COUNT);
  segmentsPerTile.fill(0);
  segmentsPerTile[1] = 1;
  segmentsPerTile[6] = 15;
  segmentsPerTile[2] = 16;
  segmentsPerTile[3] = 17;
  segmentsPerTile[8] = 4096;
  const hairSegmentCountPerTileBuffer = createGPU_StorageBuffer(
    device,
    'test-hair-segments-per-tile',
    segmentsPerTile
  );

  // start execute
  const cmdBuf = device.createCommandEncoder();

  // prepare params
  const passCtx = createMockPassCtx(device, cmdBuf);
  passCtx.globalUniforms = uniforms;
  passCtx.viewport = viewportSize;
  passCtx.hairSegmentCountPerTileBuffer = hairSegmentCountPerTileBuffer;
  passCtx.hairTileListBuffer = hairTileListBuffer;
  uniforms.update(passCtx);

  // execute pass
  const computePass = cmdBuf.beginComputePass({
    label: `${TEST_PREFFIX}-compute-pass`,
  });
  pass.cmdClearBeforeRender(passCtx);
  pass.cmdSortHairTiles(passCtx);
  computePass.end();

  // finalize
  cmdCopyToReadbackBuffer(
    cmdBuf,
    pass.bucketsDataBuffer,
    bucketsReadbackBuffer
  );
  cmdCopyToReadbackBuffer(
    cmdBuf,
    hairTileListBuffer,
    hairTileListReadbackBuffer
  );
  device.queue.submit([cmdBuf.finish()]);

  await reportWebGPUErrAsync();

  // read back
  const bucketsData = await readBufferToCPU(Uint32Array, bucketsReadbackBuffer);
  // console.log('bucketsData', typedArr2str(bucketsData));
  const tilesListData = await readBufferToCPU(
    Uint32Array,
    hairTileListReadbackBuffer
  );
  // console.log('tilesListData', parseTileList(tilesListData));

  // cleanup
  device.destroy();

  // test pass 0
  const gpuBucketData = parseBucketData(bucketsData);
  // printDebugBuckets(gpuBucketData);
  assertBucketCount(segmentsPerTile, gpuBucketData);

  // test pass 1
  const tileListParsed = parseTileList(tilesListData);
  const fullTileData = tileListParsed.data.map((tileIdx) => {
    const segments = segmentsPerTile[tileIdx];
    return {
      tileIdx,
      bucket: calcTileSortBucket(segments),
      segments,
    };
  });
  // console.log('tilesListData', fullTileData);
  for (let i = 1; i < fullTileData.length; i++) {
    const prev = fullTileData[i - 1];
    const now = fullTileData[i];
    // bucket has to decrease
    assertLessOrEqual(now.bucket, prev.bucket);
  }
});

type GPUBucketData = ReturnType<typeof parseBucketData>;

function parseBucketData(data: Uint32Array) {
  const { sortBuckets } = CONFIG.hairRender;

  return createArray(sortBuckets).map((_, i) => {
    const tileCount = data[2 * i];
    const writeOffset = data[2 * i + 1];
    return { tileCount, writeOffset };
  });
}

// deno-lint-ignore no-unused-vars
function printDebugBuckets(bucketData: GPUBucketData) {
  const { sortBucketSize } = CONFIG.hairRender;
  const p = (a: number) => ' '.repeat(4 - String(a).length) + a;

  let start = 0;
  bucketData.forEach(({ tileCount, writeOffset }) => {
    const end = start + sortBucketSize - 1;

    const dataStr =
      tileCount > 0
        ? `tileCount=${tileCount}, writeOffset=${writeOffset}`
        : '-';
    console.log(`Bucket [${p(start)} : ${p(end)}] ${dataStr}`);
    start += sortBucketSize;
  });
}

function assertBucketCount(
  segmentsPerTile: Uint32Array,
  gpuBucketsData: GPUBucketData
) {
  const expected: number[] = createArray(CONFIG.hairRender.sortBuckets);
  expected.fill(0);

  segmentsPerTile.forEach((segmentCnt) => {
    if (segmentCnt == 0) return;
    const bucketIdx = calcTileSortBucket(segmentCnt);
    expected[bucketIdx] += 1;
  });

  assertEquals(
    expected,
    gpuBucketsData.map((e) => e.tileCount)
  );
}

function calcTileSortBucket(segmentCount: number) {
  const { sortBuckets, sortBucketSize } = CONFIG.hairRender;
  const key = Math.floor(segmentCount / sortBucketSize);
  return clamp(key, 0, sortBuckets - 1);
}
