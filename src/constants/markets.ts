import type { Market } from '../types/api';

export const MARKET_COLORS: Record<string, string> = {
  Indian:  '#e67e22',
  Forex:   '#2980b9',
  Futures: '#8e44ad',
} satisfies Record<Market, string>;

export const MARKET_BADGE_STYLES: Record<string, string> = {
  Indian:  'bg-indian/15 text-indian border-indian/25',
  Forex:   'bg-forex/15 text-forex border-forex/25',
  Futures: 'bg-futures/15 text-futures border-futures/25',
} satisfies Record<Market, string>;

export const MARKETS: Market[] = ['Indian', 'Forex', 'Futures'];
export const TIMEFRAMES = ['Intraday', 'Swing', 'Daily'] as const;
export type TimeframeValue = (typeof TIMEFRAMES)[number];

export const INSTRUMENTS = [
  'NIFTY', 'BANKNIFTY', 'NIFTY+BNF',
  'EURUSD', 'USDJPY', 'XAUUSD',
  'ES=F', 'NQ=F',
] as const;
export type InstrumentValue = (typeof INSTRUMENTS)[number];

export const CATEGORIES = [
  'Momentum',
  'Mean Reversion',
  'Trend Following',
  'Breakout',
  'Carry',
  'Macro',
  'Statistical Arbitrage',
  'Volatility',
  'Seasonality',
  'Adaptive',
] as const;
export type CategoryValue = (typeof CATEGORIES)[number];
