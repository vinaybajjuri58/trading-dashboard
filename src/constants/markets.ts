import type { Market } from '../types/api';

export const MARKET_COLORS: Record<string, string> = {
  Indian:  '#ff9f43',
  Forex:   '#54a0ff',
  Futures: '#a371f7',
} satisfies Record<Market, string>;

export const MARKET_BADGE_STYLES: Record<string, string> = {
  Indian:  'bg-indian/10 text-indian border-indian/25',
  Forex:   'bg-forex/10 text-forex border-forex/25',
  Futures: 'bg-futures/10 text-futures border-futures/25',
} satisfies Record<Market, string>;

export const MARKETS: Market[] = ['Indian', 'Forex', 'Futures'];
export const TIMEFRAMES = ['Intraday', 'Swing', 'Daily'] as const;
export type TimeframeValue = (typeof TIMEFRAMES)[number];
