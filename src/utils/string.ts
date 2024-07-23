export function formatBytes(bytes: number, decimals = 0) {
  if (bytes <= 0) return '0 Bytes';

  // prettier-ignore
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
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
export function formatPercentageNumber(
  actual: number,
  total: number,
  decimals = 2
) {
  const percent = total > 0 ? (actual / total) * 100.0 : 0;
  return `${formatNumber(actual, decimals)} (${percent.toFixed(1)}%)`;
}
