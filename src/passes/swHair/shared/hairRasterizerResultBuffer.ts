import { BYTES_VEC4 } from '../../../constants.ts';
import { STATS } from '../../../stats.ts';
import { Dimensions } from '../../../utils/index.ts';
import { formatBytes } from '../../../utils/string.ts';

///////////////////////////
/// SHADER CODE
///////////////////////////

const setRasterizerResult = /* wgsl */ `
fn _setRasterizerResult(viewportSize: vec2u, posPx: vec2u, color: vec4f) {
  if(
    posPx.x < 0 || posPx.x >= viewportSize.x ||
    posPx.y < 0 || posPx.y >= viewportSize.y
  ) { return; }

  let idx = viewportSize.x * posPx.y + posPx.x;
  _hairRasterizerResults[idx] = color;
}
`;

const getRasterizerResult = /* wgsl */ `
fn _getRasterizerResult(viewportSize: vec2u, posPx: vec2u) -> vec4f {
  let idx = viewportSize.x * posPx.y + posPx.x;
  return _hairRasterizerResults[idx];
}
`;

export const BUFFER_HAIR_RASTERIZER_RESULTS = (
  bindingIdx: number,
  access: 'read_write' | 'read'
) => /* wgsl */ `

@group(0) @binding(${bindingIdx})
var<storage, ${access}> _hairRasterizerResults: array<vec4f>;

${access == 'read_write' ? setRasterizerResult : getRasterizerResult}
`;

///////////////////////////
/// GPU BUFFER
///////////////////////////

export function createHairRasterizerResultsBuffer(
  device: GPUDevice,
  viewportSize: Dimensions
): GPUBuffer {
  const pixels = viewportSize.width * viewportSize.height;
  const bytesPerPixel = BYTES_VEC4;
  const size = pixels * bytesPerPixel;
  STATS.update('Hair FBO', formatBytes(size));

  return device.createBuffer({
    label: `hair-rasterizer-result`,
    size,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
}
