import { MARKET_BADGE_STYLES } from '../constants/markets';

type MarketBadgeProps = {
  market: string | null | undefined;
};

const FALLBACK_STYLE = 'bg-overlay text-subtle border-divider';

export default function MarketBadge({ market }: MarketBadgeProps) {
  const cls = (market && MARKET_BADGE_STYLES[market]) || FALLBACK_STYLE;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cls}`}>
      {market ?? '—'}
    </span>
  );
}
