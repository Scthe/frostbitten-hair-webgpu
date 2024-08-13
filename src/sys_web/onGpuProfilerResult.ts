import { GpuProfilerResult } from '../gpuProfiler.ts';
import { showHtmlEl } from '../sys_web/htmlUtils.ts';

export function onGpuProfilerResult(result: GpuProfilerResult) {
  console.log('Profiler:', result);
  const parentEl = document.getElementById('profiler-results')!;
  parentEl.innerHTML = '';
  // deno-lint-ignore no-explicit-any
  showHtmlEl(parentEl.parentNode as any);

  const mergeByName: Record<string, number> = {};
  const names = new Set<string>();
  result.forEach(([name, timeMs]) => {
    const t = mergeByName[name] || 0;
    mergeByName[name] = t + timeMs;
    names.add(name);
  });

  let totalMs = 0;
  names.forEach((name) => {
    const timeMs = mergeByName[name];
    const li = document.createElement('li');
    li.innerHTML = `${name}: ${timeMs.toFixed(2)}ms`;
    parentEl.appendChild(li);
    totalMs += timeMs;
  });

  const li = document.createElement('li');
  li.innerHTML = `--- TOTAL: ${totalMs.toFixed(2)}ms ---`;
  parentEl.appendChild(li);
}
