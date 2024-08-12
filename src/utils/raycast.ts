import { Vec3 } from 'webgl-obj-loader';
import { Mat4, Vec2, vec2, mat4, vec3, vec4 } from 'wgpu-matrix';
import { Dimensions } from './index.ts';
import { projectPointWithPerspDiv } from './matrices.ts';

// https://github.com/Scthe/Animation-workshop/blob/master/src/gl-utils/raycast/Ray.ts
export interface Ray {
  origin: Vec3;
  dir: Vec3;
}

const TMP_VEC2 = vec2.create();
const TMP_VEC4_0 = vec4.create();
const TMP_VEC4_1 = vec4.create();
const TMP_MAT_4 = mat4.create();

/**
 * http://nelari.us/post/gizmos/
 *
 * Given camera settings and pixel position, calculate ray
 */
export const generateRayFromCamera = (
  viewport: Dimensions,
  viewProjMat: Mat4,
  mousePosPx: Vec2,
  result: Ray
): Ray => {
  const mousePosNDC = vec2.set(
    mousePosPx[0] / viewport.width,
    mousePosPx[1] / viewport.height,
    TMP_VEC2
  );
  mousePosNDC[0] = mousePosNDC[0] * 2 - 1; // [-1 .. 1]
  mousePosNDC[1] = (1 - mousePosNDC[1]) * 2 - 1; // [-1 .. 1]

  const vpInverse = mat4.invert(viewProjMat, TMP_MAT_4);
  // NOTE: there is a small issue of zNear. It does not matter for 3D picking
  const p0 = vec4.set(mousePosNDC[0], mousePosNDC[1], 0, 1, TMP_VEC4_0); // zMin = 0
  const p1 = vec4.set(mousePosNDC[0], mousePosNDC[1], 1, 1, TMP_VEC4_1); // zMax = 1, does not matter, just get `dir`
  // technically, camera world pos. In practice, offseted by zNear, but does not matter for us
  const rayOrigin = projectPointWithPerspDiv(vpInverse, p0, TMP_VEC4_0);
  const rayEnd = projectPointWithPerspDiv(vpInverse, p1, TMP_VEC4_1);

  vec3.copy(rayOrigin, result.origin);
  vec3.normalize(vec3.subtract(rayEnd, rayOrigin, TMP_VEC4_1), result.dir);
  return result;
};

/** Move `t` along ray from origin and return point */
export const getPointAlongRay = (ray: Ray, t: number, result?: Vec3) => {
  return vec3.addScaled(ray.origin, ray.dir, t, result);
};

/** Find closest point to 'p' that also lies on the specified ray */
export const projectPointOntoRay = (ray: Ray, p: Vec3, result?: Vec3) => {
  // dot op that we are going to use ignores ray.origin and uses (0,0,0)
  // as ray start. Subtract here from p to move to same space
  const p2 = vec3.subtract(p, ray.origin, result);

  // this is from the geometric definition of dot product
  const dist = vec3.dot(p2, ray.dir);
  return getPointAlongRay(ray, dist, result);
};

const TMP_VEC3_pointToRayDistance = vec3.create();
export const pointToRayDistance = (ray: Ray, p: Vec3): number => {
  const projected = projectPointOntoRay(ray, p, TMP_VEC3_pointToRayDistance);
  return vec3.distance(p, projected);
};

// const TMP_VEC3_findClosestPointOnSegment = vec3.create();
const TMP_VEC3_left = vec3.create();
const TMP_VEC3_right = vec3.create();
export const findClosestPointOnSegment = (
  ray: Ray,
  lineStartWS: Vec3,
  lineEndWS: Vec3,
  iters = 5
): Vec3 => {
  const left = vec3.copy(lineStartWS, TMP_VEC3_left);
  const right = vec3.copy(lineEndWS, TMP_VEC3_right);

  // binary search. There might be analytical solution, but too tired to search internet for it.
  // And it's binary search! How often you actually get to write it?
  for (let i = 0; i < iters; i++) {
    const distLeft = pointToRayDistance(ray, left);
    const distRight = pointToRayDistance(ray, right);
    if (distLeft < distRight) {
      vec3.midpoint(left, right, right);
    } else {
      vec3.midpoint(left, right, left);
    }
  }

  const distLeft = pointToRayDistance(ray, left);
  const distRight = pointToRayDistance(ray, right);
  return distLeft < distRight ? left : right;
};
