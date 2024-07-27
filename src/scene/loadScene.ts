import { mat4 } from 'wgpu-matrix';
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

const OBJECTS = [
  // { name: 'cube', file: 'cube.obj' },
  { name: 'sintel', file: 'sintel.obj' },
  { name: 'sintelEyes', file: 'sintel-eyes.obj' },
  // { name: 'sintelEyelashes', file: 'sintel-eyelashes.obj' },
];

export async function loadScene(device: GPUDevice): Promise<Scene> {
  const objects: Scene['objects'] = [];

  for (const objDef of OBJECTS) {
    console.groupCollapsed(objDef.name);

    const objTextFile = await CONFIG.loaders.textFileReader(
      `${MODELS_DIR}/${objDef.file}`
    );
    const result = loadObjFile(device, objDef.name, objTextFile);
    objects.push(result);
    console.groupEnd();
  }

  const tfxFile = await loadTfxFile(CONFIG.hairFile, 1.0);
  // const tfxFile = mockTfxFile();
  const hairObject = await createHairObject(device, 'sintelHair', tfxFile);
  STATS.update('Strands', formatNumber(hairObject.strandsCount, 1));
  STATS.update('Points per strand', hairObject.pointsPerStrand);
  STATS.update('Segments', formatNumber(hairObject.segmentCount, 0));

  const modelMatrix = mat4.identity();
  mat4.rotateY(modelMatrix, dgr2rad(0), modelMatrix);

  return { objects, hairObject, modelMatrix };
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
  console.log('Bounds', bounds.sphere);

  const dataBuffer = createHairDataBuffer(device, name, tfxFile, bounds.sphere);
  const pointsPositionsBuffer = createHairPointsPositionsBuffer(
    device,
    name,
    tfxFile.vertexPositions
  );
  const tangentsBuffer = createHairTangentsBuffer(device, name, tfxFile);
  const shadingBuffer = createHairShadingBuffer(device, name, tfxFile);
  const indicesData = createHairIndexBuffer(device, name, tfxFile);

  return new HairObject(
    name,
    tfxFile.header.numHairStrands,
    tfxFile.header.numVerticesPerStrand,
    bounds,
    {
      dataBuffer,
      indicesData,
      pointsPositionsBuffer,
      shadingBuffer,
      tangentsBuffer,
    }
  );
}

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

export function mockTfxFile(): TfxFileData {
  const x = 0,
    y = 0,
    z = 0,
    w = 1;
  const dy = 1;

  return {
    header: {
      version: 1,
      numHairStrands: 1,
      numVerticesPerStrand: 4,
      offsetVertexPosition: 0,
      offsetStrandUV: 0,
      offsetVertexUV: 0,
      offsetStrandThickness: 0,
      offsetVertexColor: 0,
    },
    vertexPositions: new Float32Array(
      [
        [x, y + 0 * dy, z, w],
        [x, y + 1 * dy, z, w],
        [x, y + 2 * dy, z, w],
        [x, y + 3 * dy, z, w],
      ].flat()
    ),
  };
}
