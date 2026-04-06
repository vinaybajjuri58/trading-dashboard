import type { PassStatus } from '../types/api';

type BadgeConfig = {
  label: string;
  className: string;
};

const BADGE_CONFIG: Record<'pass' | 'fail' | 'null', BadgeConfig> = {
  pass: { label: '✓ Pass', className: 'bg-positive/10 text-positive border-positive/25' },
  fail: { label: '✗ Fail', className: 'bg-negative/10 text-negative border-negative/25' },
  null: { label: '—',      className: 'bg-overlay text-muted border-divider' },
};

type BadgePassProps = {
  value: PassStatus;
};

export default function BadgePass({ value }: BadgePassProps) {
  const key: 'pass' | 'fail' | 'null' = value === true ? 'pass' : value === false ? 'fail' : 'null';
  const { label, className } = BADGE_CONFIG[key];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${className}`}>
      {label}
    </span>
  );
}
