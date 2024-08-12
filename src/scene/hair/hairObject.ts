import { CONFIG } from '../../constants.ts';
import { STATS } from '../../stats.ts';
import { Bounds3d } from '../../utils/bounds.ts';
import { clamp } from '../../utils/index.ts';
import { formatPercentageNumber } from '../../utils/string.ts';
import { bindBuffer } from '../../utils/webgpu.ts';
import { HairIndexBuffer } from './hairIndexBuffer.ts';

/** This objects exists so we don't have a constructor with X GPUBuffer arguments. So we don't accidently provide them in wrong order */
interface HairObjectBuffers {
  initialPointsPositionsBuffer: GPUBuffer;
  initialSegmentLengthsBuffer: GPUBuffer;
  pointsPositionsBuffer_0: GPUBuffer;
  pointsPositionsBuffer_1: GPUBuffer;
  tangentsBuffer: GPUBuffer;
  dataBuffer: GPUBuffer;
  shadingBuffer: GPUBuffer;
  indicesData: HairIndexBuffer;
}

/**
 * Select which of the tick-tock simulation buffers will be used for render
 *
 * A string cause TS has slightly stronger enforce rules */
export type PositionsBufferIdx = '0' | '1';
export const oppositePositionsBufferIdx = (a: PositionsBufferIdx) =>
  a == '0' ? '1' : '0';

export class HairObject {
  private _currentPositionsBuffer: PositionsBufferIdx = '0';

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

  get currentPositionsBufferIdx() {
    return this._currentPositionsBuffer;
  }

  getRenderedStrandCount() {
    const pct = clamp(CONFIG.hairRender.lodRenderPercent, 0, 100);
    const { strandsCount } = this;
    const result = Math.ceil((strandsCount * pct) / 100.0);
    return clamp(result, 0, strandsCount);
  }

  reportRenderedStrandCount() {
    const { strandsCount, pointsPerStrand, segmentCount } = this;
    const result = this.getRenderedStrandCount();

    STATS.update(
      'Rendered strands',
      formatPercentageNumber(result, strandsCount, 0)
    );
    const segments = result * (pointsPerStrand - 1);
    STATS.update(
      'Rendered segments',
      formatPercentageNumber(segments, segmentCount, 0)
    );
    return result;
  }

  resetSimulation(cmdBuf: GPUCommandEncoder) {
    const {
      initialPointsPositionsBuffer,
      pointsPositionsBuffer_0,
      pointsPositionsBuffer_1,
    } = this.buffers;
    const size = initialPointsPositionsBuffer.size;

    cmdBuf.copyBufferToBuffer(
      initialPointsPositionsBuffer, 0,
      pointsPositionsBuffer_0, 0, size
    ); // prettier-ignore
    cmdBuf.copyBufferToBuffer(
      initialPointsPositionsBuffer, 0,
      pointsPositionsBuffer_1, 0, size
    ); // prettier-ignore
  }

  /**
   * Example at the start of the frame for `$currentPositionsBuffer='1'`:
   *  - `positionsBuffer_0` - previous positions
   *  - `positionsBuffer_1` - current positions
   *
   * After the hair simulation's integration step:
   *  - `positionsBuffer_0` - positions after simulation (ready for render)
   *  - `positionsBuffer_1` - no longer *current* positions (obsolete, were fresh BEFORE the simulation)
   */
  swapPositionBuffersAfterSimIntegration() {
    this._currentPositionsBuffer = oppositePositionsBufferIdx(
      this._currentPositionsBuffer
    );
  }

  /** Used e.g. for render */
  bindPointsPositions = (bindingIdx: number): GPUBindGroupEntry => {
    return this.bindPointsPositionsByPosIdx(
      bindingIdx,
      this._currentPositionsBuffer
    );
  };

  bindPointsPositions_PREV = (bindingIdx: number): GPUBindGroupEntry => {
    return this.bindPointsPositionsByPosIdx(
      bindingIdx,
      oppositePositionsBufferIdx(this._currentPositionsBuffer)
    );
  };

  private bindPointsPositionsByPosIdx = (
    bindingIdx: number,
    positionsNowBufferIdx: PositionsBufferIdx
  ): GPUBindGroupEntry => {
    const buffer =
      positionsNowBufferIdx == '0'
        ? this.buffers.pointsPositionsBuffer_0
        : this.buffers.pointsPositionsBuffer_1;
    return { binding: bindingIdx, resource: { buffer } };
  };

  bindTangents = (bindingIdx: number): GPUBindGroupEntry =>
    bindBuffer(bindingIdx, this.buffers.tangentsBuffer);

  bindPointsPositions_INITIAL = (bindingIdx: number): GPUBindGroupEntry =>
    bindBuffer(bindingIdx, this.buffers.initialPointsPositionsBuffer);

  bindInitialSegmentLengths = (bindingIdx: number): GPUBindGroupEntry =>
    bindBuffer(bindingIdx, this.buffers.initialSegmentLengthsBuffer);

  bindHairData = (bindingIdx: number): GPUBindGroupEntry =>
    bindBuffer(bindingIdx, this.buffers.dataBuffer);

  bindShading = (bindingIdx: number): GPUBindGroupEntry =>
    bindBuffer(bindingIdx, this.buffers.shadingBuffer);

  bindIndexBuffer(renderPass: GPURenderPassEncoder) {
    renderPass.setIndexBuffer(
      this.buffers.indicesData.indexBuffer,
      this.buffers.indicesData.indexFormat
    );
  }
}
