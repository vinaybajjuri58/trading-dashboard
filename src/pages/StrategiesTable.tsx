import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronUp, ChevronDown, ChevronsUpDown, RefreshCw, X } from 'lucide-react';
import { useStrategies } from '../api/hooks/useStrategies';
import MarketBadge from '../components/MarketBadge';
import BadgePass from '../components/BadgePass';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { fmtPct, fmtNum, fmtInt } from '../utils/format';
import { MARKETS, TIMEFRAMES, CATEGORIES, INSTRUMENTS } from '../constants/markets';
import type { Strategy, StrategyFilters } from '../types/api';

type SortDir = 'asc' | 'desc';
type ColumnAlign = 'left' | 'right' | 'center';

type Column = {
  key: keyof Strategy;
  label: string;
  align: ColumnAlign;
  sortable: boolean;
};

const COLUMNS: Column[] = [
  { key: 'strategy_name', label: 'Strategy',    align: 'left',   sortable: true  },
  { key: 'market',        label: 'Market',       align: 'left',   sortable: true  },
  { key: 'instrument',    label: 'Instrument',   align: 'left',   sortable: false },
  { key: 'timeframe',     label: 'Timeframe',    align: 'left',   sortable: true  },
  { key: 'trades',        label: 'Trades',       align: 'right',  sortable: true  },
  { key: 'cagr',          label: 'CAGR %',       align: 'right',  sortable: true  },
  { key: 'sharpe',        label: 'Sharpe',       align: 'right',  sortable: true  },
  { key: 'max_dd',        label: 'Max DD %',     align: 'right',  sortable: true  },
  { key: 'win_rate',      label: 'Win Rate %',   align: 'right',  sortable: true  },
  { key: 'profit_factor', label: 'Prof. Factor', align: 'right',  sortable: true  },
  { key: 'wf_pass',       label: 'WF',           align: 'center', sortable: true  },
  { key: 'mc_pass',       label: 'MC',           align: 'center', sortable: true  },
];

const ALIGN_CLASS: Record<ColumnAlign, string> = {
  left:   'text-left',
  right:  'text-right',
  center: 'text-center',
};

function compareValues(a: Strategy[keyof Strategy], b: Strategy[keyof Strategy], dir: SortDir): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  if (typeof a === 'string' && typeof b === 'string') {
    return dir === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
  }
  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return dir === 'asc' ? Number(a) - Number(b) : Number(b) - Number(a);
  }
  const na = Number(a);
  const nb = Number(b);
  return dir === 'asc' ? na - nb : nb - na;
}

export default function StrategiesTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortField, setSortField] = useState<keyof Strategy>('sharpe');
  const [sortDir, setSortDir]     = useState<SortDir>('desc');

  const filters: StrategyFilters = {
    market:     searchParams.get('market')     ?? '',
    timeframe:  searchParams.get('timeframe')  ?? '',
    category:   searchParams.get('category')   ?? '',
    instrument: searchParams.get('instrument') ?? '',
    wf_pass:    searchParams.get('wf_pass')    ?? '',
    mc_pass:    searchParams.get('mc_pass')    ?? '',
    min_sharpe: searchParams.get('min_sharpe') ?? '',
    min_trades: searchParams.get('min_trades') ?? '',
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const { data: strategies, isLoading, isFetching, error, refetch } = useStrategies(filters);

  const setFilter = (key: keyof StrategyFilters, val: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (val) next.set(key, val);
      else next.delete(key);
      return next;
    });
  };

  const handleSort = (field: keyof Strategy) => {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sorted = useMemo<Strategy[]>(() => {
    if (!strategies) return [];
    return [...strategies].sort((a, b) =>
      compareValues(a[sortField], b[sortField], sortDir),
    );
  }, [strategies, sortField, sortDir]);

  return (
    <div className="p-6 flex flex-col gap-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Strategies</h1>
          <p className="text-sb-text text-sm mt-1">
            {isLoading
              ? 'Loading…'
              : `${sorted.length} strateg${sorted.length === 1 ? 'y' : 'ies'}`}
            {isFetching && !isLoading && (
              <span className="ml-2 text-xs text-sb-text/60">(refreshing…)</span>
            )}
          </p>
        </div>
        <button onClick={() => void refetch()} className="btn-ghost">
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {/* Filter bar */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <select className="select" value={filters.market} onChange={e => setFilter('market', e.target.value)}>
          <option value="">All Markets</option>
          {MARKETS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <select className="select" value={filters.timeframe} onChange={e => setFilter('timeframe', e.target.value)}>
          <option value="">All Timeframes</option>
          {TIMEFRAMES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <select className="select" value={filters.category} onChange={e => setFilter('category', e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select className="select" value={filters.instrument} onChange={e => setFilter('instrument', e.target.value)}>
          <option value="">All Instruments</option>
          {INSTRUMENTS.map(i => <option key={i} value={i}>{i}</option>)}
        </select>

        <select className="select" value={filters.wf_pass} onChange={e => setFilter('wf_pass', e.target.value)}>
          <option value="">WF: All</option>
          <option value="true">WF: Pass</option>
          <option value="false">WF: Fail</option>
        </select>

        <select className="select" value={filters.mc_pass} onChange={e => setFilter('mc_pass', e.target.value)}>
          <option value="">MC: All</option>
          <option value="true">MC: Pass</option>
          <option value="false">MC: Fail</option>
        </select>

        <input
          type="number"
          className="input w-32"
          placeholder="Min Sharpe"
          value={filters.min_sharpe}
          onChange={e => setFilter('min_sharpe', e.target.value)}
          step="0.1"
          min="0"
        />

        <input
          type="number"
          className="input w-32"
          placeholder="Min Trades"
          value={filters.min_trades}
          onChange={e => setFilter('min_trades', e.target.value)}
          min="0"
        />

        {activeFilterCount > 0 && (
          <button onClick={() => setSearchParams({})} className="btn-ghost text-xs gap-1.5">
            <X size={12} />
            Clear ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-lg border border-negative/30 bg-negative/10 px-4 py-2.5 text-xs text-negative/80 shrink-0">
          API unavailable — showing empty state. {error.message}
        </div>
      )}

      {/* Table */}
      <div className="card flex-1 overflow-hidden flex flex-col min-h-0">
        {isLoading ? (
          <LoadingSpinner size="lg" className="flex-1" />
        ) : sorted.length === 0 ? (
          <EmptyState message="No strategies match the current filters" className="flex-1" />
        ) : (
          <div className="overflow-auto flex-1">
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 bg-card z-10">
                <tr className="border-b border-card-border">
                  {COLUMNS.map(col => (
                    <th
                      key={col.key}
                      className={`px-4 py-3 card-label whitespace-nowrap
                        ${ALIGN_CLASS[col.align]}
                        ${col.sortable ? 'cursor-pointer select-none hover:text-card-fg transition-colors' : ''}`}
                      onClick={() => col.sortable && handleSort(col.key)}
                    >
                      <span className="inline-flex items-center gap-1">
                        {col.align === 'right' && col.sortable && (
                          <SortIcon field={col.key} sortField={sortField} sortDir={sortDir} />
                        )}
                        {col.label}
                        {col.align !== 'right' && col.sortable && (
                          <SortIcon field={col.key} sortField={sortField} sortDir={sortDir} />
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((s, i) => (
                  <StrategyRow key={String(s.id ?? s.strategy_id ?? i)} strategy={s} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

type SortIconProps = {
  field: keyof Strategy;
  sortField: keyof Strategy;
  sortDir: SortDir;
};

function SortIcon({ field, sortField, sortDir }: SortIconProps) {
  if (field !== sortField) return <ChevronsUpDown size={11} className="text-card-dim shrink-0" />;
  return sortDir === 'asc'
    ? <ChevronUp   size={11} className="text-accent shrink-0" />
    : <ChevronDown size={11} className="text-accent shrink-0" />;
}

type StrategyRowProps = {
  strategy: Strategy;
};

function StrategyRow({ strategy: s }: StrategyRowProps) {
  const sid = s.id ?? s.strategy_id;
  return (
    <tr className="border-b border-card-border/30 hover:bg-card-hover transition-colors">
      <td className="px-4 py-2.5 max-w-[220px]">
        {sid != null ? (
          <Link to={`/strategies/${sid}`} className="text-accent hover:underline font-medium truncate block">
            {s.strategy_name}
          </Link>
        ) : (
          <span className="font-medium truncate block text-card-fg">{s.strategy_name}</span>
        )}
      </td>
      <td className="px-4 py-2.5"><MarketBadge market={s.market} /></td>
      <td className="px-4 py-2.5 text-card-muted text-xs">{s.instrument ?? '—'}</td>
      <td className="px-4 py-2.5 text-card-muted text-xs">{s.timeframe ?? '—'}</td>
      <td className="px-4 py-2.5 text-right font-mono text-xs text-card-muted">{fmtInt(s.trades)}</td>
      <td className="px-4 py-2.5 text-right font-mono text-sm">
        <span className={(s.cagr ?? 0) >= 0 ? 'text-positive' : 'text-negative'}>{fmtPct(s.cagr)}</span>
      </td>
      <td className="px-4 py-2.5 text-right font-mono text-sm">
        <span className={(s.sharpe ?? 0) >= 2 ? 'text-positive font-semibold' : 'text-card-fg'}>{fmtNum(s.sharpe)}</span>
      </td>
      <td className="px-4 py-2.5 text-right font-mono text-sm">
        <span className={s.max_dd != null && s.max_dd <= -20 ? 'text-negative' : 'text-card-muted'}>{fmtPct(s.max_dd)}</span>
      </td>
      <td className="px-4 py-2.5 text-right font-mono text-sm text-card-fg">{fmtPct(s.win_rate)}</td>
      <td className="px-4 py-2.5 text-right font-mono text-sm text-card-fg">{fmtNum(s.profit_factor)}</td>
      <td className="px-4 py-2.5 text-center"><BadgePass value={s.wf_pass} /></td>
      <td className="px-4 py-2.5 text-center"><BadgePass value={s.mc_pass} /></td>
    </tr>
  );
}
