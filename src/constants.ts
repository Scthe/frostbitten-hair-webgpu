import {
  binaryFileReader_Web,
  createTextureFromFile_Web,
  textFileReader_Web,
} from './sys_web/loadersWeb.ts';
import { ValueOf } from './utils/index.ts';

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
export const NORMALS_TEX_FORMAT: GPUTextureFormat = 'rg16float';
export const AO_TEX_FORMAT: GPUTextureFormat = 'r16float';

export const AXIS_Y = [0, 1, 0];

export type ClearColor = [number, number, number, number];
type RGBColor = [number, number, number];

export const DISPLAY_MODE = {
  FINAL: 0,
  /** Hair tiles using segment count per-tile buffer */
  TILES: 1,
  /** Hair tiles using PPLL */
  TILES_PPLL: 2,
  /** Harware rasterize */
  HW_RENDER: 3,
  /** HairFinePass' slices per pixel. Not super accurate due to per pixel/tile early-out optimizations */
  USED_SLICES: 4,
  /**zBuffer clamped to sensible values */
  DEPTH: 5,
  NORMALS: 6,
  AO: 7,
};

export type HairFile =
  | 'SintelHairOriginal-sintel_hair.32points.tfx'
  | 'SintelHairOriginal-sintel_hair.24points.tfx'
  | 'SintelHairOriginal-sintel_hair.16points.tfx'
  | 'SintelHairOriginal-sintel_hair.12points.tfx'
  | 'SintelHairOriginal-sintel_hair.8points.tfx';

// export type SliceHeadsMemory = 'global' | 'workgroup' | 'registers';
export type SliceHeadsMemory = 'registers';
export type SdfPreviewAxis = 'axis-x' | 'axis-y' | 'axis-z';

export const GizmoAxis = {
  AXIS_X: 0,
  AXIS_Y: 1,
  AXIS_Z: 2,
  NONE: 3,
} as const;
export type GizmoAxisIdx = ValueOf<typeof GizmoAxis>;

export const GridDebugValue = {
  DENSITY: 0,
  DENSITY_GRADIENT: 1,
  VELOCITY: 2,
  WIND: 3,
} as const;
export type GridDebugValueNum = ValueOf<typeof GizmoAxis>;

export const CONFIG = {
  /** Test env may require GPUBuffers to have extra COPY_* flags to readback results. Or silence console spam. */
  isTest: false,
  githubRepoLink: 'https://github.com/Scthe/frostbitten-hair-webgpu',
  /** This runtime injection prevents loading Deno's libraries like fs, png, etc. */
  loaders: {
    textFileReader: textFileReader_Web,
    binaryFileReader: binaryFileReader_Web,
    createTextureFromFile: createTextureFromFile_Web,
  },
  increaseStorageMemoryLimits: true,
  displayMode: DISPLAY_MODE.FINAL,

  ///////////////
  /// GENERIC/SCENE STUFF
  clearColor: [0.2, 0.2, 0.2, 0.0] as ClearColor,
  clearNormals: [0.0, 0.0, 0.0, 0.0] as ClearColor,
  clearAo: [0.0, 0.0, 0.0, 0.0] as ClearColor,
  background: {
    color0: col(22, 162, 188),
    color1: col(14, 103, 120),
    noiseScale: 5.0,
    gradientStrength: 0.5,
  },
  colliderGizmo: {
    /** Length of each of 3 drawn axis */
    lineLength: 0.04,
    /** Width of each of 3 drawn axis */
    lineWidth: 0.002,
    /** Better accessibility to increase the 'hitbox'. Not visible in render. */
    hoverPadding: 1.5,
    /** Either hovered over or dragged. Use 'isDragging' to determine which */
    activeAxis: GizmoAxis.NONE as GizmoAxisIdx,
    isDragging: false,
  },
  /** Hide the ball. Does not hide gizmo */
  drawColliders: true,

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
    /** Camera movement sensitivity when pressing THE SPEED BUTTON */
    movementSpeedFaster: 3,
  },

  ///////////////
  /// LIGHTS + SHADOWS + AO
  lightAmbient: { color: [1, 1, 1], energy: 0.05 },
  lights: [
    { posPhi:  60.0, posTheta: 20.0, color: col(255, 244, 204), energy: 0.8 }, // prettier-ignore
    { posPhi: 100.0, posTheta: 97.0, color: col(204, 249, 255), energy: 0.8 }, // prettier-ignore
    { posPhi: -90.0, posTheta: 30.0, color: col(255, 242, 204), energy: 0.8 }, // prettier-ignore
  ] as LightCfg[],

  /** https://github.com/Scthe/WebFX/blob/09713a3e7ebaa1484ff53bd8a007908a5340ca8e/src/Config.ts#L79 */
  shadows: {
    showDebugView: false,
    debugViewPosition: IS_DENO ? [0, 0] : [250, 0], // deno does not render stats window
    depthFormat: 'depth24plus' as GPUTextureFormat,
    textureSize: 1024 * 2,
    // runtime settings
    usePCSS: false,
    PCF_Radius: 3, // in pixels
    bias: 0.0005,
    strength: 0.4, // Limit how much shadows affect the scene (meshes-only, hair has it's own). Non-physical, but makes things prettier.
    /** Make hair wider for shadows */
    hairFiberWidthMultiplier: 1.0,
    // shadow source
    source: {
      posPhi: 37, // horizontal [dgr]
      posTheta: 45, // verical [dgr]
      distance: 5.0,
      target: [0, 2, 0],
    },
  },

  /** The usual settings for GTAO etc. BOOOORING */
  ao: {
    textureSizeMul: 0.5, // half/quater-res, wrt. MSAA
    radius: 2.0,
    directionOffset: 0.0,
    falloffStart2: 0.16,
    falloffEnd2: 4.0,
    numDirections: 12,
    numSteps: 8,
    strength: 0.4,
  },

  ///////////////
  /// HAIR
  /** Name of the file from "static/models" directory. Each file was exported from Blender using the script from './scripts' */
  hairFile: 'SintelHairOriginal-sintel_hair.16points.tfx' as HairFile,
  pointsPerStrand: -1, // will be set at runtime. Added here to have nicer workgroups.

  hairRender: {
    /** Width of the hair */
    fiberRadius: 0.0006,
    /** When in 'tiles' display mode, how much segments are considered full */
    dbgTileModeMaxSegments: 370,
    /** When in 'used_slices' display mode, how much slices are considered full */
    dbgSlicesModeMaxSlices: 50,
    /** When in 'final' display mode, show tile boundaries */
    dbgShowTiles: false,

    material: {
      color0: col(119, 43, 119), // color root
      color1: col(76, 0, 255), // color tip
      specular: 0.9, // weight for lobe: R
      weightTT: 0.0, // weight for lobe: TT. It needs depth test as light ignores meshes and affects stuff 'through' them.
      weightTRT: 1.4, // weight for lobe: TRT
      shift: 0.0, // Marschner param
      roughness: 0.3, // Marschner param
      colorRng: 0.1, // Randomize colors per-strand. Makes them different instead of just a lump of color. [0 .. 1]
      lumaRng: 0.1, // Randomize luma  per-strand. Makes them different instead of just a lump of color. [0 .. 1]
      attenuation: 30.0, // Fake attenuation mimicking https://en.wikipedia.org/wiki/Beer%E2%80%93Lambert_law . Compare how far strand is wrt. depth buffer and make it darker.
      shadows: 0.5, // Limit how much shadows affect the scene (hair-only, meshes have own param). Non-physical, but makes things prettier.
    },

    ////// SHADING
    /** Warning: last shading point has forced alpha blend to 0 to imitate thin tip. Knowing that, go on. Set this to 2. */
    shadingPoints: 64,

    ////// TILE PASS
    /** IF YOU CHANGE TILE SIZE, DO NOT FORGET TO TUNE `invalidTilesPerSegmentThreshold`.
     *
     * If you get memory limit error, just set `increaseStorageMemoryLimits = true` to allocate more than 128MB.
     */
    tileSize: 8,
    /** For each tile, we store data split by depth (wrt. hair object bounding sphere bounds). It's the ponytail optimization from Frostbite's talk. */
    tileDepthBins: 32,
    /** Allocate memory for PPLL data */
    avgSegmentsPerTile: 128,
    /**
     * > THIS SETTING IS **VERY** IMPORTANT. AND I'M USING A WORD "VERY", SO YOU KNOW IT'S SERIOUS.
     *
     * Reject degenerate strands from physics simulation. Imagine hair segment
     * is launched into stratosphere and somehow (very somehow!) covers 100+ tiles.
     * This is terrible for performance. Reject such cases on per-segment basis.
     *
     * IF YOU SEE MISSING SEGMENTS, INCREASE THIS VALUE. IT'S EITHER THIS
     * OR THE STRAND IS COLLIDING WITH MESH. BUT YOU WOULD NOT HAVE SUSPECTED
     * ANYTHING WRONG IF IT WAS A SIMPLE COLLISION (INCREASE SDF OFFSET,
     * OR HIDE THE BALL IN THAT CASE).
     */
    invalidTilesPerSegmentThreshold: 64 * 2,

    ////// SORT PASS
    sortBuckets: 64,
    sortBucketSize: 16,

    ////// FINE PASS
    /** This is like slices per pixel in original Frostbite presentation, but the slices are inside each depth bin */
    slicesPerPixel: 8,
    /** Allocate memory for PPLL data */
    avgFragmentsPerSlice: 16,
    /** If you have a lot of slices, naive impl. would require `viewport.x * viewport.y * slicesPerPixel * sizeof(u32)` data. This is SIGNIFICANTLY reduced if ponytail optimization is implemented (as I did). Still, to limit memory, we use task queue. Each processor grabs tiles from a queue. We might (?) not even be able to dispatch all processors at once (hw and sliceHeadsMemory dependent). Does not matter cause task queue. */
    processorCount: 64 * 8,
    /** (1, 1, 1) dispatch. I am not going to comment on this. If you know what that means, that statement is probably enough. Change will decrease performance. Kinda wonder if Frostbite team found a way around this? The divergence is.. it is. */
    // finePassWorkgroupSizeX: 1, // TODO remove
    /** Where to store the PPLL slice heads data */
    sliceHeadsMemory: 'registers' as SliceHeadsMemory, // TODO remove
    /** Given distance between pixel and strand, how to calculate alpha? Can be linear 0-1 from strand edge to middle. Or quadratic (faster, denser, but more error prone and 'blocky'). */
    alphaQuadratic: false,
    /** Alpha comes from pixel's distance to strand. Multiply to make strands "fatter". Faster pixel/tile convergence at the cost of Anti Alias. fuzzy edges. */
    alphaMultipler: 1.1,

    ////// LOD
    lodRenderPercent: 100, // LOD %. Fun fact, performance is NOT linear. Range [0..100]
  },

  hairSimulation: {
    enabled: true,
    /**
     * Hair physics is not essential. It never drives a gameplay behaviour.
     * It's fine to hardcode delta time. It guarantees stability, which is more important.
     * We are also VSYNCed in the browser.
     * TODO [IGNORE] Ofc. we should still scale it a bit to prevent physics speed up on 144Hz displays
     */
    deltaTime: 1.0 / 30.0,
    nextFrameResetSimulation: false, // the reset button from GUI
    gravity: 0.03,
    // 0.0 - use particle position change in verlet integration
    // 1.0 - use averaged particle position changes in grid to drive verlet integration
    // https://youtu.be/ool2E8SQPGU?si=yKgmYF6Wjbu6HXsF&t=815
    friction: 0.3,
    // 0.0 - do not use density gradient as external force. Hair can "squish" together
    // >0.0 - move hair strands from densely occupied grid cells into ones that are more "free"
    volumePreservation: 0.00003,
    // If you set the radius to 0, the ball will disappear. There is a reason for this statement.
    // collisionSphere: [0.05, 1.48, 0.01, 0.06], // inside hair
    collisionSphere: [-0.18, 1.56, 0.06, 0.06], // [x, y, z, radius]
    collisionSphereInitial: [0, 0, 0, 0], // will get filled at runtime. Used to reset the sphere

    /** It's the usual constraints + stiffness stuff */
    constraints: {
      constraintIterations: 7, // more means more stable and expensive
      // length constraint. Matches current distance between points to the one from the original imported asset.
      stiffnessLengthConstr: 1.0,
      // global shape constraint. Matches current point positions to the one from the original imported asset. Set this to 1.0 and no change is possible.
      stiffnessGlobalConstr: 0.2, // this constraint is stronger near root and fades toward the tip
      globalExtent: 0.1, // full global constraint stiffness. 0.2 means that 20% of the near-root strand will be forced to 100% conform to this constraint
      globalFade: 0.75, // partial global constraint stiffness. 0.4 means that 40% of the strand AFTER EXTENT will be forced to progressively less-conform to this constraint. With extent 0.2 and fade 0.4, the strand between 20-60% will have progresively weaker this constraint.
      // local shape constraint. Tries to preserve relative angles between 3 consecutive points.
      // See "A Triangle Bending Constraint Model for Position-Based Dynamics".
      //        [Kelager10] http://image.diku.dk/kenny/download/kelager.niebe.ea10.pdf
      stiffnessLocalConstr: 0.3,
      // collisions with the ball
      stiffnessCollisions: 1.0,
      // collisions with the character face using Signed Distance Fields (SDF).
      stiffnessSDF: 1.0,
    },

    wind: {
      dirPhi: 18, // horizontal [dgr]
      dirTheta: 91, // verical [dgr]
      strength: 0.0,
      strengthLull: 0.75, // wind strength for points *inside* the mesh. Points *obscured* by collider (on the other side of the wind) will be affected with average of 'strength' and 'strengthLull'
      strengthFrequency: 1.8, // how often to flutter
      strengthJitter: 0.7, // randomize strength per-strand
      phaseOffset: 0.45, // randomize phase. This way not all strands jitter at the same time
      colisionTraceOffset: 1.5, // Multiplier for SDF distance used when detecting collisions
    },

    physicsForcesGrid: {
      dims: 64, // 8x8x8 grid etc.
      enableUpdates: true,
      scale: 2.0, // twice the size of the initial hair. Should be enough to skip edge cases
      // DEBUG:
      showDebugView: false,
      debugSlice: 0.5,
      debugValue: GridDebugValue.DENSITY_GRADIENT as GridDebugValueNum,
      debugAbsValue: true, // abs() before showing to the user
    },

    sdf: {
      /** - **Negative value** pushes the SDF outwards making it bigger. This increases collision range.
       *  - **Positive value** moves inwards, making SDF smaller. */
      distanceOffset: -0.0015,
      // DEBUG:
      showDebugView: false,
      debugSlice: 0.5,
      debugSemitransparent: true,
    },
  },

  ///////////////
  /// POSTFX-LIKE EFFECTS (dither, tonemapping, exposure, gamma etc.)
  colors: {
    gamma: 2.2,
    ditherStrength: 1.0,
    exposure: 0.85,
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
  color: RGBColor;
  energy: number;
};

/** Takes color expressed as 0-255 (copied from GUI) and turns into 0.0-1.0 */
function col(...colorU8: number[]): RGBColor {
  if (colorU8.length !== 3) {
    throw new Error(`Config color value ${JSON.stringify(colorU8)} is invalid`);
  }
  // deno-lint-ignore no-explicit-any
  return colorU8.map((b: number) => b / 255.0) as any;
}
