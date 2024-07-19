// @deno-types="npm:@types/dat.gui@0.7.9"
import * as dat from 'dat.gui';
import { CONFIG, DISPLAY_MODE, LightCfg } from '../constants.ts';
import { GpuProfiler, GpuProfilerResult } from '../gpuProfiler.ts';
import { Scene } from '../scene/scene.ts';
import { Camera } from '../camera.ts';
import { showHtmlEl } from '../sys_web/htmlUtils.ts';

// https://github.com/Scthe/WebFX/blob/master/src/UISystem.ts#L13
// https://github.com/Scthe/gaussian-splatting-webgpu/blob/master/src/web/gui.ts

type GuiCtrl = dat.GUIController<Record<string, unknown>>;

export function initializeGUI(
  profiler: GpuProfiler,
  scene: Scene,
  camera: Camera
) {
  const gui = new dat.GUI();

  const dummyObject = {
    openGithub: () => {
      window.location.href = CONFIG.githubRepoLink;
    },
    profile: () => {
      profiler.profileNextFrame(true);
    },
    resetCamera: () => {
      camera.resetPosition();
    },
  };

  // github
  gui.add(dummyObject, 'openGithub').name('GITHUB');

  // profiler
  gui.add(dummyObject, 'profile').name('Profile');

  // folders
  addHairRenderFolder(gui);
  addAmbientLightFolder(gui);
  addLightFolder(gui, CONFIG.lights[0], 'Light 0');
  addLightFolder(gui, CONFIG.lights[1], 'Light 1');
  addLightFolder(gui, CONFIG.lights[2], 'Light 2');
  addColorMgmt();
  addDbgFolder();

  //////////////
  /// subdirs

  function addHairRenderFolder(gui: dat.GUI) {
    const cfg = CONFIG.hairRender;
    const dir = gui.addFolder('Hair render');
    dir.open();

    // display mode
    const modeDummy = createDummy(cfg, 'displayMode', [
      { label: 'Final', value: DISPLAY_MODE.FINAL },
      { label: 'DBG: tiles', value: DISPLAY_MODE.TILES },
      { label: 'DBG: hw-render', value: DISPLAY_MODE.HW_RENDER },
    ]);
    const modeCtrl = dir
      .add(modeDummy, 'displayMode', modeDummy.values)
      .name('Display mode');

    dir.add(cfg, 'fiberRadius', 0.0001, 0.5).name('Radius');
    const tileSegmentsCtrl = dir
      .add(cfg, 'dbgTileModeMaxSegments', 1, 1024 * 4)
      .step(1)
      .name('Tile segments');

    // init
    modeCtrl.onFinishChange(onDisplayModeChange);

    function onDisplayModeChange() {
      const mode = cfg.displayMode;
      setVisible(tileSegmentsCtrl, mode === DISPLAY_MODE.TILES);
    }
  }

  function addAmbientLightFolder(gui: dat.GUI) {
    const dir = gui.addFolder('Ambient light');
    // dir.open();

    addColorController(dir, CONFIG.lightAmbient, 'color', 'Color');
    dir.add(CONFIG.lightAmbient, 'energy', 0.0, 0.2, 0.01).name('Energy');
  }

  function addLightFolder(gui: dat.GUI, lightObj: LightCfg, name: string) {
    const dir = gui.addFolder(name);
    // dir.open();

    dir.add(lightObj, 'posPhi', -179, 179).step(1).name('Position phi');
    dir.add(lightObj, 'posTheta', 15, 165).step(1).name('Position th');
    addColorController(dir, lightObj, 'color', 'Color');
    dir.add(lightObj, 'energy', 0.0, 2.0).name('Energy');
  }

  function addColorMgmt() {
    const dir = gui.addFolder('Color mgmt');
    const cfg = CONFIG.colors;

    dir.add(cfg, 'gamma', 1.0, 3.0).name('Gamma');
    dir.add(cfg, 'exposure', 0.0, 2.0).name('Exposure');
    dir.add(cfg, 'ditherStrength', 0.0, 2.0).name('Dithering');
  }

  function addDbgFolder() {
    const dir = gui.addFolder('DEBUG');
    dir.open();

    // bg
    addColorController(dir, CONFIG, 'clearColor', 'Bg color');

    // camera reset
    dir.add(dummyObject, 'resetCamera').name('Reset camera');
  }

  //////////////
  /// utils
  function addColorController<T extends object>(
    dir: dat.GUI,
    obj: T,
    prop: keyof T,
    name: string
  ) {
    const dummy = {
      value: [] as number[],
    };

    Object.defineProperty(dummy, 'value', {
      enumerable: true,
      get: () => {
        // deno-lint-ignore no-explicit-any
        const v = obj[prop] as any;
        return [v[0] * 255, v[1] * 255, v[2] * 255];
      },
      set: (v: number[]) => {
        // deno-lint-ignore no-explicit-any
        const a = obj[prop] as any as number[];
        a[0] = v[0] / 255;
        a[1] = v[1] / 255;
        a[2] = v[2] / 255;
      },
    });

    dir.addColor(dummy, 'value').name(name);
  }
}

function setVisible(ctrl: GuiCtrl, isVisible: boolean) {
  if (!ctrl) {
    // use stacktrace/debugger to identify which..
    console.error(`Not controller for gui element found!`);
    return;
  }

  // deno-lint-ignore no-explicit-any
  const parentEl: HTMLElement = (ctrl as any).__li;

  if (isVisible) {
    parentEl.style.display = '';
  } else {
    parentEl.style.display = 'none';
  }
}

interface UiOpts<T> {
  label: string;
  value: T;
}

// deno-lint-ignore ban-types
const createDummy = <V extends Object, K extends keyof V>(
  obj: V,
  key: K,
  opts: UiOpts<V[K]>[]
): { values: string[] } & Record<K, string> => {
  const dummy = {
    values: opts.map((o) => o.label),
  };

  Object.defineProperty(dummy, key, {
    enumerable: true,
    get: () => {
      const v = obj[key];
      const opt = opts.find((e) => e.value === v) || opts[0];
      return opt.label;
    },
    set: (selectedLabel: string) => {
      const opt = opts.find((e) => e.label === selectedLabel) || opts[0];
      obj[key] = opt.value;
    },
  });

  // TS ignores Object.defineProperty and thinks we have not complete object
  // deno-lint-ignore no-explicit-any
  return dummy as any;
};

export function onGpuProfilerResult(result: GpuProfilerResult) {
  console.log('Profiler:', result);
  const parentEl = document.getElementById('profiler-results')!;
  parentEl.innerHTML = '';
  // deno-lint-ignore no-explicit-any
  showHtmlEl(parentEl.parentNode as any);

  const mergeByName: Record<string, number> = {};
  const names = new Set<string>();
  result.forEach(([name, timeMs]) => {
    const t = mergeByName[name] || 0;
    mergeByName[name] = t + timeMs;
    names.add(name);
  });

  names.forEach((name) => {
    const timeMs = mergeByName[name];
    const li = document.createElement('li');
    li.innerHTML = `${name}: ${timeMs.toFixed(2)}ms`;
    parentEl.appendChild(li);
  });
}
