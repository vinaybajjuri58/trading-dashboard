import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useStrategy } from '../api/hooks/useStrategy';
import MarketBadge from '../components/MarketBadge';
import BadgePass from '../components/BadgePass';
import AnnualReturnsChart from '../components/AnnualReturnsChart';
import RollingReturnsTable from '../components/RollingReturnsTable';
import LoadingSpinner from '../components/LoadingSpinner';
import { fmtPct, fmtNum, fmtInt } from '../utils/format';
import { CATEGORY_DESCRIPTIONS, SOURCE_INFO } from '../constants/strategyMeta';

type ChipProps = {
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
};

type MetricRowProps = {
  label: string;
  value: string;
  colorVal?: number | null;
  forceColor?: 'pos' | 'neg' | null;
};

function BackLink() {
  return (
    <Link
      to="/strategies"
      className="inline-flex items-center gap-1.5 text-sb-text hover:text-white text-sm transition-colors"
    >
      <ArrowLeft size={13} />
      Back to Strategies
    </Link>
  );
}

function Chip({ label, value, positive, negative }: ChipProps) {
  const textCls = positive ? 'text-positive' : negative ? 'text-negative' : 'text-card-fg';
  return (
    <div className="bg-card-alt border border-card-border rounded-lg px-3.5 py-2 text-center min-w-[72px]">
      <p className="text-xs text-card-dim mb-0.5">{label}</p>
      <p className={`text-sm font-bold font-mono ${textCls}`}>{value}</p>
    </div>
  );
}

function MetricRow({ label, value, colorVal, forceColor }: MetricRowProps) {
  let textCls = 'text-card-fg';
  if (forceColor === 'pos') textCls = 'text-positive';
  else if (forceColor === 'neg') textCls = 'text-negative';
  else if (colorVal != null) textCls = colorVal >= 0 ? 'text-positive' : 'text-negative';

  return (
    <div className="metric-row">
      <dt className="metric-label">{label}</dt>
      <dd className={`metric-value ${textCls}`}>{value}</dd>
    </div>
  );
}

export default function StrategyDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: strategy, isLoading, error } = useStrategy(id);

  if (isLoading) {
    return (
      <div className="p-6">
        <BackLink />
        <LoadingSpinner size="lg" className="mt-24" />
      </div>
    );
  }

  if ((error || !strategy) && !isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-5xl">
        <BackLink />
        {error && (
          <div className="rounded-lg border border-negative/30 bg-negative/10 px-4 py-2.5 text-xs text-negative/80">
            API unavailable — could not load strategy. {error.message}
          </div>
        )}
        <div className="card p-6">
          <h1 className="text-2xl font-bold text-card-fg mb-2.5">—</h1>
          <p className="text-card-dim text-sm">No data available</p>
        </div>
      </div>
    );
  }

  if (!strategy) return null;

  const isForex = strategy.market === 'Forex';
  const hasWF   = strategy.wf_pass != null || strategy.wf_oos_sharpe != null;
  const hasMC   = strategy.mc_pass != null || strategy.mc_dd_95pct != null;

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <BackLink />

      {/* Header card */}
      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-card-fg mb-2.5">{strategy.strategy_name}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <MarketBadge market={strategy.market} />
              {strategy.instrument && (
                <span className="text-card-muted text-sm">{strategy.instrument}</span>
              )}
              {strategy.timeframe && (
                <>
                  <span className="text-card-dim">·</span>
                  <span className="text-card-muted text-sm">{strategy.timeframe}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Chip label="Sharpe"   value={fmtNum(strategy.sharpe)}   positive={(strategy.sharpe ?? 0) >= 2} />
            <Chip label="CAGR"     value={fmtPct(strategy.cagr)}     positive={(strategy.cagr ?? 0) >= 0} negative={(strategy.cagr ?? 0) < 0} />
            <Chip label="Max DD"   value={fmtPct(strategy.max_dd)}   negative={strategy.max_dd != null && strategy.max_dd <= -20} />
            <Chip label="Win Rate" value={fmtPct(strategy.win_rate)} />
          </div>
        </div>
      </div>

      {/* Metrics + validation */}
      <div className="grid grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-card-fg mb-4">Performance Metrics</h2>
          <dl className="space-y-0">
            <MetricRow label="Total Return"  value={fmtPct(strategy.total_return)}  colorVal={strategy.total_return} />
            <MetricRow label="CAGR"          value={fmtPct(strategy.cagr)}          colorVal={strategy.cagr} />
            <MetricRow label="Sharpe Ratio"  value={fmtNum(strategy.sharpe)} />
            <MetricRow label="Max Drawdown"  value={fmtPct(strategy.max_dd)}        forceColor={strategy.max_dd != null && strategy.max_dd <= -20 ? 'neg' : null} />
            <MetricRow label="Win Rate"      value={fmtPct(strategy.win_rate)} />
            <MetricRow label="Avg Win"       value={fmtPct(strategy.avg_win)}       forceColor="pos" />
            <MetricRow label="Avg Loss"      value={fmtPct(strategy.avg_loss)}      forceColor="neg" />
            <MetricRow label="Profit Factor" value={fmtNum(strategy.profit_factor)} />
            <MetricRow label="Avg Hold"      value={strategy.avg_hold != null ? String(strategy.avg_hold) : '—'} />
            <MetricRow label="Total Trades"  value={fmtInt(strategy.trades)} />
          </dl>
        </div>

        <div className="space-y-5">
          {hasWF && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-card-fg">Walk-Forward Validation</h2>
                <BadgePass value={strategy.wf_pass} />
              </div>
              <dl className="space-y-0">
                <MetricRow label="OOS Sharpe"            value={fmtNum(strategy.wf_oos_sharpe)} />
                <MetricRow label="IS Sharpe"             value={fmtNum(strategy.wf_is_sharpe)} />
                <MetricRow label="WF Efficiency"         value={fmtNum(strategy.wf_efficiency)} />
                <MetricRow label="% Profitable Windows"  value={fmtPct(strategy.wf_pct_profit)} />
              </dl>
            </div>
          )}

          {hasMC && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-card-fg">Monte Carlo Analysis</h2>
                <BadgePass value={strategy.mc_pass} />
              </div>
              <dl className="space-y-0">
                <MetricRow label="95th Pct Drawdown" value={fmtPct(strategy.mc_dd_95pct)}  forceColor="neg" />
                <MetricRow label="5th Pct CAGR"      value={fmtPct(strategy.mc_cagr_5pct)} colorVal={strategy.mc_cagr_5pct} />
                <MetricRow label="Ruin Probability"  value={fmtPct(strategy.mc_ruin_prob)} />
              </dl>
            </div>
          )}

          {!hasWF && !hasMC && (
            <div className="card p-5 flex items-center justify-center h-32">
              <p className="text-card-dim text-sm">No validation data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Forex-only charts */}
      {isForex && strategy.annual_returns && Object.keys(strategy.annual_returns).length > 0 && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-card-fg mb-1">Annual Returns</h2>
          <p className="text-xs text-card-dim mb-4">Yearly performance 2021–present</p>
          <AnnualReturnsChart data={strategy.annual_returns} />
        </div>
      )}

      {isForex && strategy.rolling && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-card-fg mb-4">Rolling Returns</h2>
          <RollingReturnsTable data={strategy.rolling} />
        </div>
      )}

      {/* About block */}
      {(strategy.category || strategy.source) && (
        <div className="card p-6 space-y-6">
          <h2 className="text-sm font-semibold text-card-fg">About This Strategy</h2>

          {strategy.category && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-card-dim uppercase tracking-wider">Category</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border bg-accent/10 text-accent border-accent/25">
                  {strategy.category}
                </span>
              </div>
              {CATEGORY_DESCRIPTIONS[strategy.category] ? (
                <p className="text-sm text-card-muted leading-relaxed">
                  {CATEGORY_DESCRIPTIONS[strategy.category]}
                </p>
              ) : (
                <p className="text-sm text-card-dim italic">No description available for this category.</p>
              )}
            </div>
          )}

          {strategy.source && (
            <div className="space-y-2 pt-4 border-t border-card-border">
              <span className="text-xs font-medium text-card-dim uppercase tracking-wider">Data Source</span>
              {SOURCE_INFO[strategy.source] ? (
                <>
                  <p className="text-sm font-medium text-card-fg">{SOURCE_INFO[strategy.source].label}</p>
                  <p className="text-sm text-card-muted leading-relaxed">{SOURCE_INFO[strategy.source].description}</p>
                </>
              ) : (
                <p className="text-sm text-card-fg font-mono">{strategy.source}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
