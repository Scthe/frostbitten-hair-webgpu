import {
  assertBinarySnapshot,
  createGpuDevice_TESTS,
  createMockPassCtx,
  relativePath,
} from '../../sys_deno/testUtils.ts';
import { Dimensions } from '../../utils/index.ts';
import {
  bindBuffer,
  cmdCopyToReadbackBuffer,
  createReadbackBuffer,
  getItemsPerThread,
  readBufferToCPU,
} from '../../utils/webgpu.ts';
import { writePng } from '../../sys_deno/fakeCanvas.ts';
import { RenderUniformsBuffer } from '../renderUniformsBuffer.ts';
import { mat4 } from 'wgpu-matrix';
import { createHairObject, mockTfxFile } from '../../scene/loadScene.ts';
import { BUFFER_HAIR_DATA } from '../../scene/hair/hairDataBuffer.ts';
import { BUFFER_HAIR_POINTS_POSITIONS } from '../../scene/hair/hairPointsPositionsBuffer.ts';
import { BUFFER_HAIR_TANGENTS } from '../../scene/hair/hairTangentsBuffer.ts';
import { SW_RASTERIZE_HAIR } from './shared/swRasterizeHair.wgsl.ts';
import * as SHADER_SNIPPETS from '../_shaderSnippets/shaderSnippets.wgls.ts';
import { BYTES_U32, CONFIG } from '../../constants.ts';
import { HairObject } from '../../scene/hair/hairObject.ts';
import { assignResourcesToBindings } from '../_shared/shared.ts';
import { PassCtx } from '../passCtx.ts';

// This test does not check either of passes, just
// the rasterization util shader code

const RESULT_SIZE: Dimensions = {
  // snapshot was done at 128x128px. Use higher res for nicer .png preview if you want
  // width: 512,
  // height: 512,
  width: 128,
  height: 128,
};
const TEST_PREFFIX = 'test-hair-sw-raster';
const OBJ_NAME = `${TEST_PREFFIX}-obj`;

const PREVIEW_PATH = relativePath(import.meta, '__test__/swRasterizer.preview.png'); // prettier-ignore
const SNAPSHOT_FILE = relativePath(import.meta, '__test__/swRasterizer.snapshot.bin'); // prettier-ignore

const SHADER_PARAMS = {
  workgroupSizeX: 1,
  workgroupSizeY: 32,
  bindings: {
    renderUniforms: 0,
    hairData: 1,
    hairPositions: 2,
    hairTangents: 3,
    resultBuffer: 4,
  },
};

Deno.test('swRasterizeHair_util', async () => {
  CONFIG.hairRender.fiberRadius = 0.1;

  const [device, reportWebGPUErrAsync] = await createGpuDevice_TESTS();

  const uniforms = new RenderUniformsBuffer(device);

  // hair object
  const tfxFile = mockTfxFile();
  tfxFile.header.numHairStrands = 1;
  tfxFile.header.numVerticesPerStrand = 4;
  tfxFile.vertexPositions = new Float32Array(
    [
      [-0.7, -0.7, 0.0, 1.0],
      [-0.2, 0.2, 0.0, 1.0],
      [0.2, 0.2, 0.0, 1.0],
      [0.7, -0.7, 0.0, 1.0],
    ].flat()
  );
  const hairObject = createHairObject(device, OBJ_NAME, tfxFile);

  // pass
  const shaderCode = testSoftwareRasteriserShader();
  const shaderModule = device.createShaderModule({
    label: `${TEST_PREFFIX}-shader`,
    code: shaderCode,
  });
  const pipeline = device.createComputePipeline({
    label: `${TEST_PREFFIX}-pipeline`,
    layout: 'auto',
    compute: {
      module: shaderModule,
      entryPoint: 'main',
    },
  });

  // result framebuffer as flat buffer
  const resultBuffer = device.createBuffer({
    label: `${TEST_PREFFIX}-result`,
    size: BYTES_U32 * RESULT_SIZE.width * RESULT_SIZE.height,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });
  // readback buffer (allows Usage.MAP_READ)
  const resultReadbackBuffer = createReadbackBuffer(device, resultBuffer);

  // submit
  const cmdBuf = device.createCommandEncoder();
  // prepare params
  const passCtx = createMockPassCtx(device, cmdBuf);
  passCtx.projMatrix = mat4.identity();
  passCtx.viewMatrix = mat4.identity();
  passCtx.vpMatrix = mat4.identity();
  passCtx.globalUniforms = uniforms;
  passCtx.viewport = RESULT_SIZE;
  uniforms.update(passCtx);
  // execute pass
  const computePass = cmdBuf.beginComputePass({
    label: `${TEST_PREFFIX}-compute-pass`,
  });
  const bindings = createBindings(passCtx, pipeline, resultBuffer, hairObject);
  computePass.setPipeline(pipeline);
  computePass.setBindGroup(0, bindings);
  const workgroupsX = getItemsPerThread(
    hairObject.strandsCount,
    SHADER_PARAMS.workgroupSizeX
  );
  const workgroupsY = getItemsPerThread(
    hairObject.pointsPerStrand,
    SHADER_PARAMS.workgroupSizeY
  );
  console.log(`${TEST_PREFFIX}.dispatch(${workgroupsX}, ${workgroupsY}, 1)`); // prettier-ignore
  computePass.dispatchWorkgroups(workgroupsX, workgroupsY, 1);
  computePass.end();
  // finalize
  cmdCopyToReadbackBuffer(cmdBuf, resultBuffer, resultReadbackBuffer);
  device.queue.submit([cmdBuf.finish()]);

  await reportWebGPUErrAsync();

  // read back
  const resultData = await readBufferToCPU(Uint32Array, resultReadbackBuffer);
  // console.log('resultData', typedArr2str(resultData));

  // cleanup
  device.destroy();

  await writePng(resultData.buffer, RESULT_SIZE, PREVIEW_PATH);
  await assertBinarySnapshot(SNAPSHOT_FILE, resultData.buffer);
});

function createBindings(
  ctx: PassCtx,
  pipeline: GPUComputePipeline,
  resultBuffer: GPUBuffer,
  object: HairObject
): GPUBindGroup {
  const { device, globalUniforms } = ctx;
  const b = SHADER_PARAMS.bindings;
  const pass = { NAME: `${TEST_PREFFIX}-bindings` };

  return assignResourcesToBindings(pass, device, pipeline, [
    globalUniforms.createBindingDesc(b.renderUniforms),
    object.bindHairData(b.hairData),
    object.bindPointsPositions(b.hairPositions),
    object.bindTangents(b.hairTangents),
    bindBuffer(b.resultBuffer, resultBuffer),
  ]);
}

function testSoftwareRasteriserShader() {
  const c = SHADER_PARAMS;
  const b = SHADER_PARAMS.bindings;

  const SHADER_CODE = /* wgsl */ `

${SHADER_SNIPPETS.GET_MVP_MAT}
${SHADER_SNIPPETS.GENERIC_UTILS}
${SW_RASTERIZE_HAIR}

${RenderUniformsBuffer.SHADER_SNIPPET(b.renderUniforms)}
${BUFFER_HAIR_DATA(b.hairData)}
${BUFFER_HAIR_POINTS_POSITIONS(b.hairPositions)}
${BUFFER_HAIR_TANGENTS(b.hairTangents)}

@group(0) @binding(${b.resultBuffer})
var<storage, read_write> _hairTilesResult: array<atomic<u32>>;


@compute
@workgroup_size(${c.workgroupSizeX}, ${c.workgroupSizeY}, 1)
fn main(
  @builtin(global_invocation_id) global_id: vec3<u32>,
) {
  let viewportSize: vec2f = _uniforms.viewport.xy;
  let viewportSizeU32: vec2u = vec2u(viewportSize);
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
    _uniforms.viewMatrix,
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
  for (var x: f32 = sw.boundRectMin.x; x < sw.boundRectMax.x; x+=1.0) {
    let p = vec2f(x, y);
    let C0 = edgeFunction(sw.v01, sw.v00, p);
    let C1 = edgeFunction(sw.v11, sw.v01, p);
    let C2 = edgeFunction(sw.v10, sw.v11, p);
    let C3 = edgeFunction(sw.v00, sw.v10, p);

    if (C0 >= 0 && C1 >= 0 && C2 >= 0 && C3 >= 0) {
      let interp = interpolateQuad(sw, p);
      let value = debugBarycentric(vec4f(interp.xy, 0.1, 0.));
      storeResult(viewportSizeU32, vec2u(u32(x), u32(y)), value);
    }
  }}
}


/** NOTE: if you want to store color for .png file, it's in ABGR format */
fn storeResult(viewportSize: vec2u, posPx: vec2u, value: u32) {
  if(
    posPx.x < 0 || posPx.x >= viewportSize.x ||
    posPx.y < 0 || posPx.y >= viewportSize.y
  ) { return; }
  
  let y = viewportSize.y - posPx.y; // invert cause WebGPU coordinates
  let idx: u32 = y * viewportSize.x + posPx.x;
  // WebGPU clears to 0. So atomicMin is pointless..
  atomicMax(&_hairTilesResult[idx], value);
}
`;

  return SHADER_CODE;
}
