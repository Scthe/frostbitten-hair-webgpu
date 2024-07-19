import {
  assertBinarySnapshot,
  createGpuDevice_TESTS,
  createMockPassCtx,
  relativePath,
} from '../../sys_deno/testUtils.ts';
import { Dimensions } from '../../utils/index.ts';
import {
  cmdCopyToReadbackBuffer,
  createReadbackBuffer,
  readBufferToCPU,
} from '../../utils/webgpu.ts';
import { writePng } from '../../sys_deno/fakeCanvas.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import { mat4 } from 'wgpu-matrix';
import { HairTilesPass } from './hairTilesPass.ts';
import { createHairObject, mockTfxFile } from '../../scene/loadScene.ts';

const RESULT_SIZE: Dimensions = {
  // width: 800,
  // height: 600,
  width: 256,
  height: 256,
};
const OBJ_NAME = 'HairTilesPass-obj';

const PREVIEW_PATH = relativePath(import.meta, '__test__/tiles.preview.png');
const SNAPSHOT_FILE = relativePath(import.meta, '__test__/tiles.snapshot.bin');

// let fiberRadius = 0.1; // TODO use

Deno.test('HairTilesPass', async () => {
  const [device, reportWebGPUErrAsync] = await createGpuDevice_TESTS();

  const uniforms = new RenderUniformsBuffer(device);

  // hair object
  const tfxFile = mockTfxFile();
  tfxFile.header.numHairStrands = 1;
  tfxFile.header.numVerticesPerStrand = 4;
  tfxFile.vertexPositions = new Float32Array(
    [
      [-0.7, -0.7, 0.0, 1.0],
      [-0.2, 0.2, 0.0, 1.0],
      [0.2, 0.2, 0.0, 1.0],
      [0.7, -0.7, 0.0, 1.0],
    ].flat()
  );
  const hairObject = createHairObject(device, OBJ_NAME, tfxFile);

  // pass
  const pass = new HairTilesPass(device);
  pass.onViewportResize(device, RESULT_SIZE);

  // result framebuffer as flat buffer
  const resultBuffer = pass.resultBuffer;
  // readback buffer (allows Usage.MAP_READ)
  const resultReadbackBuffer = createReadbackBuffer(device, resultBuffer);

  // submit
  const cmdBuf = device.createCommandEncoder();
  const passCtx = createMockPassCtx(device, cmdBuf);
  passCtx.projMatrix = mat4.identity();
  passCtx.viewMatrix = mat4.identity();
  passCtx.vpMatrix = mat4.identity();
  passCtx.globalUniforms = uniforms;
  passCtx.viewport = RESULT_SIZE;
  uniforms.update(passCtx);
  // pass.clearFramebuffer(passCtx);
  pass.cmdDrawHairToTiles(passCtx, hairObject);
  cmdCopyToReadbackBuffer(cmdBuf, resultBuffer, resultReadbackBuffer);
  device.queue.submit([cmdBuf.finish()]);

  await reportWebGPUErrAsync();

  // read back
  const resultData = await readBufferToCPU(Uint32Array, resultReadbackBuffer);
  // printTypedArray('resultData', resultData);

  // cleanup
  device.destroy();

  await writePng(resultData.buffer, RESULT_SIZE, PREVIEW_PATH);
  // await assertBinarySnapshot(SNAPSHOT_FILE, resultData.buffer); // TODO restore
});
