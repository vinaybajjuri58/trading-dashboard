import { useState, useCallback } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, ResponsiveContainer,
} from 'recharts';
import {
  useForwardTests,
  useForwardTestTrades,
  useForwardTestPnl,
} from '../api/hooks/useForwardTests';
import SSEFeed from '../components/SSEFeed';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { fmtNum } from '../utils/format';
import type { ForwardTest, Trade, SSEEvent } from '../types/api';

/* ── Strategy card ── */

type StrategyCardProps = {
  test: ForwardTest;
  selected: boolean;
  onClick: () => void;
};

function StrategyCard({ test, selected, onClick }: StrategyCardProps) {
  const totalPos = (test.total_pnl ?? 0) >= 0;
  const todayPos = (test.today_pnl ?? 0) >= 0;
  const hasPos   = Boolean(test.position?.side);

  return (
    <button
      onClick={onClick}
      className={`card p-4 text-left w-full transition-all ${
        selected
          ? 'ring-2 ring-accent border-accent/40'
          : 'hover:bg-card-hover'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-card-fg text-sm leading-tight">
            {test.name ?? test.strategy_name}
          </p>
          <p className="text-card-dim text-xs mt-0.5">{test.instrument ?? '—'}</p>
        </div>
        {totalPos
          ? <TrendingUp  size={15} className="text-positive shrink-0 mt-0.5" />
          : <TrendingDown size={15} className="text-negative shrink-0 mt-0.5" />
        }
      </div>

      <div className="flex gap-5 mb-3">
        <div>
          <p className="text-xs text-card-dim mb-0.5">Total P&amp;L</p>
          <p className={`text-lg font-bold font-mono leading-none ${totalPos ? 'text-positive' : 'text-negative'}`}>
            {test.total_pnl != null ? `${totalPos ? '+' : ''}${fmtNum(test.total_pnl)}` : '—'}
          </p>
        </div>
        <div>
          <p className="text-xs text-card-dim mb-0.5">Today</p>
          <p className={`text-sm font-mono font-medium leading-none ${todayPos ? 'text-positive' : 'text-negative'}`}>
            {test.today_pnl != null ? `${todayPos ? '+' : ''}${fmtNum(test.today_pnl)}` : '—'}
          </p>
        </div>
      </div>

      <div className="flex gap-2 text-xs mb-3">
        <span className="text-positive font-medium">{test.wins}W</span>
        <span className="text-card-dim">/</span>
        <span className="text-negative font-medium">{test.losses}L</span>
        {test.trades != null && (
          <span className="text-card-dim ml-1">({test.trades} total)</span>
        )}
      </div>

      {hasPos && test.position ? (
        <div className="bg-card-alt rounded-lg p-2 text-xs">
          <div className="flex items-center justify-between">
            <span className={`font-semibold ${test.position.side === 'LONG' ? 'text-positive' : 'text-negative'}`}>
              {test.position.side}
            </span>
            <span className="text-warn text-xs">● Open</span>
          </div>
          <p className="text-card-muted mt-0.5">
            Entry {test.position.entry_price ?? '—'} · Size {test.position.size ?? '—'}
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-xs text-card-dim">
          <Minus size={10} />
          Flat
        </div>
      )}
    </button>
  );
}

/* ── Trade status badge ── */

type StatusBadgeProps = {
  status: Trade['status'];
};

function StatusBadge({ status }: StatusBadgeProps) {
  const cls =
    status === 'open'   ? 'bg-positive/15 text-positive border-positive/20' :
    status === 'closed' ? 'bg-card-alt text-card-muted border-card-border'  :
                          'bg-card-alt text-card-dim border-card-border';
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-xs ${cls}`}>
      {status ?? '—'}
    </span>
  );
}

/* ── Selected strategy detail ── */

type StrategyDetailProps = {
  id: string | number;
};

function SelectedStrategyDetail({ id }: StrategyDetailProps) {
  const { data: trades, isLoading: tradesLoading } = useForwardTestTrades(id);
  const { data: pnl,    isLoading: pnlLoading    } = useForwardTestPnl(id);

  const pnlData = (pnl ?? []).map(d => ({ date: d.date, pnl: d.pnl ?? d.value ?? 0 }));

  return (
    <div className="card flex flex-col overflow-hidden min-h-0">
      {/* Daily P&L chart */}
      <div className="p-4 border-b border-card-border shrink-0">
        <h3 className="text-sm font-semibold text-card-fg mb-3">Daily P&amp;L</h3>
        {pnlLoading ? (
          <LoadingSpinner size="sm" className="py-4" />
        ) : pnlData.length === 0 ? (
          <p className="text-card-dim text-xs text-center py-4">No P&amp;L data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={110}>
            <BarChart data={pnlData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d8d3ca" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: '#78716c', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: '#78716c', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1c1917',
                  border: '1px solid #333',
                  borderRadius: 8,
                  fontSize: 11,
                  color: '#f0ebe3',
                }}
                labelStyle={{ color: '#f0ebe3' }}
              />
              <Bar dataKey="pnl" radius={[3, 3, 0, 0]} maxBarSize={24}>
                {pnlData.map((d, i) => (
                  <Cell key={i} fill={d.pnl >= 0 ? '#0d7c66' : '#c53030'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Trade log */}
      <div className="flex-1 overflow-auto min-h-0">
        <div className="px-4 py-3 border-b border-card-border sticky top-0 bg-card z-10">
          <h3 className="text-sm font-semibold text-card-fg">Trade Log</h3>
        </div>
        {tradesLoading ? (
          <LoadingSpinner size="sm" className="py-8" />
        ) : !trades?.length ? (
          <EmptyState message="No trades yet" />
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-card-border">
                <th className="text-left px-4 py-2.5 card-label">Date</th>
                <th className="text-left px-3 py-2.5 card-label">Side</th>
                <th className="text-right px-3 py-2.5 card-label">Entry</th>
                <th className="text-right px-3 py-2.5 card-label">Exit</th>
                <th className="text-right px-3 py-2.5 card-label">P&amp;L</th>
                <th className="text-center px-3 py-2.5 card-label">Status</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((t: Trade, i: number) => {
                const pnlPos = (t.pnl ?? 0) >= 0;
                return (
                  <tr key={i} className="border-b border-card-border/30 hover:bg-card-hover transition-colors">
                    <td className="px-4 py-2 text-card-dim">{t.date ?? '—'}</td>
                    <td className={`px-3 py-2 font-semibold ${t.side === 'LONG' ? 'text-positive' : 'text-negative'}`}>
                      {t.side ?? '—'}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-card-fg">{fmtNum(t.entry)}</td>
                    <td className="px-3 py-2 text-right font-mono text-card-muted">
                      {t.exit != null ? fmtNum(t.exit) : '—'}
                    </td>
                    <td className={`px-3 py-2 text-right font-mono font-medium ${pnlPos ? 'text-positive' : 'text-negative'}`}>
                      {t.pnl != null ? `${pnlPos ? '+' : ''}${fmtNum(t.pnl)}` : '—'}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <StatusBadge status={t.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ── Page ── */

export default function ForwardTests() {
  const [selectedId, setSelectedId]       = useState<string | number | null>(null);
  const [liveOverrides, setLiveOverrides] = useState<Record<string | number, Partial<ForwardTest>>>({});

  const { data: initialTests, isLoading, error } = useForwardTests();

  const tests: ForwardTest[] | undefined = initialTests?.map(t =>
    liveOverrides[t.id] ? { ...t, ...liveOverrides[t.id] } : t,
  );

  const handleSSEEvent = useCallback((event: SSEEvent) => {
    if (
      ['trade', 'fill', 'position'].includes(event.type) &&
      event.strategy_id != null &&
      event.data != null
    ) {
      setLiveOverrides(prev => ({
        ...prev,
        [event.strategy_id as string | number]: {
          ...prev[event.strategy_id as string | number],
          ...event.data,
        },
      }));
    }
  }, []);

  if (isLoading) return <LoadingSpinner size="lg" className="h-full" />;

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold text-white">Forward Tests</h1>
        <p className="text-sb-text text-sm mt-1">
          Live IB paper account — {tests?.length ?? 0} strategies running
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-negative/30 bg-negative/10 px-4 py-2.5 text-xs text-negative/80 shrink-0">
          API unavailable — showing empty state. {error.message}
        </div>
      )}

      {/* Strategy cards */}
      <div className="shrink-0">
        {!tests?.length ? (
          <EmptyState message="No forward tests configured" />
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {tests.map(t => (
              <StrategyCard
                key={String(t.id)}
                test={t}
                selected={selectedId === t.id}
                onClick={() => setSelectedId(prev => (prev === t.id ? null : t.id))}
              />
            ))}
          </div>
        )}
      </div>

      {/* SSE feed + detail */}
      <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
        <SSEFeed onEvent={handleSSEEvent} />

        {selectedId != null ? (
          <SelectedStrategyDetail id={selectedId} />
        ) : (
          <div className="card flex items-center justify-center">
            <p className="text-card-dim text-sm">Select a strategy to view trade log & P&amp;L</p>
          </div>
        )}
      </div>
    </div>
  );
}
