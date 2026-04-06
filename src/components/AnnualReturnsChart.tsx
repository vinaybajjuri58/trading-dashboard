import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, ResponsiveContainer, ReferenceLine,
} from 'recharts';

type ChartDataPoint = {
  year: string;
  return: number;
};

// Typed to match Recharts' custom tooltip signature
type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
};

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value ?? 0;
  return (
    <div className="bg-overlay border border-divider rounded-md px-3 py-2 text-xs shadow-lg">
      <p className="text-subtle mb-1">{label}</p>
      <p className={`font-mono font-medium ${val >= 0 ? 'text-positive' : 'text-negative'}`}>
        {val >= 0 ? '+' : ''}{val.toFixed(2)}%
      </p>
    </div>
  );
}

type AnnualReturnsChartProps = {
  data: Record<string, number> | null | undefined;
};

export default function AnnualReturnsChart({ data }: AnnualReturnsChartProps) {
  if (!data || Object.keys(data).length === 0) {
    return <p className="text-muted text-sm text-center py-8">No annual return data</p>;
  }

  const chartData: ChartDataPoint[] = Object.entries(data)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([year, ret]) => ({ year, return: ret }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
        <ReferenceLine y={0} stroke="#484f58" />
        <XAxis
          dataKey="year"
          tick={{ fill: '#8b949e', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#8b949e', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `${v}%`}
          width={44}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(88,166,255,0.04)' }} />
        <Bar dataKey="return" radius={[3, 3, 0, 0]} maxBarSize={40}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.return >= 0 ? '#3fb950' : '#f85149'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
