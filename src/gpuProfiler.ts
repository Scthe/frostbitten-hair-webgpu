import { BYTES_U64, IS_DENO, NANO_TO_MILISECONDS } from './constants.ts';

const FORCE_DISABLE_GPU_TIMINGS = IS_DENO;

/// Big amount of queries to never have to carry about it
const MAX_QUERY_COUNT = 1024;
/// Each pass has BEGIN and END timestamp query
const QUERIES_PER_PASS = 2;
const TOTAL_MAX_QUERIES = MAX_QUERY_COUNT * QUERIES_PER_PASS;

type GpuProfilerResultItem = [string, number];
export type GpuProfilerResult = Array<[string, number]>;

export type ProfilerRegionId = number | undefined;

export const getProfilerTimestamp = () => performance.now();

export const getDeltaFromTimestampMS = (start: number) => {
  const end = getProfilerTimestamp();
  return end - start;
};

type CurrentFrameScopes = Array<[string, 'cpu' | 'gpu', number]>;

/**
 * https://github.com/Scthe/Rust-Vulkan-TressFX/blob/master/src/gpu_profiler.rs
 *
 * webgpu API: https://webgpufundamentals.org/webgpu/lessons/webgpu-timing.html
 */
export class GpuProfiler {
  private _profileThisFrame = false;
  private readonly hasRequiredFeature: boolean;
  private readonly queryPool: GPUQuerySet;
  private readonly queryInProgressBuffer: GPUBuffer;
  private readonly resultsBuffer: GPUBuffer;

  private currentFrameScopes: CurrentFrameScopes = [];

  get enabled() {
    return this._profileThisFrame && this.hasRequiredFeature;
  }

  constructor(device: GPUDevice) {
    this.hasRequiredFeature = device.features.has('timestamp-query');
    if (!this.hasRequiredFeature || FORCE_DISABLE_GPU_TIMINGS) {
      // we should never use them if no feature available
      this.queryPool = undefined!;
      this.queryInProgressBuffer = undefined!;
      this.resultsBuffer = undefined!;
      return;
    }

    this.queryPool = device.createQuerySet({
      type: 'timestamp',
      count: TOTAL_MAX_QUERIES,
    });

    this.queryInProgressBuffer = device.createBuffer({
      label: 'profiler-in-progress',
      size: this.queryPool.count * BYTES_U64,
      usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC,
    });
    this.resultsBuffer = device.createBuffer({
      label: 'profiler-results',
      size: this.queryInProgressBuffer.size,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
  }

  profileNextFrame(enabled: boolean) {
    this._profileThisFrame = enabled;
  }

  beginFrame() {
    while (this.currentFrameScopes.length > 0) {
      this.currentFrameScopes.pop();
    }
  }

  endFrame(cmdBuf: GPUCommandEncoder) {
    if (!this.enabled || FORCE_DISABLE_GPU_TIMINGS) {
      return;
    }

    const queryCount = this.currentFrameScopes.length * QUERIES_PER_PASS;
    cmdBuf.resolveQuerySet(
      this.queryPool,
      0,
      queryCount,
      this.queryInProgressBuffer,
      0
    );
    if (this.resultsBuffer.mapState === 'unmapped') {
      cmdBuf.copyBufferToBuffer(
        this.queryInProgressBuffer,
        0,
        this.resultsBuffer,
        0,
        this.resultsBuffer.size
      );
    }
  }

  async scheduleRaportIfNeededAsync(onResult?: (e: GpuProfilerResult) => void) {
    if (!this.enabled || this.currentFrameScopes.length == 0) {
      this._profileThisFrame = false;
      return;
    }

    this._profileThisFrame = false;
    const scopeNames = this.currentFrameScopes.slice();

    if (FORCE_DISABLE_GPU_TIMINGS) {
      const times = new BigInt64Array();
      const result = this.parseScopeTimers(scopeNames, times);
      onResult?.(result);
      return;
    }

    if (this.resultsBuffer.mapState === 'unmapped') {
      await this.resultsBuffer.mapAsync(GPUMapMode.READ);
      const times = new BigInt64Array(this.resultsBuffer.getMappedRange());
      const result = this.parseScopeTimers(scopeNames, times);
      this.resultsBuffer.unmap();

      onResult?.(result);
    }
  }

  private parseScopeTimers(
    scopeNames: CurrentFrameScopes,
    gpuTimes: BigInt64Array
  ) {
    return scopeNames.map(
      ([name, type, cpuTime], idx): GpuProfilerResultItem => {
        let time = 0;
        if (type === 'gpu') {
          const start = gpuTimes[idx * QUERIES_PER_PASS];
          const end = gpuTimes[idx * QUERIES_PER_PASS + 1];
          time = Number(end - start) * NANO_TO_MILISECONDS;
        } else {
          time = cpuTime;
        }
        return [name, time];
      }
    );
  }

  /** Provide to beginCompute/beginRenderPass's `timestampWrites` */
  createScopeGpu(name: string): GPURenderPassTimestampWrites | undefined {
    if (!this.enabled) {
      return undefined;
    }

    const queryId = this.currentFrameScopes.length;
    this.currentFrameScopes.push([name, 'gpu', 0]);

    return {
      querySet: this.queryPool,
      beginningOfPassWriteIndex: queryId * QUERIES_PER_PASS,
      endOfPassWriteIndex: queryId * QUERIES_PER_PASS + 1,
    };
  }

  startRegionCpu(name: string): ProfilerRegionId {
    if (!this.enabled) {
      return undefined;
    }

    const queryId = this.currentFrameScopes.length;
    const now = performance.now();
    this.currentFrameScopes.push([name, 'cpu', now]);
    return queryId;
  }

  endRegionCpu(token: ProfilerRegionId) {
    if (!this.enabled || token === undefined) return;

    const el = this.currentFrameScopes[token];
    if (el) {
      const [_, _2, start] = el;
      el[2] = getDeltaFromTimestampMS(start);
    }
  }
}
