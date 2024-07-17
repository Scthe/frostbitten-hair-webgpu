import { Mat4 } from 'wgpu-matrix';
import { BYTES_F32, BYTES_U32 } from '../constants.ts';

export class TypedArrayView {
  public readonly asF32: Float32Array;
  public readonly asU32: Uint32Array;

  /** Write cursor */
  private offsetBytes = 0;

  constructor(
    private readonly buffer: ArrayBuffer,
    private readonly byteOffset: number = 0,
    private readonly byteSize: number = 0
  ) {
    this.byteSize = byteSize === 0 ? buffer.byteLength : byteSize;
    // DO NOT USE THE CONSTRUCTOR WITH 3 PARAMS!
    this.asF32 = new Float32Array(buffer);
    this.asU32 = new Uint32Array(buffer);
  }

  f32 = (idx: number) => this.asF32[idx];
  u32 = (idx: number) => this.asU32[idx];
  cursor = () => this.offsetBytes;

  resetCursor() {
    this.offsetBytes = 0;
  }

  padding(bytesCount: number) {
    this.offsetBytes += bytesCount;
  }

  assertWrittenBytes(bytesCount: number) {
    if (this.offsetBytes !== bytesCount) {
      throw new Error(`Written invalid byte count ${this.offsetBytes}. Expected ${bytesCount}.`); // prettier-ignore
    }
  }

  writeMat4(mat: Mat4) {
    for (let i = 0; i < 16; i++) {
      this.writeF32(mat[i]);
    }
  }

  writeF32Array(arr: Float32Array) {
    for (let i = 0; i < arr.length; i++) {
      this.writeF32(arr[i]);
    }
  }

  writeF32(v: number) {
    const offset = (this.byteOffset + this.offsetBytes) / BYTES_F32;
    this.asF32[offset] = v;
    this.offsetBytes += BYTES_F32;
  }

  writeU32(v: number) {
    const offset = (this.byteOffset + this.offsetBytes) / BYTES_U32;
    this.asU32[offset] = Math.floor(v);
    this.offsetBytes += BYTES_U32;
  }

  upload(device: GPUDevice, gpuBuffer: GPUBuffer, gpuOffset: number) {
    device.queue.writeBuffer(
      gpuBuffer,
      gpuOffset,
      this.buffer,
      this.byteOffset,
      this.byteSize
    );
  }
}
