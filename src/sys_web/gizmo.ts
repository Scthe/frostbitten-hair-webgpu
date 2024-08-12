import { Mat4, Vec3, mat4, vec3, vec4 } from 'wgpu-matrix';
import { getViewProjectionMatrix } from '../utils/matrices.ts';
import { Dimensions } from '../utils/index.ts';
import Input from './input.ts';
import {
  Ray,
  findClosestPointOnSegment,
  generateRayFromCamera,
  pointToRayDistance,
  projectPointOntoRay,
} from '../utils/raycast.ts';
import { CONFIG, GizmoAxis, GizmoAxisIdx } from '../constants.ts';
import { Plane, planeRayIntersection } from '../utils/raycast.plane.ts';

/*
WARNING: THIS FILE CONTAINS VERY PROFESSIONAL CODE. DO NOT BE AWED (TOO MUCH)!
*/

const AXIS_VEC_X = vec3.create(1, 0, 0);
const AXIS_VEC_Y = vec3.create(0, 1, 0);
const AXIS_VEC_Z = vec3.create(0, 0, 1);
const AXIS_VECTORS = [AXIS_VEC_X, AXIS_VEC_Y, AXIS_VEC_Z];
const HOVERED_AXIS: GizmoAxisIdx[] = [
  GizmoAxis.AXIS_X,
  GizmoAxis.AXIS_Y,
  GizmoAxis.AXIS_Z,
];

/** Offset from ball center to start of rendered gizmo. */
const GIZMO_TO_BALL_DISTANCE = CONFIG.colliderGizmo.lineLength * 0.1;

// prealloc
const TMP_LINE_START = vec4.create();
const TMP_LINE_END = vec4.create();
const TMP_VIEW_PROJ_MAT = mat4.create();
const TMP_CAMERA_RAY: Ray = {
  origin: vec3.create(),
  dir: vec3.create(),
};

export const setCursor = (
  cursor: 'default' | 'grab' | 'grabbing' | 'move' | 'pointer'
) => (document.body.style.cursor = cursor);

export function createGizmoController() {
  const cfg = CONFIG.colliderGizmo;
  // when user clicks gizmo axis, the click position is not in the center of the ball.
  // We have to apply correction during dragging.
  let gizmoClickPosCorrection = 0;

  return function (
    inputState: Input,
    viewportSize: Dimensions,
    viewMatrix: Mat4,
    projMatrix: Mat4
  ): boolean {
    let nextIsDragging = inputState.mouse.touching;

    const mousePx = [inputState.mouse.x, inputState.mouse.y];
    const viewProjMat = getViewProjectionMatrix(
      viewMatrix,
      projMatrix,
      TMP_VIEW_PROJ_MAT
    );
    const cameraRay = generateRayFromCamera(
      viewportSize,
      viewProjMat,
      mousePx,
      TMP_CAMERA_RAY
    );

    if (cfg.isDragging) {
      applyDragMovement(cameraRay, gizmoClickPosCorrection);
    } else {
      const clickedGizmoPoint = vec3.create();
      const hoveredAxis = checkGizmoHover(cameraRay, clickedGizmoPoint);
      updateHoverState(hoveredAxis);

      // calc diff between clicked point and actual sphere
      const colSphereWS = CONFIG.hairSimulation.collisionSphere;
      gizmoClickPosCorrection = vec3.distance(colSphereWS, clickedGizmoPoint);

      if (nextIsDragging) {
        nextIsDragging = hoveredAxis !== GizmoAxis.NONE;
        setCursor('grabbing');
      }
    }

    cfg.isDragging = nextIsDragging; // next frame will reset the cursor if stopped dragging
    return nextIsDragging;
  };
}

function applyDragMovement(cameraRay: Ray, gizmoClickPosCorrection: number) {
  const cfg = CONFIG.colliderGizmo;
  const ball = CONFIG.hairSimulation.collisionSphere;
  // deno-lint-ignore no-explicit-any
  const axisIdx: GizmoAxisIdx = cfg.activeAxis as any;

  const moveRay: Ray = {
    dir: AXIS_VECTORS[axisIdx],
    origin: ball,
  };

  // select projection plane
  const plane: Plane = {
    normal: cameraRay.dir,
    d: -vec3.dot(cameraRay.dir, ball),
  };

  // project click ray onto plane
  const posNext_onPlane = planeRayIntersection(cameraRay, plane);
  let posNext = projectPointOntoRay(moveRay, posNext_onPlane);
  // console.log(plane.normal);

  const correction = gizmoClickPosCorrection;
  posNext = vec3.addScaled(posNext, moveRay.dir, -correction);

  // apply move
  ball[axisIdx] = posNext[axisIdx];
}

function checkGizmoHover(
  cameraRay: Ray,
  out_clickedGizmoPoint: Vec3
): GizmoAxisIdx {
  const { lineWidth, hoverPadding } = CONFIG.colliderGizmo;

  let closestDistance = Number.MAX_SAFE_INTEGER;
  let closestAxisIdx: GizmoAxisIdx = 0;

  // find closest axis
  AXIS_VECTORS.forEach((axisVec, axisIdx) => {
    const [lineStartWS, lineEndWS] = getAxisRenderedPoints(axisVec);
    const distance = Math.min(
      pointToRayDistance(cameraRay, lineStartWS),
      pointToRayDistance(cameraRay, lineEndWS)
    );
    if (distance < closestDistance) {
      closestDistance = distance;
      // deno-lint-ignore no-explicit-any
      closestAxisIdx = axisIdx as any;
    }
  });

  // check if the mouse is close enough to the axis
  // console.log('closestAxis', { closestAxis }, mousePx);
  const axisVec = AXIS_VECTORS[closestAxisIdx];
  const [lineStartWS, lineEndWS] = getAxisRenderedPoints(axisVec);
  const closestAxisGizmoPoint = findClosestPointOnSegment(
    cameraRay,
    lineStartWS,
    lineEndWS
  );
  const dist = pointToRayDistance(cameraRay, closestAxisGizmoPoint);
  const hoverMargin = lineWidth * hoverPadding;
  if (dist < hoverMargin) {
    vec3.copy(closestAxisGizmoPoint, out_clickedGizmoPoint);
    return closestAxisIdx;
  } else {
    return GizmoAxis.NONE;
  }
}

function updateHoverState(activeAxis: GizmoAxisIdx) {
  // console.log('Axis', closestAxisIdx, dist);
  if (activeAxis === GizmoAxis.NONE) {
    CONFIG.colliderGizmo.activeAxis = GizmoAxis.NONE;
    setCursor('default');
  } else {
    CONFIG.colliderGizmo.activeAxis = HOVERED_AXIS[activeAxis];
    setCursor('grab');
  }
}

/** calc axis gizmo sample points (world space) */
function getAxisRenderedPoints(axisVec: Vec3) {
  const { lineLength } = CONFIG.colliderGizmo;
  const colSphereWS = CONFIG.hairSimulation.collisionSphere;

  const lineStartWS = vec3.addScaled(
    colSphereWS,
    axisVec,
    GIZMO_TO_BALL_DISTANCE,
    TMP_LINE_START
  );
  const lineEndWS = vec3.addScaled(
    lineStartWS,
    axisVec,
    lineLength,
    TMP_LINE_END
  );
  return [lineStartWS, lineEndWS];
}
