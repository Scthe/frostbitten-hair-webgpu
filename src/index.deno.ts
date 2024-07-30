import { getRowPadding, createCapture } from 'std/webgpu';
import { Dimensions } from './utils/index.ts';
import { Renderer } from './renderer.ts';
import { createGpuDevice } from './utils/webgpu.ts';
import { createErrorSystem } from './utils/errors.ts';
import { writePngFromGPUBuffer } from './sys_deno/fakeCanvas.ts';
import { CONFIG } from './constants.ts';
import {
  textFileReader_Deno,
  createTextureFromFile_Deno,
  binaryFileReader_Deno,
} from './sys_deno/loadersDeno.ts';
import { Scene } from './scene/scene.ts';
import { loadScene } from './scene/loadScene.ts';
import { STATS } from './stats.ts';
import { GpuProfiler, GpuProfilerResult } from './gpuProfiler.ts';

CONFIG.loaders.textFileReader = textFileReader_Deno;
CONFIG.loaders.binaryFileReader = binaryFileReader_Deno;
CONFIG.loaders.createTextureFromFile = createTextureFromFile_Deno;
CONFIG.colors.gamma = 1.0; // I assume the png library does it for us?

// GPUDevice
const device = (await createGpuDevice())!;
if (!device) Deno.exit(1);
const errorSystem = createErrorSystem(device);
errorSystem.startErrorScope('init');

// scene load
const scene: Scene = await loadScene(device);
renderSceneToFile(device, scene, './output.png');

async function renderSceneToFile(
  device: GPUDevice,
  scene: Scene,
  outputPath: string
) {
  const VIEWPORT_SIZE: Dimensions = {
    width: 1280,
    height: 720,
  };
  const PREFERRED_CANVAS_FORMAT = 'rgba8unorm-srgb';

  // create canvas
  console.log('Creating output canvas..');
  const { texture: windowTexture, outputBuffer } = createCapture(
    device,
    VIEWPORT_SIZE.width,
    VIEWPORT_SIZE.height
  );
  const windowTextureView = windowTexture.createView();

  // profiler
  // GPU timestamp do not work in Deno, but sync CPU timestamp
  // after device.queue.submit() at least gives SOME number.
  // It's crap, but..
  const profiler = new GpuProfiler(device);
  profiler.profileNextFrame(true);

  // renderer setup
  console.log('Creating renderer..');
  const renderer = new Renderer(
    device,
    VIEWPORT_SIZE,
    PREFERRED_CANVAS_FORMAT,
    undefined //profiler
  );

  // init ended, report errors
  console.log('Checking async WebGPU errors after init()..');
  await assertNoWebGPUErrorsAsync();

  // stuff before first frame
  console.log('Setting stuff before first frame');
  errorSystem.startErrorScope('beforeFirstFrame');
  renderer.beforeFirstFrame(scene);
  await assertNoWebGPUErrorsAsync();
  console.log('Init OK!');

  const mainCmdBufDesc: GPUCommandEncoderDescriptor = {
    label: 'main-frame-cmd-buffer',
  };

  // START: Render frame
  console.log('Frame start!');
  errorSystem.startErrorScope('frame');

  // profiler.beginFrame();

  // const inputState = getInputState();
  // renderer.updateCamera(deltaTime, inputState);

  // record commands
  const cmdBuf = device.createCommandEncoder(mainCmdBufDesc);
  renderer.cmdRender(cmdBuf, scene, windowTextureView);

  // result to buffer
  cmdCopyTextureToBuffer(cmdBuf, windowTexture, outputBuffer, VIEWPORT_SIZE);

  // submit commands
  // profiler.endFrame(cmdBuf);
  const profilerScopeToken = profiler.startRegionCpu('CPU Frame');
  device.queue.submit([cmdBuf.finish()]);
  console.log('Frame submitted, checking errors..');

  // frame end
  await assertNoWebGPUErrorsAsync();

  // write output
  await writePngFromGPUBuffer(outputBuffer, VIEWPORT_SIZE, outputPath);

  // end scope now, after guaranteed GPU sync point. The timings are skewed,
  // but best we get
  profiler.endRegionCpu(profilerScopeToken);

  STATS.printStats();

  await profiler.scheduleRaportIfNeededAsync(reportProfiler);
  console.log(`Result: '${outputPath}'`);
}

/////////////////////
/// UTILS

function cmdCopyTextureToBuffer(
  cmdBuf: GPUCommandEncoder,
  texture: GPUTexture,
  outputBuffer: GPUBuffer,
  dimensions: Dimensions
): void {
  const { padded } = getRowPadding(dimensions.width);

  cmdBuf.copyTextureToBuffer(
    { texture },
    {
      buffer: outputBuffer,
      bytesPerRow: padded,
    },
    dimensions
  );
}

function reportProfiler(result: GpuProfilerResult) {
  console.log('PROFILER [');
  result.forEach(([name, timeMs]) => {
    console.log(`%c - %c${name}:`, '', 'color: green', `${timeMs}ms`);
  });
  console.log(']');
}

async function assertNoWebGPUErrorsAsync() {
  const lastError = await errorSystem.reportErrorScopeAsync();
  if (lastError) {
    console.error(lastError);
    Deno.exit(1);
  }
}
