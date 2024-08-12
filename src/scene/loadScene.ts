// deno-lint-ignore-file ban-unused-ignore
import { mat4, vec4 } from 'wgpu-matrix';
import { CONFIG, HairFile, MODELS_DIR } from '../constants.ts';
import { STATS } from '../stats.ts';
import {
  Bounds3d,
  calcBoundingBox,
  calcBoundingSphere,
} from '../utils/bounds.ts';
import { formatNumber } from '../utils/string.ts';
import { createHairDataBuffer } from './hair/hairDataBuffer.ts';
import { createHairIndexBuffer } from './hair/hairIndexBuffer.ts';
import { HairObject } from './hair/hairObject.ts';
import { createHairPointsPositionsBuffer } from './hair/hairPointsPositionsBuffer.ts';
import { createHairTangentsBuffer } from './hair/hairTangentsBuffer.ts';
import { parseTfxFile, TfxFileData } from './hair/tfxFileLoader.ts';
import { loadObjFile } from './objLoader.ts';
import { Scene } from './scene.ts';
import { dgr2rad } from '../utils/index.ts';
import { createHairShadingBuffer } from './hair/hairShadingBuffer.ts';
import { createHairSegmentLengthsBuffer } from './hair/hairSegmentLengthsBuffer.ts';
import { createArray } from '../utils/arrays.ts';
import { createSdfColliderFromBinary } from './sdfCollider/createSdfColliderFromBinary.ts';
import { GridData } from '../passes/simulation/grids/gridData.ts';

const OBJECTS = [
  // { name: 'cube', file: 'cube.obj' },
  { name: 'sintel', file: 'sintel.obj' },
  { name: 'sintelEyes', file: 'sintel-eyes.obj' },
  // { name: 'sintelEyelashes', file: 'sintel-eyelashes.obj' },
  // { name: 'sintel-collider', file: 'sintel-collider.obj' },
  // { name: 'sdf-test', file: 'sdf-test.obj' },
  /** Preview for sphere collider. I could just render a plane and turn into sphere in fragment shader.
   * Or manually construct it in code. Or.. I could just reuse everything I've already written.
   */
  { name: 'sphereCollider', file: 'sphere.obj', isColliderPreview: true },
];
const SDF_COLLIDER_BIN = { name: 'sintel-sdf', file: 'sintel-sdf.bin' };

export async function loadScene(device: GPUDevice): Promise<Scene> {
  const objects: Scene['objects'] = [];

  // load meshes
  for (const objDef of OBJECTS) {
    console.groupCollapsed(objDef.name);

    const objTextFile = await CONFIG.loaders.textFileReader(
      `${MODELS_DIR}/${objDef.file}`
    );
    const result = loadObjFile(device, objDef.name, objTextFile);
    result.isColliderPreview = Boolean(objDef.isColliderPreview);
    objects.push(result);
    console.groupEnd();
  }
  vec4.copy(
    CONFIG.hairSimulation.collisionSphere,
    CONFIG.hairSimulation.collisionSphereInitial
  );

  // load hair
  const tfxFile = await loadTfxFile(CONFIG.hairFile, 1.0);
  // const tfxFile = mockTfxFile();
  const hairObject = await createHairObject(device, 'sintelHair', tfxFile);
  CONFIG.pointsPerStrand = hairObject.pointsPerStrand;
  STATS.update('Strands', formatNumber(hairObject.strandsCount, 1));
  STATS.update('Points per strand', hairObject.pointsPerStrand);
  STATS.update('Segments', formatNumber(hairObject.segmentCount, 0));

  // SDF collider
  /*const sintelObj = objects.find((o) => o.name === 'sintel')!;
  const sdfCollider = createMockSdfCollider(device, 'sintel-sdf', {
    bounds: sintelObj.bounds.box,
    dims: 16,
  });*/
  const sdfFileBin = await CONFIG.loaders.binaryFileReader(
    `${MODELS_DIR}/${SDF_COLLIDER_BIN.file}`
  );
  const sdfCollider = createSdfColliderFromBinary(
    device,
    SDF_COLLIDER_BIN.name,
    sdfFileBin
  );

  // physics grid
  const physicsGrid = new GridData(device, hairObject.bounds.box);

  // model matrix
  const modelMatrix = mat4.identity();
  mat4.rotateY(modelMatrix, dgr2rad(0), modelMatrix);

  return { objects, hairObject, sdfCollider, modelMatrix, physicsGrid };
}

export function createHairObject(
  device: GPUDevice,
  name: string,
  tfxFile: TfxFileData
) {
  const bBox = calcBoundingBox(tfxFile.vertexPositions, 4);
  const bounds: Bounds3d = {
    box: bBox,
    sphere: calcBoundingSphere(bBox),
  };
  console.log('Hair bounds', bounds.sphere);

  const dataBuffer = createHairDataBuffer(device, name, tfxFile, bounds.sphere);
  const tangentsBuffer = createHairTangentsBuffer(device, name, tfxFile);
  const shadingBuffer = createHairShadingBuffer(device, name, tfxFile);
  const indicesData = createHairIndexBuffer(device, name, tfxFile);
  const initialSegmentLengthsBuffer = createHairSegmentLengthsBuffer(
    device,
    name,
    tfxFile.header.numVerticesPerStrand,
    tfxFile.vertexPositions
  );

  const createPosBuffer = (name: string, extraUsage: GPUBufferUsageFlags = 0) =>
    createHairPointsPositionsBuffer(
      device,
      name,
      tfxFile.vertexPositions,
      extraUsage
    );

  const initialPointsPositionsBuffer = createPosBuffer(
    `${name}-points-positions-initial`,
    GPUBufferUsage.COPY_SRC
  );
  const pointsPositionsBuffer_0 = createPosBuffer(`${name}-points-positions-0`);
  const pointsPositionsBuffer_1 = createPosBuffer(`${name}-points-positions-1`);

  return new HairObject(
    name,
    tfxFile.header.numHairStrands,
    tfxFile.header.numVerticesPerStrand,
    bounds,
    {
      dataBuffer,
      indicesData,
      initialPointsPositionsBuffer,
      initialSegmentLengthsBuffer,
      pointsPositionsBuffer_0,
      pointsPositionsBuffer_1,
      shadingBuffer,
      tangentsBuffer,
    }
  );
}

// deno-lint-ignore no-unused-vars
async function loadTfxFile(
  fileName: HairFile,
  scale = 1.0
): Promise<TfxFileData> {
  console.log(`Loading hair file: '${fileName}'`);
  const fileBytes = await CONFIG.loaders.binaryFileReader(
    `${MODELS_DIR}/${fileName}`
  );
  return parseTfxFile(fileBytes, scale);
}

// deno-lint-ignore no-unused-vars
export function mockTfxFile(): TfxFileData {
  CONFIG.hairRender.fiberRadius = 0.005;
  const centerX = 0;
  // const startY = 1.524; // dbg: in front of the scene
  // const startZ = 0.15; // dbg: in front of the scene
  const startY = 1.624; // dbg: on top of the head
  const startZ = 0.09; // dbg: on top of the head
  const dx = 0.015;
  const dy = 0.01;
  const pointsPerStrand = 8;
  const numHairStrands = 32;

  const createStrand = (x: number) =>
    createArray(pointsPerStrand)
      .map((_, i) => [
        x,
        startY - i * dy, // goes down
        startZ,
        i === 0 ? 0 : 1, // .w is 0 for root, 1 otherwise
      ])
      .flat();

  const startX = centerX - ((numHairStrands - 1) * dx) / 2.0;
  const strandXs = createArray(numHairStrands).map((_, i) => startX + dx * i);

  return {
    header: {
      version: 1,
      numHairStrands,
      numVerticesPerStrand: pointsPerStrand,
      offsetVertexPosition: 0,
      offsetStrandUV: 0,
      offsetVertexUV: 0,
      offsetStrandThickness: 0,
      offsetVertexColor: 0,
    },
    vertexPositions: new Float32Array([...strandXs.map(createStrand).flat()]),
  };
}
