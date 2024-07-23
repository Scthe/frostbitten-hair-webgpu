import { TfxFileData } from './tfxFileLoader.ts';
import { CONFIG } from '../../constants.ts';
import { createGPU_StorageBuffer } from '../../utils/webgpu.ts';
import { createArray } from '../../utils/arrays.ts';

///////////////////////////
/// SHADER CODE
///////////////////////////

const setShadingPoint = /* wgsl */ `

fn _setShadingPoint(strandId: u32, pointIdx: u32, color: vec4f) {
  let offset = strandId * SHADING_POINTS;
  let i0 = clamp(pointIdx, 0u, SHADING_POINTS - 1u);
  _hairShading[offset + i0] = color;
}
`;

export const BUFFER_HAIR_SHADING = (
  bindingIdx: number,
  access: 'read_write' | 'read'
) => /* wgsl */ `

const SHADING_POINTS = ${CONFIG.hairRender.shadingPoints}u;

@group(0) @binding(${bindingIdx})
var<storage, ${access}> _hairShading: array<vec4f>;

fn _sampleShading(strandId: u32, t: f32) -> vec4f {
  let offset = strandId * SHADING_POINTS;
  let SHADING_POINTS_f32 = f32(SHADING_POINTS);

  let a = (SHADING_POINTS_f32 - 1.) * t;
  let a_u32 = u32(a);
  let i0 = clamp(a_u32,      0u, SHADING_POINTS - 1u);
  let i1 = clamp(a_u32 + 1u, 0u, SHADING_POINTS - 1u);
  let c0 = _hairShading[offset + i0];
  let c1 = _hairShading[offset + i1];
  return mix(c0, c1, fract(a));
}

${access === 'read_write' ? setShadingPoint : ''}

`;

///////////////////////////
/// GPU BUFFER
///////////////////////////

/** Has pre-filled red-green gradient */
export function createHairShadingBuffer(
  device: GPUDevice,
  name: string,
  tfxFile: TfxFileData
): GPUBuffer {
  const {
    header: { numHairStrands },
  } = tfxFile;
  const { shadingPoints } = CONFIG.hairRender;

  // gradient: red at root, green at tip
  const gradient = createArray(shadingPoints).map((_, i) => {
    const p = i / (shadingPoints - 1);
    // smooth gradient
    return [1.0 - p, p, 0.0, 1.0];
    // dbg: change color half-way
    // return p >= 0.5 ? [0.0, 1.0, 0.0, 1.0] : [1.0, 0.0, 0.0, 1.0];
  });

  const data = new Float32Array(
    createArray(numHairStrands)
      .map(() => gradient)
      .flat()
      .flat()
  );

  return createGPU_StorageBuffer(device, `${name}-shading`, data);
}
