// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export type Market = 'Indian' | 'Forex' | 'Futures';
export type Timeframe = 'Intraday' | 'Swing' | 'Daily';
export type PassStatus = boolean | null;
export type Side = 'LONG' | 'SHORT';
export type TradeStatus = 'open' | 'closed' | string;

// ---------------------------------------------------------------------------
// Strategy
// ---------------------------------------------------------------------------

export type RollingPeriod = {
  min: number | null;
  median: number | null;
  max: number | null;
};

export type RollingReturns = {
  '3m'?: RollingPeriod;
  '6m'?: RollingPeriod;
  '1y'?: RollingPeriod;
};

export type Strategy = {
  id?: string | number;
  strategy_id?: string | number;
  strategy_name: string;
  market: Market | string;
  instrument: string | null;
  timeframe: Timeframe | string | null;
  trades: number | null;
  cagr: number | null;
  sharpe: number | null;
  max_dd: number | null;
  win_rate: number | null;
  avg_win: number | null;
  avg_loss: number | null;
  profit_factor: number | null;
  avg_hold: string | number | null;
  total_return: number | null;
  wf_pass: PassStatus;
  mc_pass: PassStatus;
  // Walk-Forward
  wf_oos_sharpe: number | null;
  wf_is_sharpe: number | null;
  wf_efficiency: number | null;
  wf_pct_profit: number | null;
  // Monte Carlo
  mc_dd_95pct: number | null;
  mc_cagr_5pct: number | null;
  mc_ruin_prob: number | null;
  // Forex-only
  annual_returns: Record<string, number> | null;
  rolling: RollingReturns | null;
};

// Subset returned in the summary top-10 list
export type TopStrategy = {
  id?: string | number;
  strategy_id?: string | number;
  strategy_name: string;
  market: Market | string;
  instrument: string | null;
  sharpe: number | null;
  cagr: number | null;
  wf_pass: PassStatus;
  mc_pass: PassStatus;
};

// ---------------------------------------------------------------------------
// Backtest summary  (GET /api/backtests/summary)
// ---------------------------------------------------------------------------

export type BacktestSummary = {
  total: number;
  wf_pass_count: number;
  mc_pass_count: number;
  both_pass_count: number;
  by_market: Record<string, number>;
  top_strategies: TopStrategy[];
};

// ---------------------------------------------------------------------------
// Strategy filters  (query params for GET /api/strategies)
// ---------------------------------------------------------------------------

export type StrategyFilters = {
  market: string;
  timeframe: string;
  wf_pass: string;
  mc_pass: string;
  min_sharpe: string;
  min_trades: string;
};

// ---------------------------------------------------------------------------
// Forward tests
// ---------------------------------------------------------------------------

export type Position = {
  side: Side;
  entry_price: number | null;
  size: number | string | null;
  entry_time?: string | null;
};

export type ForwardTest = {
  id: string | number;
  name?: string;
  strategy_name?: string;
  instrument: string | null;
  total_pnl: number | null;
  today_pnl: number | null;
  wins: number;
  losses: number;
  trades?: number;
  position: Position | null;
};

export type Trade = {
  date: string | null;
  side: Side | null;
  entry: number | null;
  exit: number | null;
  pnl: number | null;
  status: TradeStatus | null;
};

export type DailyPnl = {
  date: string;
  pnl: number;
  value?: number;
};

// ---------------------------------------------------------------------------
// SSE
// ---------------------------------------------------------------------------

export type SSEEvent = {
  type: string;
  strategy_id?: string | number;
  data?: Partial<ForwardTest>;
  _ts?: number;
  [key: string]: unknown;
};
