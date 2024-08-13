// @deno-types="npm:@types/dat.gui@0.7.9"
import * as dat from 'dat.gui';
import {
  CONFIG,
  DISPLAY_MODE,
  GridDebugValue,
  LightCfg,
} from '../constants.ts';
import { GpuProfiler } from '../gpuProfiler.ts';
import { Scene } from '../scene/scene.ts';
import { Camera } from '../camera.ts';
import { mat4, vec4 } from 'wgpu-matrix';
import { dgr2rad } from '../utils/index.ts';

// https://github.com/Scthe/WebFX/blob/master/src/UISystem.ts#L13
// https://github.com/Scthe/gaussian-splatting-webgpu/blob/master/src/web/gui.ts

type GuiCtrl = dat.GUIController<Record<string, unknown>>;

export function initializeGUI(
  _device: GPUDevice,
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
    resetSimulation: () => {
      CONFIG.hairSimulation.nextFrameResetSimulation = true;
    },
    resetBall: () => {
      vec4.copy(
        CONFIG.hairSimulation.collisionSphereInitial,
        CONFIG.hairSimulation.collisionSphere
      );
    },
    modelRotation: 0,
  };

  // github
  gui.add(dummyObject, 'openGithub').name('GITHUB');

  // profiler
  gui.add(dummyObject, 'profile').name('Profile');

  // display mode
  const modeDummy = createDummy(CONFIG, 'displayMode', [
    { label: 'Final', value: DISPLAY_MODE.FINAL },
    { label: 'DBG: tiles', value: DISPLAY_MODE.TILES },
    { label: 'DBG: slices cnt', value: DISPLAY_MODE.USED_SLICES },
    { label: 'DBG: hw-render', value: DISPLAY_MODE.HW_RENDER },
    { label: 'DBG: depth', value: DISPLAY_MODE.DEPTH },
    { label: 'DBG: normals', value: DISPLAY_MODE.NORMALS },
    { label: 'DBG: ao', value: DISPLAY_MODE.AO },
  ]);
  const modeCtrl = gui
    .add(modeDummy, 'displayMode', modeDummy.values)
    .name('Display mode');

  // folders
  addSceneFolder(gui);
  addHairRenderFolder(gui);
  addHairMaterialFolder(gui);
  addHairSimulationFolder(gui);
  addAmbientLightFolder(gui);
  addLightFolder(gui, CONFIG.lights[0], 'Light 0');
  addLightFolder(gui, CONFIG.lights[1], 'Light 1');
  addLightFolder(gui, CONFIG.lights[2], 'Light 2');
  addShadowsFolder(gui);
  addAoFolder(gui);
  addColorMgmt();

  //////////////
  /// subdirs

  function addSceneFolder(gui: dat.GUI) {
    const dir = gui.addFolder('Scene');
    const bg = CONFIG.background;
    // dir.open();

    // camera reset
    dir.add(dummyObject, 'resetCamera').name('Reset camera');

    dir
      .add(dummyObject, 'modelRotation', 0.0, 360.0)
      .step(1)
      .name('Rotation')
      .onChange((v: number) => {
        mat4.rotationY(dgr2rad(v), scene.modelMatrix);
      });

    // bg
    addColorController(dir, bg, 'color0', 'Bg color 0');
    addColorController(dir, bg, 'color1', 'Bg color 1');
    dir.add(bg, 'noiseScale', 0.0, 10.0).name('Bg noise scale');
    dir.add(bg, 'gradientStrength', 0.0, 1.0).name('Bg gradient');
  }

  function addHairRenderFolder(gui: dat.GUI) {
    const cfg = CONFIG.hairRender;
    const dir = gui.addFolder('Hair render');
    dir.open();

    dir.add(cfg, 'lodRenderPercent', 0, 100).step(1).name('Render %');
    dir.add(cfg, 'fiberRadius', 0.0001, 0.002).name('Radius');
    const tileSegmentsCtrl = dir
      .add(cfg, 'dbgTileModeMaxSegments', 1, 512)
      .step(1)
      .name('Max segments');
    const slicesCtrl = dir
      .add(cfg, 'dbgSlicesModeMaxSlices', 1, 128)
      .step(1)
      .name('Max slices');
    const showTilesCtrl = dir.add(cfg, 'dbgShowTiles').name('Show tiles');

    // init
    modeCtrl.onFinishChange(onDisplayModeChange);

    function onDisplayModeChange() {
      const mode = CONFIG.displayMode;
      setVisible(tileSegmentsCtrl, mode === DISPLAY_MODE.TILES);
      setVisible(slicesCtrl, mode === DISPLAY_MODE.USED_SLICES);
      setVisible(showTilesCtrl, mode === DISPLAY_MODE.FINAL);
    }
  }

  function addHairMaterialFolder(gui: dat.GUI) {
    const cfg = CONFIG.hairRender.material;
    const dir = gui.addFolder('Hair material');
    // dir.open();

    addColorController(dir, cfg, 'color0', 'Color root');
    addColorController(dir, cfg, 'color1', 'Color tip');
    dir.add(cfg, 'colorRng', 0.0, 1.0).name('Color RNG');
    dir.add(cfg, 'lumaRng', 0.0, 1.0).name('Luma RNG');
    dir.add(cfg, 'specular', 0.0, 3.0, 0.01).name('Specular');
    dir.add(cfg, 'weightTT', 0.0, 2.0, 0.01).name('Weight TT');
    dir.add(cfg, 'weightTRT', 0.0, 2.0, 0.01).name('Weight TRT');
    dir.add(cfg, 'shift', -1.0, 1.0, 0.01).name('Shift');
    dir.add(cfg, 'roughness', 0.0, 1.0, 0.01).name('Roughness');
    dir.add(cfg, 'attenuation', 0.0, 40.0).name('Attenuation');
    dir.add(cfg, 'shadows', 0.0, 1.0).name('Shadows');
  }

  function addHairSimulationFolder(gui: dat.GUI) {
    const cfg = CONFIG.hairSimulation;
    const sdf = cfg.sdf;
    const grid = cfg.physicsForcesGrid;
    const constr = cfg.constraints;
    const wind = cfg.wind;

    const simDir = gui.addFolder('Hair simulation');
    let dir = simDir;
    dir.open();

    dir.add(dummyObject, 'resetSimulation').name('Reset simulation');
    dir.add(cfg, 'enabled').name('Enabled');
    // dir.add(cfg, 'gravity', 0.0, 20.0).name('Gravity');
    dir.add(cfg, 'gravity', 0.0, 0.1).name('Gravity');
    dir.add(cfg, 'friction', 0.0, 1.0).name('Friction');
    dir.add(cfg, 'volumePreservation', 0.0, 0.00025).name('Vol. Preserv.');
    dir.add(dummyObject, 'resetBall').name('Reset ball'); // below, so user does press by accident
    dir.add(CONFIG, 'drawColliders').name('Draw ball');

    // constraints
    dir = simDir.addFolder('Constraints');
    dir.open();
    dir.add(constr, 'constraintIterations', 1, 10).step(1).name('Iterations');
    dir.add(constr, 'stiffnessLengthConstr', 0.0, 1.0).name('Stiff. len');
    dir.add(constr, 'stiffnessGlobalConstr', 0.0, 1.0).name('Stiff. global');
    dir.add(constr, 'globalExtent', 0.0, 1.0).name('Global extent');
    dir.add(constr, 'globalFade', 0.0, 1.0).name('Global fade');
    dir.add(constr, 'stiffnessLocalConstr', 0.0, 1.0).name('Stiff. local');
    dir.add(constr, 'stiffnessCollisions', 0.0, 1.0).name('Stiff. collisions');
    dir.add(constr, 'stiffnessSDF', 0.0, 1.0).name('Stiff. SDF');
    dir.add(sdf, 'distanceOffset', -0.003, 0.003).name('SDF offset');

    // wind
    dir = simDir.addFolder('Wind');
    dir.open();
    dir.add(wind, 'dirPhi', -179, 179).step(1).name('Dir phi');
    dir.add(wind, 'dirTheta', 15, 165).step(1).name('Dir th');
    // dir.add(wind, 'strength', 0.0, 0.0001).name('Strength');
    dir.add(wind, 'strength', 0.0, 1.0).name('Strength');
    dir.add(wind, 'strengthLull', 0.0, 1.0).name('Lull strength');
    dir.add(wind, 'strengthFrequency', 0.001, 2.0).name('Str. frequency');
    dir.add(wind, 'strengthJitter', 0.0, 1.0).name('Str. Jitter');
    dir.add(wind, 'phaseOffset', 0.0, 0.5).name('Phase offset');
    dir.add(wind, 'colisionTraceOffset', 1.0, 5.0).name('Collision offset');

    // SDF preview
    dir = simDir.addFolder('SDF preview');
    // _sdfDir.open();
    dir.add(sdf, 'showDebugView').name('Enabled');
    dir.add(sdf, 'debugSemitransparent').name('Semitransparent');
    dir.add(sdf, 'debugSlice', 0.0, 1.0, 0.01).name('Slice');

    // Grids
    dir = simDir.addFolder('Grids preview');
    // dir.open();
    dir.add(grid, 'showDebugView').name('Enabled');
    const gridValueDummy = createDummy(grid, 'debugValue', [
      { label: 'Density', value: GridDebugValue.DENSITY },
      { label: 'Density Grad', value: GridDebugValue.DENSITY_GRADIENT },
      { label: 'Velocity', value: GridDebugValue.VELOCITY },
      { label: 'Wind', value: GridDebugValue.WIND },
    ]);
    dir.add(gridValueDummy, 'debugValue', gridValueDummy.values).name('Value');
    dir.add(grid, 'debugAbsValue').name('Vector abs');
    dir.add(grid, 'debugSlice', 0.0, 1.0, 0.01).name('Slice');
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

  function addShadowsFolder(gui: dat.GUI) {
    // https://github.com/Scthe/WebFX/blob/09713a3e7ebaa1484ff53bd8a007908a5340ca8e/src/UISystem.ts#L170
    const cfg = CONFIG.shadows;
    const dir = gui.addFolder('Shadows');
    // dir.open();

    const techniqueDummy = createDummy(cfg, 'usePCSS', [
      { label: 'PCF', value: false },
      { label: 'PCSS', value: true },
    ]);
    dir.add(techniqueDummy, 'usePCSS', techniqueDummy.values).name('Technique');
    dir.add(cfg, 'strength', 0.0, 1.0).name('Strength');
    dir.add(cfg, 'PCF_Radius', [0, 1, 2, 3, 4]).name('PCF radius');
    dir.add(cfg, 'bias', 0.0, 0.001).name('Bias');
    // dir.add(cfg, 'blurRadiusTfx', [0, 1, 2, 3, 4]).name('HAIR Blur radius');
    // dir.add(cfg, 'biasHairTfx', 0.001, 0.01).name('HAIR Bias');
    dir.add(cfg, 'hairFiberWidthMultiplier', 0.5, 6.0).name('Hair width mul');

    // position
    dir.add(cfg.source, 'posPhi', -179, 179).step(1).name('Position phi');
    dir.add(cfg.source, 'posTheta', 15, 165).step(1).name('Position th');
    dir.add(cfg, 'showDebugView').name('Show preview');
  }

  function addAoFolder(gui: dat.GUI) {
    // https://github.com/Scthe/WebFX/blob/09713a3e7ebaa1484ff53bd8a007908a5340ca8e/src/UISystem.ts#L170
    const cfg = CONFIG.ao;
    const dir = gui.addFolder('Ambient occl.');
    // dir.open();

    dir.add(cfg, 'strength', 0.0, 1.0).name('Strength');
    dir.add(cfg, 'radius', 0.001, 2.5).name('Radius');
    dir.add(cfg, 'numDirections', 0, 128, 1).name('Directions');
    dir.add(cfg, 'numSteps', 2, 32, 1).name('Steps');
    dir.add(cfg, 'directionOffset', 0.0, 5).name('Dir. offset');
    dir.add(cfg, 'falloffStart2', 0.0, 0.5).name('Falloff start');
    dir.add(cfg, 'falloffEnd2', 1.0, 5.0).name('Falloff end');
  }

  function addColorMgmt() {
    const dir = gui.addFolder('Color mgmt');
    const cfg = CONFIG.colors;

    dir.add(cfg, 'gamma', 1.0, 3.0).name('Gamma');
    dir.add(cfg, 'exposure', 0.0, 2.0).name('Exposure');
    dir.add(cfg, 'ditherStrength', 0.0, 2.0).name('Dithering');
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
