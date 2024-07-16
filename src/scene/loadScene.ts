import { CONFIG, MODELS_DIR } from '../constants.ts';
import { loadObjFile } from './objLoader.ts';
import { Scene } from './scene.ts';

export async function loadScene(device: GPUDevice): Promise<Scene> {
  const objTextFile = await CONFIG.loaders.textFileReader(
    `${MODELS_DIR}/cube.obj`
  );
  const cubeObj = loadObjFile(device, 'cube', objTextFile);

  return { objects: [cubeObj] };
}
