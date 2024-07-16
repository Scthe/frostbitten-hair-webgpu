export class BindingsCache {
  private cache: Record<string, GPUBindGroup | undefined> = {};

  getBindings(key: string, factory: () => GPUBindGroup): GPUBindGroup {
    const cachedVal = this.cache[key];
    if (cachedVal) {
      return cachedVal;
    }

    const val = factory();
    this.cache[key] = val;
    return val;
  }

  clear() {
    // Object.values(this.cache).forEach((bg) => {
    // bg?.destroy(); // no such fn?
    // });
    this.cache = {};
  }
}
