import { BYTES_VEC4, CONFIG } from '../../constants.ts';
import { TypedArrayView } from '../../utils/typedArrayView.ts';
import { BoundingBox, BoundingBoxPoint } from '../../utils/bounds.ts';
import { assertIsGPUTextureView } from '../../utils/webgpu.ts';
import { vec3 } from 'wgpu-matrix';

export type SdfPoint3D = BoundingBoxPoint;

export class SDFCollider {
  public static SDF_DATA_SNIPPET = /* wgsl */ `
    struct SDFCollider {
      boundsMin: vec4f,
      boundsMax: vec4f,
    };

    fn getSdfDebugDepthSlice() -> f32 {
      var s = _uniforms.sdf.boundsMin.w;
      if (s > 1.0) { return s - 2.0; }
      return s;
    }
    fn isSdfDebugSemiTransparent() -> bool { return _uniforms.sdf.boundsMin.w > 1.0; }
    fn getSDF_Offset() -> f32 { return _uniforms.sdf.boundsMax.w; }
  `;
  public static BUFFER_SIZE = 2 * BYTES_VEC4;

  public static TEXTURE_SDF = (
    bindingIdx: number,
    samplerBindingIdx: number
  ) => /* wgsl */ `
    @group(0) @binding(${bindingIdx})
    var _sdfTexture: texture_3d<f32>;

    @group(0) @binding(${samplerBindingIdx}) 
    var _sdfSampler: sampler;

    fn sampleSDFCollider(sdfBoundsMin: vec3f, sdfBoundsMax: vec3f, p: vec3f) -> f32 {
      // TBH bounds can be as bound sphere if mesh is cube-ish in shape
      var t: vec3f = saturate(
        (p - sdfBoundsMin) / (sdfBoundsMax - sdfBoundsMin)
      );
      // t.y = 1.0 - t.y; // WebGPU reverted Y-axis
      // t.z = 1.0 - t.z; // WebGPU reverted Z-axis (I guess?)
      return textureSampleLevel(_sdfTexture, _sdfSampler, t, 0.0).x;
    }
  `;

  constructor(
    public readonly name: string,
    public readonly bounds: BoundingBox,
    public readonly dims: number,
    private readonly texture: GPUTexture,
    private readonly textureView: GPUTextureView,
    private readonly sampler: GPUSampler
  ) {
    if (!CONFIG.isTest) {
      assertIsGPUTextureView(textureView);
    }

    const [boundsMin, boundsMax] = bounds;
    const size = vec3.subtract(boundsMax, boundsMin);
    const cellSize = vec3.scale(size, 1 / (dims - 1));
    console.log(`SDF collider '${name}' (dims=${dims}, cellSize=${cellSize}), bounds:`, bounds); // prettier-ignore
  }

  bindTexture = (bindingIdx: number): GPUBindGroupEntry => ({
    binding: bindingIdx,
    resource: this.textureView,
  });

  bindSampler = (bindingIdx: number): GPUBindGroupEntry => ({
    binding: bindingIdx,
    resource: this.sampler,
  });

  writeToDataView(dataView: TypedArrayView) {
    const c = CONFIG.hairSimulation.sdf;
    const [boundsMin, boundsMax] = this.bounds;

    dataView.writeF32(boundsMin[0]);
    dataView.writeF32(boundsMin[1]);
    dataView.writeF32(boundsMin[2]);
    const mod = c.debugSemitransparent ? 2 : 0;
    dataView.writeF32(c.debugSlice + mod);

    dataView.writeF32(boundsMax[0]);
    dataView.writeF32(boundsMax[1]);
    dataView.writeF32(boundsMax[2]);
    dataView.writeF32(c.distanceOffset);
  }
}
