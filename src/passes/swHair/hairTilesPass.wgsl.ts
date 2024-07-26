import { BUFFER_HAIR_DATA } from '../../scene/hair/hairDataBuffer.ts';
import { BUFFER_HAIR_POINTS_POSITIONS } from '../../scene/hair/hairPointsPositionsBuffer.ts';
import { BUFFER_HAIR_TANGENTS } from '../../scene/hair/hairTangentsBuffer.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import * as SHADER_SNIPPETS from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { SW_RASTERIZE_HAIR } from './shared/swRasterizeHair.wgsl.ts';
import { BUFFER_HAIR_TILES_RESULT } from './shared/hairTilesResultBuffer.ts';
import { BUFFER_HAIR_TILE_SEGMENTS } from './shared/hairTileSegmentsBuffer.ts';
import { CONFIG } from '../../constants.ts';
import { SHADER_TILE_UTILS } from './shaderImpl/tileUtils.wgsl.ts';

export const SHADER_PARAMS = {
  workgroupSizeX: 1, // TODO [LOW] set better values
  workgroupSizeY: 32,
  bindings: {
    renderUniforms: 0,
    hairData: 1,
    hairPositions: 2,
    hairTangents: 3,
    tilesBuffer: 4,
    depthTexture: 5,
    tileSegmentsBuffer: 6,
  },
};

///////////////////////////
/// SHADER CODE
///////////////////////////
const c = SHADER_PARAMS;
const b = SHADER_PARAMS.bindings;

export const SHADER_CODE = () => /* wgsl */ `

const TILE_SIZE: u32 = ${CONFIG.hairRender.tileSize}u;

${SHADER_SNIPPETS.GET_MVP_MAT}
${SHADER_SNIPPETS.GENERIC_UTILS}
${SW_RASTERIZE_HAIR}
${SHADER_TILE_UTILS}

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}
${BUFFER_HAIR_DATA(b.hairData)}
${BUFFER_HAIR_POINTS_POSITIONS(b.hairPositions)}
${BUFFER_HAIR_TANGENTS(b.hairTangents)}
${BUFFER_HAIR_TILES_RESULT(b.tilesBuffer, 'read_write')}
${BUFFER_HAIR_TILE_SEGMENTS(b.tileSegmentsBuffer, 'read_write')}

@group(0) @binding(${b.depthTexture})
var _depthTexture: texture_depth_2d;


@compute
@workgroup_size(${c.workgroupSizeX}, ${c.workgroupSizeY}, 1)
fn main(
  @builtin(global_invocation_id) global_id: vec3<u32>,
) {
  let viewportSize: vec2f = _uniforms.viewport.xy;
  let viewportSizeU32: vec2u = vec2u(viewportSize);
  let maxDrawnSegments: u32 = _uniforms.maxDrawnHairSegments;
  let strandsCount: u32 = _hairData.strandsCount;
  let pointsPerStrand: u32 = _hairData.pointsPerStrand;

  let strandIdx = global_id.x;
  let segmentIdx = global_id.y; // [0...31]
  
  // There are 32 points but only 31 segments. Dispatching 1 per point is suboptimal..
  // Discard 32th last invocation (so idx 31)
  if (segmentIdx >= pointsPerStrand - 1) { return; }
  if (strandIdx >= strandsCount) { return; }

  // get rasterize data
  let swHairRasterizeParams = SwHairRasterizeParams(
    _uniforms.modelViewMat,
    _uniforms.projMatrix,
    viewportSizeU32,
    strandsCount,
    pointsPerStrand,
    viewportSize,
    _uniforms.fiberRadius
  );
  let sw = swRasterizeHair(
    swHairRasterizeParams,
    strandIdx,
    segmentIdx
  );

  // iterate row-by-row
  for (var y: f32 = sw.boundRectMin.y; y < sw.boundRectMax.y; y+=1.0) {

    // iterate columns
    for (var x: f32 = sw.boundRectMin.x; x < sw.boundRectMax.x; x+=1.0) {
      let p = vec2f(x, y);
      let C0 = edgeFunction(sw.v01, sw.v00, p);
      let C1 = edgeFunction(sw.v11, sw.v01, p);
      let C2 = edgeFunction(sw.v10, sw.v11, p);
      let C3 = edgeFunction(sw.v00, sw.v10, p);

      if (C0 >= 0 && C1 >= 0 && C2 >= 0 && C3 >= 0) {
        let p_u32 = vec2u(u32(x), u32(y));
        let interpW = interpolateQuad(sw, p);
        // let value = 0xffff00ffu;
        // let value = debugBarycentric(vec4f(interpW.xy, 0.1, 0.));
        // storeResult(viewportSizeU32, p_u32, value);
        
        let hairDepth: f32 = interpolateHairF32(interpW, sw.depthsProj);
        
        // sample depth buffer
        let depthTextSamplePx: vec2i = vec2i(i32(x), i32(viewportSize.y - y)); // wgpu's naga requiers vec2i..
        let depthBufferValue: f32 = textureLoad(_depthTexture, depthTextSamplePx, 0);

        if (hairDepth < depthBufferValue) { // depth test with GL_LESS
          // store the result
          let nextPtr = atomicAdd(&_hairTileSegments.drawnSegmentsCount, 1u);
          let tileXY = getHairTileXY_FromPx(p_u32);
          // If we run out of space to store the fragments we lose them
          if (nextPtr < maxDrawnSegments) {
            let prevPtr = _storeTileHead(
              viewportSizeU32,
              tileXY,
              hairDepth,
              nextPtr
            );
            _storeTileSegment(
              nextPtr, prevPtr,
              strandIdx, segmentIdx
            );
          }
        }
      }


    } // end xy-iter
  }
}


/** NOTE: if you want to store color for .png file, it's in ABGR format */
/*fn storeResult(viewportSize: vec2u, posPx: vec2u, value: u32) {
  // bitcast<u32>(value); <- if needed
  if(
    posPx.x < 0 || posPx.x >= viewportSize.x ||
    posPx.y < 0 || posPx.y >= viewportSize.y
  ) {
    return;
  }
  let y = viewportSize.y - posPx.y; // invert cause WebGPU coordinates
  let idx: u32 = y * viewportSize.x + posPx.x;
  // WebGPU clears to 0. So atomicMin is pointless..
  atomicMax(&_hairTilesResult[idx], value);
}*/
`;
