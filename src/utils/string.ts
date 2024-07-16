export function formatBytes(bytes: number, decimals = 2) {
  if (bytes <= 0) return '0 Bytes';

  // prettier-ignore
  const units = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const v = (bytes / Math.pow(k, i)).toFixed(decimals);
  return `${v} ${units[i]}`;
}

export function formatNumber(num: number, decimals = 2) {
  if (num === 0) return '0';
  const sign = num < 0 ? '-' : '';
  num = Math.abs(num);

  const units = ['', 'k', 'm', 'b'];
  const k = 1000;
  const i = Math.floor(Math.log(num) / Math.log(k));
  const v = (num / Math.pow(k, i)).toFixed(decimals);
  return `${sign}${v}${units[i]}`;
}

/** Format 4 out of 100 into: '4 (4%)' */
export function formatPercentageNumber(actual: number, total: number) {
  const percent = total > 0 ? (actual / total) * 100.0 : 0;
  return `${formatNumber(actual)} (${percent.toFixed(1)}%)`;
}
