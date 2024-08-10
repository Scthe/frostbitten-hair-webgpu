import { Mat4, mat4, vec4, Vec4, Vec3 } from 'wgpu-matrix';
import { CameraProjection } from '../constants.ts';
import { Dimensions, dgr2rad } from './index.ts';

export function createCameraProjectionMat(
  camera: CameraProjection,
  viewportSize: Dimensions
): Mat4 {
  const aspectRatio = viewportSize.width / viewportSize.height;

  return mat4.perspective(
    dgr2rad(camera.fovDgr),
    aspectRatio,
    camera.near,
    camera.far
  );
}

export function getViewProjectionMatrix(
  viewMat: Mat4,
  projMat: Mat4,
  result?: Mat4
): Mat4 {
  return mat4.multiply(projMat, viewMat, result);
}

export function getModelViewProjectionMatrix(
  modelMat: Mat4,
  viewMat: Mat4,
  projMat: Mat4,
  result?: Mat4
): Mat4 {
  result = mat4.multiply(viewMat, modelMat, result);
  result = mat4.multiply(projMat, result, result);
  return result;
}

export function projectPoint(mvpMatrix: Mat4, p: Vec4 | Vec3, result?: Vec4) {
  let v: Vec4;
  if (p.length === 4) {
    if (p[3] !== 1) throw new Error(`Tried to project a point, but provided Vec4 has .w !== 1`); // prettier-ignore
    v = p;
  } else {
    v = vec4.create(p[0], p[1], p[2], 1);
  }
  return vec4.transformMat4(v, mvpMatrix, result);
}

export function projectPointWithPerspDiv(
  mvpMatrix: Mat4,
  p: Vec4 | Vec3,
  result?: Vec4
) {
  const result2 = projectPoint(mvpMatrix, p, result);
  vec4.divScalar(result2, result2[3], result2);
  return result2;
}
