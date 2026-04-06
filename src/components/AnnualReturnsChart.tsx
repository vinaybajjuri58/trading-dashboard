import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, ResponsiveContainer, ReferenceLine,
} from 'recharts';

type ChartDataPoint = {
  year: string;
  return: number;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
};

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value ?? 0;
  return (
    <div className="bg-card-fg border border-card-fg/80 rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="text-card-dim mb-1">{label}</p>
      <p className={`font-mono font-semibold ${val >= 0 ? 'text-green-400' : 'text-red-400'}`}>
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
    return <p className="text-card-dim text-sm text-center py-8">No annual return data</p>;
  }

  const chartData: ChartDataPoint[] = Object.entries(data)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([year, ret]) => ({ year, return: ret }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#d8d3ca" vertical={false} />
        <ReferenceLine y={0} stroke="#b5b0a8" />
        <XAxis
          dataKey="year"
          tick={{ fill: '#78716c', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#78716c', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `${v}%`}
          width={44}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(13,124,102,0.06)' }} />
        <Bar dataKey="return" radius={[4, 4, 0, 0]} maxBarSize={40}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.return >= 0 ? '#0d7c66' : '#c53030'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
