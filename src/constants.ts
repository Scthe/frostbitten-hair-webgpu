import {
  binaryFileReader_Web,
  createTextureFromFile_Web,
  textFileReader_Web,
} from './sys_web/loadersWeb.ts';

export const BYTES_U8 = 1;
export const BYTES_F32 = 4;
export const BYTES_U32 = 4;
export const BYTES_U64 = 8;
export const BYTES_VEC2 = BYTES_F32 * 2;
export const BYTES_VEC3 = BYTES_F32 * 3;
export const BYTES_VEC4 = BYTES_F32 * 4;
export const BYTES_UVEC2 = BYTES_U32 * 2;
export const BYTES_UVEC4 = BYTES_U32 * 4;
export const BYTES_U8_VEC4 = BYTES_U8 * 4;
export const BYTES_MAT4 = BYTES_F32 * 16;

export const NANO_TO_MILISECONDS = 0.000001;
export const MILISECONDS_TO_SECONDS = 0.001;

export const CO_PER_VERTEX = 3;
export const VERTS_IN_TRIANGLE = 3;

// deno-lint-ignore no-window-prefix no-window
export const IS_DENO = window.Deno !== undefined;
export const IS_BROWSER = !IS_DENO;
export const IS_WGPU = IS_DENO;

export const MODELS_DIR = IS_DENO ? 'static/models' : 'models';

export const DEPTH_FORMAT: GPUTextureFormat = 'depth24plus';
// Not 'rgba32float' Cause: "Color state [0] is invalid: Format Rgba32Float is not blendable"
export const HDR_RENDER_TEX_FORMAT: GPUTextureFormat = 'rgba16float';

export type ClearColor = [number, number, number, number];

export const DISPLAY_MODE = {
  FINAL: 0,
  TILES: 1,
  HW_RENDER: 2,
  USED_SLICES: 3,
};

export type HairFile =
  | 'SintelHairOriginal-sintel_hair.32points.tfx'
  | 'SintelHairOriginal-sintel_hair.24points.tfx'
  | 'SintelHairOriginal-sintel_hair.16points.tfx'
  | 'SintelHairOriginal-sintel_hair.12points.tfx'
  | 'SintelHairOriginal-sintel_hair.8points.tfx';

export const CONFIG = {
  /** Test env may require GPUBuffers to have extra COPY_* flags to readback results. Or silence console spam. */
  isTest: false,
  githubRepoLink: 'https://github.com/Scthe/nanite-webgpu',
  /** This runtime injection prevents loading Deno's libraries like fs, png, etc. */
  loaders: {
    textFileReader: textFileReader_Web,
    binaryFileReader: binaryFileReader_Web,
    createTextureFromFile: createTextureFromFile_Web,
  },
  increaseStorageMemoryLimits: false, // TODO [CRITICAL] final release?

  ///////////////
  /// GENERIC/SCENE STUFF
  clearColor: [0.2, 0.2, 0.2, 0.0] as ClearColor,

  ///////////////
  /// CAMERA
  camera: {
    position: {
      position: [0.25, 1.6, 0.6],
      rotation: [-0.4, 0.1], // [pitch, yaw]
    } satisfies CameraPosition,
    projection: {
      fovDgr: 30,
      near: 0.01,
      far: 100.0,
    },
    /** Camera rotation sensitivity */
    rotationSpeed: 1,
    /** Camera movement sensitivity */
    movementSpeed: 0.5,
    /** Camera movement sensitivity when pressing SPEED BUTTON */
    movementSpeedFaster: 3,
  },

  ///////////////
  /// LIGHTS
  lightAmbient: { color: [1, 1, 1], energy: 0.05 },
  lights: [
    { posPhi: 60.0, posTheta: 20.0, color: [1, 0.95, 0.8], energy: 0.8 },
    { posPhi: 100.0, posTheta: 75.0, color: [0.8, 0.98, 1.0], energy: 0.8 },
    { posPhi: -90.0, posTheta: 30.0, color: [1, 0.95, 0.8], energy: 0.8 },
  ] as LightCfg[],

  ///////////////
  /// HAIR
  hairFile: 'SintelHairOriginal-sintel_hair.16points.tfx' as HairFile,

  hairRender: {
    displayMode: DISPLAY_MODE.FINAL,
    fiberRadius: 0.0002,
    /** When in 'tiles' display mode, how much segments are considered full */
    dbgTileModeMaxSegments: 1700,
    /** When in 'used_slices' display mode, how much slices are considered full */
    dbgSlicesModeMaxSlices: 50, // TODO add to GUI

    ////// SHADING
    shadingPoints: 64,

    ////// TILE PASS
    tileSize: 16,
    avgSegmentsPerTile: 512,

    ////// FINE PASS
    // TODO find better values.
    slicesPerPixel: 30,
    avgFragmentsPerSlice: 16,
    processorCount: 64,
    finePassWorkgroupSizeX: 1,
    useLocalMemoryForSlicesHeads: true,

    ////// LOD
    lodRenderPercent: 100, // range [0..100]
  },

  ///////////////
  /// POSTFX-LIKE EFFECTS (dither, tonemapping, exposure, gamma etc.)
  colors: {
    gamma: 2.2,
    ditherStrength: 1.0,
    exposure: 0.45,
  },
};

export type CameraPosition = {
  position?: [number, number, number];
  rotation?: [number, number];
};

export type CameraProjection = (typeof CONFIG)['camera']['projection'];

export type LightCfg = {
  posPhi: number;
  posTheta: number;
  color: [number, number, number];
  energy: number;
};
