import { Vec3 } from 'webgl-obj-loader';
import { Mat4, Vec2, vec2, mat4, vec3 } from 'wgpu-matrix';
import { Dimensions } from './index.ts';
import { projectPointWithPerspDiv } from './matrices.ts';

// https://github.com/Scthe/Animation-workshop/blob/master/src/gl-utils/raycast/Ray.ts
export interface Ray {
  origin: Vec3;
  dir: Vec3;
}

/**
 * http://nelari.us/post/gizmos/
 *
 * Given camera settings and pixel position, calculate ray
 */
export const generateRayFromCamera = (
  viewport: Dimensions,
  viewProjMat: Mat4,
  mousePosPx: Vec2
): Ray => {
  const mousePosNDC = vec2.set(
    mousePosPx[0] / viewport.width,
    mousePosPx[1] / viewport.height
  );
  mousePosNDC[0] = mousePosNDC[0] * 2 - 1; // [-1 .. 1]
  mousePosNDC[1] = (1 - mousePosNDC[1]) * 2 - 1; // [-1 .. 1]

  const vpInverse = mat4.invert(viewProjMat);
  // NOTE: there is a small issue of zNear. It does not matter for 3D picking
  const p0 = vec3.set(mousePosNDC[0], mousePosNDC[1], 0); // zMin = 0
  const p1 = vec3.set(mousePosNDC[0], mousePosNDC[1], 1); // zMax = 1, does not matter, just get `dir`
  const rayOrigin = projectPointWithPerspDiv(vpInverse, p0); // technically, camera world pos. in practice, offseted by zNear, but does not matter for us
  const rayEnd = projectPointWithPerspDiv(vpInverse, p1);

  return {
    origin: rayOrigin,
    dir: vec3.normalize(vec3.subtract(rayEnd, rayOrigin)),
  };
};

/** Move `t` along ray from origin and return point */
export const getPointAlongRay = (ray: Ray, t: number) => {
  return vec3.addScaled(ray.origin, ray.dir, t);
};

/** Find closest point to 'p' that also lies on the specified ray */
export const projectPointOntoRay = (ray: Ray, p: Vec3) => {
  // dot op that we are going to use ignores ray.origin and uses (0,0,0)
  // as ray start. Subtract here from p to move to same space
  const p2 = vec3.subtract(p, ray.origin);

  // this is from the geometric definition of dot product
  const dist = vec3.dot(p2, ray.dir);
  return getPointAlongRay(ray, dist);
};

export const pointToRayDistance = (ray: Ray, p: Vec3): number => {
  const projected = projectPointOntoRay(ray, p);
  return vec3.distance(p, projected);
};

export const findClosestPointOnSegment = (
  ray: Ray,
  lineStartWS: Vec3,
  lineEndWS: Vec3,
  iters = 5
): Vec3 => {
  let left = lineStartWS;
  let right = lineEndWS;

  // binary search. There might be analytical solution, but too tired to search internet for it.
  // And it's binary search! How often you actually get to write it?
  for (let i = 0; i < iters; i++) {
    const mid = vec3.midpoint(left, right);
    const distLeft = pointToRayDistance(ray, left);
    const distRight = pointToRayDistance(ray, right);
    if (distLeft < distRight) {
      right = mid;
    } else {
      left = mid;
    }
  }

  const distLeft = pointToRayDistance(ray, left);
  const distRight = pointToRayDistance(ray, right);
  return distLeft < distRight ? left : right;
};
