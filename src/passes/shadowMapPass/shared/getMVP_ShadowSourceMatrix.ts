import { Mat4, mat4, vec3, vec4 } from 'wgpu-matrix';
import { AXIS_Y, CONFIG } from '../../../constants.ts';
import { sphericalToCartesian } from '../../../utils/index.ts';
import { Scene } from '../../../scene/scene.ts';
import { projectPoint } from '../../../utils/matrices.ts';
import { BoundingSphere } from '../../../utils/bounds.ts';

const TMP_PROJ = mat4.create();
const TMP_VIEW = mat4.create();
const TMP_MODEL_VIEW = mat4.create();
const TMP_VEC3 = vec3.create();
const TMP_VEC4 = vec4.create();

export function getShadowSourceWorldPosition() {
  const src = CONFIG.shadows.source;
  const pos = sphericalToCartesian(src.posPhi, src.posTheta, 'dgr', TMP_VEC3);
  vec3.scale(pos, src.distance, pos);
  return pos;
}

export function getShadowSourceViewMatrix(modelMatrix: Mat4) {
  const pos = getShadowSourceWorldPosition();
  const src = CONFIG.shadows.source;
  // transform by model matrix so we can handle when object moves
  const target = projectPoint(modelMatrix, src.target, TMP_VEC4);
  return mat4.lookAt(pos, target, AXIS_Y, TMP_VIEW);
}

const SAFETY_MARGIN = 1.05;
const BIG_NUMBER = 9999999;

/** this is for directional light, all rays are parallel */
export function getShadowSourceProjectionMatrix(
  modelMatrix: Mat4,
  viewMatrix: Mat4,
  scene: Scene
) {
  const mvMat = mat4.multiply(viewMatrix, modelMatrix, TMP_MODEL_VIEW);

  let left = BIG_NUMBER;
  let right = -BIG_NUMBER;
  let bottom = BIG_NUMBER;
  let top = -BIG_NUMBER;
  const near = 0.1; // I won't bother with view space calcs..
  const far = 20;

  const addBoundSphere = (s: BoundingSphere) => {
    const spOBJ = vec4.set(
      s.center[0],
      s.center[1],
      s.center[2],
      1.0,
      TMP_VEC4
    );
    const sphVP = projectPoint(mvMat, spOBJ, TMP_VEC4);
    left = Math.min(left, sphVP[0] - s.radius);
    right = Math.max(right, sphVP[0] + s.radius);
    bottom = Math.min(bottom, sphVP[1] - s.radius);
    top = Math.max(top, sphVP[1] + s.radius);
  };

  addBoundSphere(scene.hairObject.bounds.sphere);

  for (const o of scene.objects) {
    if (!o.isColliderPreview) {
      addBoundSphere(o.bounds.sphere);
    }
  }

  return mat4.ortho(
    left * SAFETY_MARGIN,
    right * SAFETY_MARGIN,
    bottom * SAFETY_MARGIN,
    top * SAFETY_MARGIN,
    near,
    far,
    TMP_PROJ
  );
}
