import { CONFIG, MODELS_DIR } from '../constants.ts';
import {
  Bounds3d,
  calcBoundingBox,
  calcBoundingSphere,
} from '../utils/bounds.ts';
import { createHairDataBuffer } from './hair/hairDataBuffer.ts';
import { createHairIndexBuffer } from './hair/hairIndexBuffer.ts';
import { HairObject } from './hair/hairObject.ts';
import { createHairPointsPositionsBuffer } from './hair/hairPointsPositionsBuffer.ts';
import { createHairTangentsBuffer } from './hair/hairTangentsBuffer.ts';
import { parseTfxFile, TfxFileData } from './hair/tfxFileLoader.ts';
import { loadObjFile } from './objLoader.ts';
import { Scene } from './scene.ts';

const OBJECTS = [
  // { name: 'cube', file: 'cube.obj' },
  { name: 'sintel', file: 'sintel.obj' },
  { name: 'sintelEyes', file: 'sintel-eyes.obj' },
  { name: 'sintelEyelashes', file: 'sintel-eyelashes.obj' },
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

  const hairObject = await loadHairObject(
    device,
    'SintelHairOriginal-sintel_hair.tfx', // 'sintel_hair.tfx',
    'sintelHair'
  );

  return { objects, hairObject };
}

async function loadHairObject(
  device: GPUDevice,
  fileName: string,
  name: string
) {
  const fileBytes = await CONFIG.loaders.binaryFileReader(
    `${MODELS_DIR}/${fileName}`
  );
  const SCALE = 1;
  const tfxFile = parseTfxFile(fileBytes, SCALE);
  // const tfxFile = mockTfxFile();

  const bBox = calcBoundingBox(tfxFile.vertexPositions, 4);
  const bounds: Bounds3d = {
    box: bBox,
    sphere: calcBoundingSphere(bBox),
  };
  console.log('Bounds', bounds);

  const dataBuffer = createHairDataBuffer(device, name, tfxFile);
  const pointsPositionsBuffer = createHairPointsPositionsBuffer(
    device,
    name,
    tfxFile.vertexPositions
  );
  const tangentsBuffer = createHairTangentsBuffer(device, name, tfxFile);
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
      tangentsBuffer,
    }
  );
}

// deno-lint-ignore no-unused-vars
function mockTfxFile(): TfxFileData {
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
