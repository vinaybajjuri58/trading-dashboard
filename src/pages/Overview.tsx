import { Link } from 'react-router-dom';
import { Target, CheckCircle, Shield, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSummary } from '../api/hooks/useSummary';
import StatCard from '../components/StatCard';
import MarketBadge from '../components/MarketBadge';
import BadgePass from '../components/BadgePass';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { fmtNum, fmtPct, safePct } from '../utils/format';
import { MARKET_COLORS } from '../constants/markets';
import type { TopStrategy } from '../types/api';

type DonutPayloadItem = {
  name: string;
  value: number;
};

type DonutTooltipProps = {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
};

function DonutTooltip({ active, payload }: DonutTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-overlay border border-divider rounded-md px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-white">{item?.name}</p>
      <p className="text-subtle mt-0.5">{item?.value} strategies</p>
    </div>
  );
}

export default function Overview() {
  const { data, isLoading, error } = useSummary();

  if (isLoading) return <LoadingSpinner size="lg" className="h-full" />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <p className="text-negative text-sm">Failed to load summary</p>
        <p className="text-muted text-xs">{error.message}</p>
      </div>
    );
  }

  if (!data) return <EmptyState className="h-full" />;

  const { total, wf_pass_count, mc_pass_count, both_pass_count, by_market, top_strategies } = data;

  const marketData: DonutPayloadItem[] = Object.entries(by_market ?? {}).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-subtle text-sm mt-1">Strategy portfolio health at a glance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Total Strategies"
          value={total}
          icon={Target}
          accentColor="#58a6ff"
        />
        <StatCard
          label="WF Pass"
          value={wf_pass_count}
          sub={`${safePct(wf_pass_count, total).toFixed(0)}% of total`}
          icon={CheckCircle}
          accentColor="#3fb950"
        />
        <StatCard
          label="MC Pass"
          value={mc_pass_count}
          sub={`${safePct(mc_pass_count, total).toFixed(0)}% of total`}
          icon={Shield}
          accentColor="#d29922"
        />
        <StatCard
          label="Both Pass"
          value={both_pass_count}
          sub="WF + MC validated"
          icon={TrendingUp}
          accentColor="#a371f7"
        />
      </div>

      {/* Market breakdown + Top 10 */}
      <div className="grid grid-cols-3 gap-6">
        {/* Donut chart */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-white mb-1">Market Breakdown</h2>
          <p className="text-xs text-muted mb-4">Strategies by market type</p>
          {marketData.length === 0 ? (
            <EmptyState message="No market data" />
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie
                  data={marketData}
                  cx="50%"
                  cy="45%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {marketData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={MARKET_COLORS[entry.name] ?? '#8b949e'}
                    />
                  ))}
                </Pie>
                <Tooltip content={<DonutTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={7}
                  formatter={(val: string) => (
                    <span style={{ color: '#8b949e', fontSize: 11 }}>{val}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top 10 table */}
        <div className="card col-span-2 flex flex-col overflow-hidden">
          <div className="px-5 py-3.5 border-b border-divider flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Top 10 Strategies</h2>
            <Link to="/strategies" className="text-xs text-accent hover:underline">
              View all →
            </Link>
          </div>
          <div className="overflow-auto flex-1">
            {!top_strategies?.length ? (
              <EmptyState message="No strategies available" />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-subtle border-b border-divider">
                    <th className="text-left px-5 py-2.5 text-xs font-medium uppercase tracking-wide">Strategy</th>
                    <th className="text-left px-3 py-2.5 text-xs font-medium uppercase tracking-wide">Market</th>
                    <th className="text-left px-3 py-2.5 text-xs font-medium uppercase tracking-wide">Instrument</th>
                    <th className="text-right px-3 py-2.5 text-xs font-medium uppercase tracking-wide">Sharpe</th>
                    <th className="text-right px-3 py-2.5 text-xs font-medium uppercase tracking-wide">CAGR</th>
                    <th className="text-center px-3 py-2.5 text-xs font-medium uppercase tracking-wide">WF</th>
                    <th className="text-center px-3 py-2.5 text-xs font-medium uppercase tracking-wide">MC</th>
                  </tr>
                </thead>
                <tbody>
                  {top_strategies.map((s: TopStrategy, i: number) => {
                    const sid = s.id ?? s.strategy_id ?? i;
                    return (
                      <tr
                        key={String(sid)}
                        className="border-b border-divider/40 hover:bg-overlay transition-colors"
                      >
                        <td className="px-5 py-2.5 max-w-[200px]">
                          <Link
                            to={`/strategies/${sid}`}
                            className="text-accent hover:underline font-medium truncate block"
                          >
                            {s.strategy_name}
                          </Link>
                        </td>
                        <td className="px-3 py-2.5"><MarketBadge market={s.market} /></td>
                        <td className="px-3 py-2.5 text-subtle text-xs">{s.instrument ?? '—'}</td>
                        <td className="px-3 py-2.5 text-right font-mono text-sm">
                          <span className={(s.sharpe ?? 0) >= 2 ? 'text-positive font-semibold' : 'text-white'}>
                            {fmtNum(s.sharpe)}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-sm">
                          <span className={(s.cagr ?? 0) >= 0 ? 'text-positive' : 'text-negative'}>
                            {fmtPct(s.cagr)}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-center"><BadgePass value={s.wf_pass} /></td>
                        <td className="px-3 py-2.5 text-center"><BadgePass value={s.mc_pass} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
