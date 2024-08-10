import { Mat4, Vec3, vec3, vec4 } from 'wgpu-matrix';
import { getViewProjectionMatrix } from '../utils/matrices.ts';
import { Dimensions } from '../utils/index.ts';
import Input from './input.ts';
import {
  findClosestPointOnSegment,
  generateRayFromCamera,
  pointToRayDistance,
} from '../utils/raycast.ts';
import { CONFIG, GizmoHoverState } from '../constants.ts';

/*
WARNING: THIS FILE CONTAINS VERY PROFESSIONAL CODE. DO NOT BE AWED (TOO MUCH)!
*/

const AXIS_X = vec3.create(1, 0, 0);
const AXIS_Y = vec3.create(0, 1, 0);
const AXIS_Z = vec3.create(0, 0, 1);
const AXIS = [AXIS_X, AXIS_Y, AXIS_Z];
const HOVERED_AXIS = [
  GizmoHoverState.AXIS_X,
  GizmoHoverState.AXIS_Y,
  GizmoHoverState.AXIS_Z,
];

// prealloc
const TMP_LINE_START = vec4.create();
const TMP_LINE_END = vec4.create();

export const setCursor = (
  cursor: 'default' | 'grab' | 'grabbing' | 'move' | 'pointer'
) => (document.body.style.cursor = cursor);

export function checkMouseGizmo(
  inputState: Input,
  viewportSize: Dimensions,
  viewMatrix: Mat4,
  projMatrix: Mat4
) {
  const { lineWidth, hoverPadding } = CONFIG.colliderGizmo;
  const mousePx = [inputState.mouse.x, inputState.mouse.y];
  const viewProjMat = getViewProjectionMatrix(viewMatrix, projMatrix);
  const cameraRay = generateRayFromCamera(viewportSize, viewProjMat, mousePx);

  let closestDistance = Number.MAX_SAFE_INTEGER;
  let closestAxisIdx = 0;

  // find closest axis
  AXIS.forEach((axisVec, axisIdx) => {
    const [lineStartWS, lineEndWS] = getAxisVector(axisVec);
    const distance = Math.min(
      pointToRayDistance(cameraRay, lineStartWS),
      pointToRayDistance(cameraRay, lineEndWS)
    );
    if (distance < closestDistance) {
      closestDistance = distance;
      closestAxisIdx = axisIdx;
    }
  });

  // check if the mouse is close enough to the axis
  // console.log('closestAxis', { closestAxis }, mousePx);
  const axisVec = AXIS[closestAxisIdx];
  const [lineStartWS, lineEndWS] = getAxisVector(axisVec);
  const closestAxisGizmoPoint = findClosestPointOnSegment(
    cameraRay,
    lineStartWS,
    lineEndWS
  );
  const dist = pointToRayDistance(cameraRay, closestAxisGizmoPoint);
  const hoverMargin = lineWidth * hoverPadding;
  if (dist < hoverMargin) {
    // console.log('Axis', closestAxisIdx, dist);
    CONFIG.colliderGizmo.hoverState = HOVERED_AXIS[closestAxisIdx];
    setCursor('grab');
  } else {
    CONFIG.colliderGizmo.hoverState = GizmoHoverState.NONE;
    setCursor('default');
  }
}

/** calc axis gizmo sample points (world space) */
function getAxisVector(axisVec: Vec3) {
  const { lineLength } = CONFIG.colliderGizmo;
  const colSphereWS = CONFIG.hairSimulation.collisionSphere;

  const lineStartWS = vec3.addScaled(
    colSphereWS,
    axisVec,
    lineLength * 0.1,
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
