/**
https://github.com/Scthe/nanite-webgpu/blob/master/src/passes/rasterizeSw/rasterizeSwPass.wgsl.ts

Tutorials:
* https://fgiesen.wordpress.com/2013/02/10/optimizing-the-basic-rasterizer/
* https://www.scratchapixel.com/lessons/3d-basic-rendering/rasterization-practical-implementation/rasterization-stage.html
* https://jtsorlinis.github.io/rendering-tutorial/
*/
export const SW_RASTERIZE_HAIR = /* wgsl */ `


// test colors in ABGR
const COLOR_RED: u32 = 0xff0000ffu;
const COLOR_GREEN: u32 = 0xff00ff00u;
const COLOR_BLUE: u32 = 0xffff0000u;
const COLOR_TEAL: u32 = 0xffffff00u;
const COLOR_PINK: u32 = 0xffff00ffu;
const COLOR_YELLOW: u32 = 0xff00ffffu;
const COLOR_WHITE: u32 = 0xffffffffu;

struct SwHairRasterizeParams {
  viewModelMat: mat4x4f,
  projMat: mat4x4f,
  viewportSizeU32: vec2u, // u32's first, TODO unused
  strandsCount: u32, //  TODO unused
  pointsPerStrand: u32,
  viewportSize: vec2f, // f32's (AWKWARD!)
  fiberRadius: f32,
}

struct SwRasterizedHair {
  v00: vec2f,
  v01: vec2f,
  v10: vec2f,
  v11: vec2f,
  depthsProj: vec4f,
}

/** NOTE: all the comments assume you have 32 verts per strand */
fn swRasterizeHair(
  p: SwHairRasterizeParams,
  strandIdx: u32,
  segmentIdx: u32, // [0...31], we later discard 31
) -> SwRasterizedHair {
  var r: SwRasterizedHair;

  let p0_VS: vec4f = p.viewModelMat * vec4f(_getHairPointPosition(p.pointsPerStrand, strandIdx, segmentIdx    ).xyz, 1.0);
  let p1_VS: vec4f = p.viewModelMat * vec4f(_getHairPointPosition(p.pointsPerStrand, strandIdx, segmentIdx + 1).xyz, 1.0);
  let t0_VS: vec4f = p.viewModelMat * vec4f(_getHairTangent(p.pointsPerStrand, strandIdx, segmentIdx    ).xyz, 1.,);
  let t1_VS: vec4f = p.viewModelMat * vec4f(_getHairTangent(p.pointsPerStrand, strandIdx, segmentIdx + 1).xyz, 1.,);

  // Calculate bitangent vectors (cross between view space tangent and to-camera vectors)
  let right0: vec3f = safeNormalize3(cross(t0_VS.xyz, vec3f(0., 0., 1.))) * p.fiberRadius;
  let right1: vec3f = safeNormalize3(cross(t1_VS.xyz, vec3f(0., 0., 1.))) * p.fiberRadius;

  // Vertex positions
  let v00_VS = vec4f(p0_VS.xyz - right0, 1.0);
  let v01_VS = vec4f(p0_VS.xyz + right0, 1.0);
  let v10_VS = vec4f(p1_VS.xyz - right1, 1.0);
  let v11_VS = vec4f(p1_VS.xyz + right1, 1.0);
  let v00_NDC: vec3f = projectVertex(p.projMat, v00_VS);
  let v01_NDC: vec3f = projectVertex(p.projMat, v01_VS);
  let v10_NDC: vec3f = projectVertex(p.projMat, v10_VS);
  let v11_NDC: vec3f = projectVertex(p.projMat, v11_VS);
  r.v00 = ndc2viewportPx(p.viewportSize.xy, v00_NDC); // in pixels
  r.v01 = ndc2viewportPx(p.viewportSize.xy, v01_NDC); // in pixels
  r.v10 = ndc2viewportPx(p.viewportSize.xy, v10_NDC); // in pixels
  r.v11 = ndc2viewportPx(p.viewportSize.xy, v11_NDC); // in pixels
  r.depthsProj = vec4f(v00_NDC.z, v01_NDC.z, v10_NDC.z, v11_NDC.z);

  return r;
}

/** NOTE: all the comments assume you have 32 verts per strand
 * 
 * Same as swRasterizeHair(), but only for a single point, instead of both start and end points.
 * TODO Use inside swRasterizeHair()?
*/
fn swRasterizeHairPoint(
  p: SwHairRasterizeParams,
  strandIdx: u32,
  pointIdx: u32, // [0...31], we later discard 31
  v0: ptr<function, vec2f>, v1: ptr<function, vec2f>,
  depthsProj: ptr<function, vec2f>,
) {
  let p0_VS: vec4f = p.viewModelMat * vec4f(_getHairPointPosition(p.pointsPerStrand, strandIdx, pointIdx).xyz, 1.0);
  let t0_VS: vec4f = p.viewModelMat * vec4f(_getHairTangent(p.pointsPerStrand, strandIdx, pointIdx).xyz, 1.,);
  // Calculate bitangent vectors (cross between view space tangent and to-camera vectors)
  let right0: vec3f = safeNormalize3(cross(t0_VS.xyz, vec3f(0., 0., 1.))) * p.fiberRadius;

  // Vertex positions
  let v0_VS = vec4f(p0_VS.xyz - right0, 1.0);
  let v1_VS = vec4f(p0_VS.xyz + right0, 1.0);
  let v0_NDC: vec3f = projectVertex(p.projMat, v0_VS);
  let v1_NDC: vec3f = projectVertex(p.projMat, v1_VS);
  (*v0) = ndc2viewportPx(p.viewportSize.xy, v0_NDC); // in pixels
  (*v1) = ndc2viewportPx(p.viewportSize.xy, v1_NDC); // in pixels
  (*depthsProj) = vec2f(v0_NDC.z, v1_NDC.z);
}

/** Get bounding box XY points. All values in pixels as f32 */
fn getRasterizedHairBounds(
  r: SwRasterizedHair,
  viewportSize: vec2f,
) -> vec4f {
  // MAX: top right on screen, but remember Y is inverted!
  var boundRectMax = ceil(max(max(r.v00, r.v01), max(r.v10, r.v11)));
  // MIN: bottom left on screen, but remember Y is inverted!
  var boundRectMin = floor(min(min(r.v00, r.v01), min(r.v10, r.v11)));
  // scissor
  boundRectMax = min(boundRectMax, viewportSize.xy);
  boundRectMin = max(boundRectMin, vec2f(0.0, 0.0));
  return vec4f(boundRectMin, boundRectMax);
}


fn edgeFunction(v0: vec2f, v1: vec2f, p: vec2f) -> f32 {
  return (p.x - v0.x) * (v1.y - v0.y) - (p.y - v0.y) * (v1.x - v0.x);
}


struct EdgeC{ A: f32, B: f32, C: f32 }

fn edgeC(v0: vec2f, v1: vec2f) -> EdgeC{
  // from edgeFunction() formula we extract: A * p.x + B * p.y + C.
  // This way, when we iterate over x-axis, we can just add A for
  // next pixel, as the "B * p.y + C" part does not change
  var result: EdgeC;
  result.A = v1.y - v0.y; // for p.x
  result.B = -v1.x + v0.x; // for p.y
  result.C = -v0.x * v1.y + v0.y * v1.x; // rest
  return result;
}

////////////////
/// Some additional util functions below

fn debugBarycentric(w: vec4f) -> u32 {
  let color0: u32 = u32(saturate(w.x) * 255); // 0-255 as u32
  let color1: u32 = u32(saturate(w.y) * 255); // 0-255 as u32
  let color2: u32 = u32(saturate(w.z) * 255); // 0-255 as u32
  return (0xff000000u | // alpha
     color0 | // red
    (color1 << 8) | // green
    (color2 << 16) // blue
  );
}

/**
 * result[0] - value in 0-1 range along the width of the segment.
 *             0 is on the side edges, 1 is on the other one
 * result[1] - value in 0-1 range along the length of the segment,
 *             0 is near the segment start point,
 *             1 is near the segment end point
 */
fn interpolateQuad(sw: SwRasterizedHair, c: vec2f) -> vec2f {
  // vertices for edge at the start of the segment: sw.v00 , sw.v01
  let startEdgeMidpoint = (sw.v00 + sw.v01) / 2.0;
  // vertices for edge at the end of the segment: sw.v10 , sw.v11
  let endEdgeMidpoint = (sw.v10 + sw.v11) / 2.0;
  
  // project the pixel onto the strand's segment
  // (the center line between 2 original points)
  let cProjected = projectPointToLine(startEdgeMidpoint, endEdgeMidpoint, c);
  // distance from the start of the strand's segment. Range: [0..1]
  let d1 = length(cProjected - startEdgeMidpoint) / length(startEdgeMidpoint - endEdgeMidpoint);
  
  // start edge is perpendicular to tangent of the current segment
  let widthStart = length(sw.v00 - sw.v01);
  // 'End' edge is at the angle to segment's tangent.
  // It's direction is determined by the NEXT segment's tangent.
  // Project the 'end' edge onto the 'start' edge
  // using the geometric definition of dot product.
  let widthEnd = widthStart * dot(normalize(sw.v00 - sw.v01), normalize(sw.v10 - sw.v11));
  let expectedWidth = mix(widthStart, widthEnd, d1);
  // project pixel to one of the side edges
  let e1 = projectPointToLine(sw.v00, sw.v10, c);
  // distance between pixel and it's projection on the edge.
  // Divided by full width of the strand around that point
  let d0 =  length(c - e1) / expectedWidth;

  return vec2f(d0, d1);
}

fn interpolateHairF32(w: vec2f, values: vec4f) -> f32 {
  let valueStart = mix(values.x, values.y, w.x);
  let valueEnd   = mix(values.z, values.w, w.x);
  return mix(valueStart, valueEnd, w.y);
}

`;
