export const isHtmlElVisible = (el: HTMLElement | null) => {
  return el && el.style.display !== 'none';
};

export const showHtmlEl = (
  el: HTMLElement | null,
  display: 'block' | 'flex' = 'block'
) => {
  if (el) el.style.display = display;
};

export const hideHtmlEl = (el: HTMLElement | null) => {
  if (el) el.style.display = 'none';
};

export const ensureHtmlElIsVisible = (
  el: HTMLElement | null,
  nextVisible: boolean
) => {
  const isVisible = isHtmlElVisible(el);
  if (isVisible === nextVisible) return;

  // console.log('HTML change visible to', nextVisible);
  if (nextVisible) {
    showHtmlEl(el);
  } else {
    hideHtmlEl(el);
  }
};
