/** Format a value as a percentage string. Returns '—' for null/undefined. */
export const fmtPct = (val: number | null | undefined, dec = 2): string =>
  val != null ? `${Number(val).toFixed(dec)}%` : '—';

/** Format a number with fixed decimals. Returns '—' for null/undefined. */
export const fmtNum = (val: number | null | undefined, dec = 2): string =>
  val != null ? Number(val).toFixed(dec) : '—';

/** Format an integer with locale thousands separators. Returns '—' for null/undefined. */
export const fmtInt = (val: number | null | undefined): string =>
  val != null ? Math.round(val).toLocaleString() : '—';

/** Format a number with a leading + for positives. Returns '—' for null. */
export const fmtSigned = (val: number | null | undefined, dec = 2): string => {
  if (val == null) return '—';
  const n = Number(val);
  return `${n > 0 ? '+' : ''}${n.toFixed(dec)}`;
};

/** Format as signed percentage string (e.g. "+3.50%"). */
export const fmtSignedPct = (val: number | null | undefined, dec = 2): string => {
  if (val == null) return '—';
  const n = Number(val);
  return `${n > 0 ? '+' : ''}${n.toFixed(dec)}%`;
};

/** Returns the Tailwind text-colour class for a P&L value. */
export const pnlColor = (val: number | null | undefined): string =>
  val != null && val >= 0 ? 'text-positive' : 'text-negative';

/** Safe division — returns 0 if denominator is 0. */
export const safePct = (part: number | null | undefined, total: number | null | undefined): number => {
  if (!total || part == null) return 0;
  return (part / total) * 100;
};
