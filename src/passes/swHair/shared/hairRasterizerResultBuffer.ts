import { BYTES_VEC4 } from '../../../constants.ts';
import { STATS } from '../../../stats.ts';
import { Dimensions } from '../../../utils/index.ts';
import { formatBytes } from '../../../utils/string.ts';
import { StorageAccess, u32_type } from '../../../utils/webgpu.ts';

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
  _hairRasterizerResults.data[idx] = color;
}

fn _getNextTileIdx() -> u32 {
  return atomicAdd(&_hairRasterizerResults.tileQueueAtomicIdx, 1u);
}
`;

export const BUFFER_HAIR_RASTERIZER_RESULTS = (
  bindingIdx: number,
  access: StorageAccess
) => /* wgsl */ `

struct HairRasterResult {
  // there is a limit of 8 storage buffers. We are reaching this limit right now.
  // So pack this counter 'somewhere'. I could raise a limit, but..
  // https://gpuweb.github.io/gpuweb/#gpusupportedlimits
  tileQueueAtomicIdx: ${u32_type(access)},
  data: array<vec4f>,
}

@group(0) @binding(${bindingIdx})
var<storage, ${access}> _hairRasterizerResults: HairRasterResult;

fn _getRasterizerResult(viewportSize: vec2u, posPx: vec2u) -> vec4f {
  let idx = viewportSize.x * posPx.y + posPx.x;
  return _hairRasterizerResults.data[idx];
}

${access == 'read_write' ? setRasterizerResult : ''}
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
