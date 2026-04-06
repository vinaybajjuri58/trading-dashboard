import type { LucideIcon } from 'lucide-react';

type StatCardProps = {
  label: string;
  value: string | number;
  sub?: string;
  icon?: LucideIcon;
  accentColor?: string;
};

export default function StatCard({ label, value, sub, icon: Icon, accentColor = '#0d7c66' }: StatCardProps) {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <p className="card-label">{label}</p>
        {Icon && (
          <span
            className="p-1.5 rounded-lg"
            style={{ backgroundColor: `${accentColor}18` }}
          >
            <Icon size={14} style={{ color: accentColor }} />
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-card-fg tabular-nums font-mono">{value ?? '—'}</p>
        {sub && <p className="mt-1 text-xs text-card-dim">{sub}</p>}
      </div>
    </div>
  );
}
