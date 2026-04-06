import { fmtPct } from '../utils/format';
import type { RollingReturns, RollingPeriod } from '../types/api';

type PeriodKey = '3m' | '6m' | '1y';
const PERIODS: PeriodKey[] = ['3m', '6m', '1y'];

type PctCellProps = {
  value: number | null | undefined;
};

function PctCell({ value }: PctCellProps) {
  if (value == null) {
    return <td className="py-2.5 text-right font-mono text-card-dim text-sm">—</td>;
  }
  return (
    <td className={`py-2.5 text-right font-mono text-sm font-medium ${value < 0 ? 'text-negative' : 'text-positive'}`}>
      {fmtPct(value)}
    </td>
  );
}

type RollingReturnsTableProps = {
  data: RollingReturns | null | undefined;
};

export default function RollingReturnsTable({ data }: RollingReturnsTableProps) {
  if (!data) return null;

  return (
    <table className="w-full text-sm">
      <thead>
        <tr>
          <th className="text-left py-2 card-label">Period</th>
          <th className="text-right py-2 card-label">Min</th>
          <th className="text-right py-2 card-label">Median</th>
          <th className="text-right py-2 card-label">Max</th>
        </tr>
      </thead>
      <tbody>
        {PERIODS.map(period => {
          const row: RollingPeriod | undefined = data[period];
          return (
            <tr key={period} className="border-t border-card-border/50">
              <td className="py-2.5 text-card-muted font-mono text-xs uppercase">{period}</td>
              <PctCell value={row?.min} />
              <PctCell value={row?.median} />
              <PctCell value={row?.max} />
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
