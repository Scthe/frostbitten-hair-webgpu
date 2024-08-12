import { Vec3 } from 'webgl-obj-loader';
import { vec3 } from 'wgpu-matrix';
import { Ray, getPointAlongRay } from './raycast.ts';

// https://github.com/Scthe/Animation-workshop/blob/master/src/gl-utils/raycast/Plane.ts

const TMP_VEC3 = vec3.create();

export interface Plane {
  normal: Vec3;
  d: number;
}

/**
 * Assuming infinte plane, get intersection, where ray crosses the plane. returns t for ray
 * @see https://stackoverflow.com/questions/23975555/how-to-do-ray-plane-intersection
 * @see https://www.cs.princeton.edu/courses/archive/fall00/cs426/lectures/raycast/sld017.htm
 */
const planeRayIntersectionDistance = (ray: Ray, plane: Plane) => {
  const nom = plane.d + vec3.dot(ray.origin, plane.normal, TMP_VEC3);
  const denom = vec3.dot(ray.dir, plane.normal); // project to get how fast we closing in
  return -nom / denom;
};

/** Assuming infinte plane, get intersection where ray crosses the plane. returns 3d point */
export const planeRayIntersection = (ray: Ray, plane: Plane, result?: Vec3) => {
  const t = planeRayIntersectionDistance(ray, plane);
  return getPointAlongRay(ray, t, result);
};
