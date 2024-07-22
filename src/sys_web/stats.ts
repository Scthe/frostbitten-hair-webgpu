import { getProfilerTimestamp } from '../gpuProfiler.ts';
import { hideHtmlEl, isHtmlElVisible, showHtmlEl } from './htmlUtils.ts';

type StatsValue = number | string;

type StatOpts = {
  hideLabel?: boolean;
  el?: HTMLElement;
  categoryName?: string;
};

// prettier-ignore
const AvailableStats = {
  fps: { hideLabel: true } as StatOpts,
  ms: { hideLabel: true } as StatOpts,
  'Camera pos': {} as StatOpts,
  'Camera rot': {} as StatOpts,
  'Strands': {} as StatOpts,
  'Points per strand': {} as StatOpts,
  'Segments': {} as StatOpts,
  'Tiles': {} as StatOpts,
  // memory
  s0: { categoryName: 'Memory' } as StatOpts,
  'Tiles heads': {} as StatOpts, // per tile depth data + segment head
  'Tiles segments': {} as StatOpts, // hair segments per tile PPLL data
  'Slices heads': {} as StatOpts, // hair slices pointers
  'Slices data': {} as StatOpts, // hair slices color data
  'Hair FBO': {} as StatOpts, // final color framebuffer
};
type StatName = keyof typeof AvailableStats;

const DELTA_SMOOTHING = 0.95;
const UPDATE_FREQ_MS = 1000;

// TODO memory statistics, tile count etc.
class Stats {
  // deno-lint-ignore no-explicit-any
  private values: Record<StatName, number | string> = {} as any;
  private lastRenderedValues: Record<string, number | string> = {};
  //
  private frameStart: number = 0;
  public deltaTimeMS = 0;
  private deltaTimeSmoothMS: number | undefined = undefined;
  // HTML
  private parentEl: HTMLElement;
  private lastDOMUpdate: number = 0;

  constructor() {
    // deno-lint-ignore no-window
    if (window && window.document) {
      this.parentEl = window.document.getElementById('stats-window')!;
      this.frameStart = getProfilerTimestamp();
      this.lastDOMUpdate = this.frameStart;
    } else {
      this.parentEl = undefined!;
    }
  }

  update(name: StatName, value: StatsValue) {
    this.values[name] = value;
  }

  show = () => showHtmlEl(this.parentEl);

  onBeginFrame = () => {
    this.frameStart = getProfilerTimestamp();
  };

  onEndFrame = () => {
    const frameEnd = getProfilerTimestamp();
    this.deltaTimeMS = frameEnd - this.frameStart;

    if (this.deltaTimeSmoothMS === undefined) {
      this.deltaTimeSmoothMS = this.deltaTimeMS;
    } else {
      // lerp
      this.deltaTimeSmoothMS =
        this.deltaTimeSmoothMS * DELTA_SMOOTHING +
        this.deltaTimeMS * (1.0 - DELTA_SMOOTHING);
    }

    const fps = (1.0 / this.deltaTimeMS) * 1000;
    this.update('fps', `${fps.toFixed(2)} fps`);
    this.update('ms', `${this.deltaTimeMS.toFixed(2)}ms`);

    if (frameEnd - this.lastDOMUpdate > UPDATE_FREQ_MS) {
      this.lastDOMUpdate = frameEnd;
      setTimeout(this.renderStats, 0);
    }
  };

  printStats = () => {
    const TAB = '  ';

    console.log('STATS {');
    Object.entries(AvailableStats).forEach(([name_, opts]) => {
      // deno-lint-ignore no-explicit-any
      const name: StatName = name_ as any; // TS..

      if (opts.categoryName) {
        console.log(`%c${TAB}--- ${opts.categoryName} ---`, 'color: blue');
      } else {
        const value = this.values[name];
        if (value !== undefined && value !== null) {
          console.log(`%c${TAB}${name}:`, 'color: green', value);
        }
      }
    });
    console.log('}');
  };

  private renderStats = () => {
    const statsChildrenEls: HTMLElement[] = Array.from(
      this.parentEl.children
      // deno-lint-ignore no-explicit-any
    ) as any;

    Object.entries(AvailableStats).forEach(([name_, opts]) => {
      // deno-lint-ignore no-explicit-any
      const name: StatName = name_ as any; // TS..
      const el = this.getStatsHtmlEl(statsChildrenEls, name, opts);

      if (opts.categoryName) {
        if (el.textContent !== opts.categoryName)
          el.innerHTML = opts.categoryName;
        el.classList.add('stats-category-name');
        return;
      }

      // do not update if not changed
      const value = this.values[name];
      const shownValue = this.lastRenderedValues[name];
      // if (name === 'Nanite triangles') console.log({ value, shownValue }); // dbg
      if (value == shownValue) return;

      let text = `${name}: ${value}`;
      if (opts.hideLabel) {
        text = String(value);
      }
      el.innerHTML = text;
    });

    this.lastRenderedValues = { ...this.values };
  };

  private getStatsHtmlEl = (
    els: HTMLElement[],
    name: StatName,
    opts: StatOpts
  ): HTMLElement => {
    const STATS_ATTR = 'data-stats-attr';

    if (opts.el) return opts.el;
    let el = els.find(
      (el: HTMLElement) => el.getAttribute(STATS_ATTR) === name
    );

    if (!el) {
      el = document.createElement('p');
      el.setAttribute(STATS_ATTR, name);
      this.parentEl.appendChild(el);
    }
    opts.el = el;
    return el;
  };

  setElVisible(el: HTMLElement, nextVisible: boolean) {
    if (nextVisible && !isHtmlElVisible(el)) {
      // console.log('setElVisible', el, nextVisible);
      showHtmlEl(el);
      this.lastRenderedValues = {}; // force rerender all
    }
    if (!nextVisible && isHtmlElVisible(el)) {
      // console.log('setElVisible', el, nextVisible);
      hideHtmlEl(el);
      this.lastRenderedValues = {}; // force rerender all
    }
  }
}

export const STATS = new Stats();
