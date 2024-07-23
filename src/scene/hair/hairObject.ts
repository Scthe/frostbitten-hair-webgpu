import { Bounds3d } from '../../utils/bounds.ts';
import { HairIndexBuffer } from './hairIndexBuffer.ts';

/** This objects exists so we don't have a constructor with X GPUBuffer arguments. So we don't accidently provide them in wrong order */
interface HairObjectBuffers {
  pointsPositionsBuffer: GPUBuffer;
  tangentsBuffer: GPUBuffer;
  dataBuffer: GPUBuffer;
  shadingBuffer: GPUBuffer;
  indicesData: HairIndexBuffer;
}

export class HairObject {
  constructor(
    public readonly name: string,
    public readonly strandsCount: number,
    public readonly pointsPerStrand: number,
    public readonly bounds: Bounds3d,
    public readonly buffers: HairObjectBuffers
  ) {}

  get pointsCount() {
    return this.strandsCount * this.pointsPerStrand;
  }

  get segmentCount() {
    return this.strandsCount * (this.pointsPerStrand - 1);
  }

  bindPointsPositions = (bindingIdx: number): GPUBindGroupEntry => ({
    binding: bindingIdx,
    resource: { buffer: this.buffers.pointsPositionsBuffer },
  });

  bindTangents = (bindingIdx: number): GPUBindGroupEntry => ({
    binding: bindingIdx,
    resource: { buffer: this.buffers.tangentsBuffer },
  });

  bindHairData = (bindingIdx: number): GPUBindGroupEntry => ({
    binding: bindingIdx,
    resource: { buffer: this.buffers.dataBuffer },
  });

  bindShading = (bindingIdx: number): GPUBindGroupEntry => ({
    binding: bindingIdx,
    resource: { buffer: this.buffers.shadingBuffer },
  });

  bindIndexBuffer(renderPass: GPURenderPassEncoder) {
    renderPass.setIndexBuffer(
      this.buffers.indicesData.indexBuffer,
      this.buffers.indicesData.indexFormat
    );
  }
}
