import { createGpuDevice } from './utils/webgpu.ts';
import { createInputHandler } from './sys_web/input.ts';
import { Renderer } from './renderer.ts';
import { STATS } from './stats.ts';
import { initializeGUI, onGpuProfilerResult } from './sys_web/gui.ts';
import { GpuProfiler } from './gpuProfiler.ts';
import { initCanvasResizeSystem } from './sys_web/cavasResize.ts';
import { CONFIG, MILISECONDS_TO_SECONDS } from './constants.ts';
import { createErrorSystem } from './utils/errors.ts';
import { showHtmlEl, hideHtmlEl } from './sys_web/htmlUtils.ts';
import { Scene } from './scene/scene.ts';
import { loadScene } from './scene/loadScene.ts';
import { checkMouseGizmo } from './sys_web/gizmo.ts';

(async function () {
  // deno-lint-ignore no-explicit-any
  (globalThis as any)._config = CONFIG;
  // CONFIG.hairRender.lodRenderPercent = 20;
  // console.warn(`Setting hair render% to ${CONFIG.hairRender.lodRenderPercent}`); // prettier-ignore

  // GPUDevice
  const device = await createGpuDevice();
  if (!device) {
    showErrorMessage();
    return;
  }
  const errorSystem = createErrorSystem(device);
  errorSystem.startErrorScope('init');

  // create canvas
  const PREFERRED_CANVAS_FORMAT = navigator.gpu.getPreferredCanvasFormat();
  const [canvas, canvasContext] = getCanvasContext(
    '#gpu-canvas',
    device,
    PREFERRED_CANVAS_FORMAT
  );
  const canvasResizeSystem = initCanvasResizeSystem(canvas, canvasContext);

  // input
  const getInputState = createInputHandler(window, canvas);

  // scene load
  const scene: Scene = await loadScene(device);

  // renderer setup
  const profiler = new GpuProfiler(device);
  const renderer = new Renderer(
    device,
    canvasResizeSystem.getViewportSize(),
    PREFERRED_CANVAS_FORMAT,
    profiler
  );
  canvasResizeSystem.addListener(renderer.onCanvasResize);

  initializeGUI(device, profiler, scene, renderer.cameraCtrl);
  STATS.show();
  let done = false;

  // init ended, report errors
  let lastError = await errorSystem.reportErrorScopeAsync();
  if (lastError) {
    showErrorMessage(lastError);
    return;
  }

  // stuff before first frame
  errorSystem.startErrorScope('beforeFirstFrame');
  renderer.beforeFirstFrame(scene);
  lastError = await errorSystem.reportErrorScopeAsync();
  if (lastError) {
    showErrorMessage(lastError);
    return;
  }

  const mainCmdBufDesc: GPUCommandEncoderDescriptor = {
    label: 'main-frame-cmd-buffer',
  };

  // frame callback
  const frame = () => {
    errorSystem.startErrorScope('frame');

    STATS.onEndFrame();
    STATS.onBeginFrame();
    profiler.beginFrame();
    const deltaTime = STATS.deltaTimeMS * MILISECONDS_TO_SECONDS;

    canvasResizeSystem.revalidateCanvasSize();

    const inputState = getInputState();
    checkMouseGizmo(
      inputState,
      canvasResizeSystem.getViewportSize(),
      renderer.viewMatrix,
      renderer.projectionMat
    );
    renderer.updateCamera(deltaTime, inputState);

    // record commands
    const cmdBuf = device.createCommandEncoder(mainCmdBufDesc);
    const screenTexture = canvasResizeSystem.getScreenTextureView();
    renderer.cmdRender(cmdBuf, scene, screenTexture);

    // submit commands
    profiler.endFrame(cmdBuf);
    device.queue.submit([cmdBuf.finish()]);

    profiler.scheduleRaportIfNeededAsync(onGpuProfilerResult);

    // frame end
    if (!done) {
      errorSystem.reportErrorScopeAsync(onRenderFrameError); // not awaited!

      requestAnimationFrame(frame);
    }
  };

  // start rendering
  requestAnimationFrame(frame);

  function onRenderFrameError(lastError: string): never {
    showErrorMessage(lastError);
    done = true;
    throw new Error(lastError);
  }
})();

function getCanvasContext(
  selector: string,
  device: GPUDevice,
  canvasFormat: string
): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas: HTMLCanvasElement = document.querySelector(selector)!;
  // deno-lint-ignore no-explicit-any
  const context: any = canvas.getContext('webgpu')!;

  // const devicePixelRatio = window.devicePixelRatio;
  // canvas.width = canvas.clientWidth * devicePixelRatio;
  // canvas.height = canvas.clientHeight * devicePixelRatio;

  context.configure({
    device,
    format: canvasFormat,
    alphaMode: 'premultiplied',
  });
  return [canvas, context];
}

function showErrorMessage(msg?: string) {
  hideHtmlEl(document.getElementById('gpu-canvas'));
  showHtmlEl(document.getElementById('no-webgpu'), 'flex');
  if (msg) {
    document.getElementById('error-msg')!.textContent = msg;
  }
}
