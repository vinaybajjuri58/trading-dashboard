export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Momentum':
    'Buys assets with recent strong performance and sells laggards, betting that price trends persist over a medium-term horizon.',
  'Cross-Asset Momentum':
    'Applies momentum signals across multiple asset classes simultaneously — equities, FX, commodities or rates — to diversify the carry of a single-asset trend.',
  'Mean Reversion':
    'Fades short-term price dislocations and bets on reversion toward a statistical mean or fair value, profiting from overreactions.',
  'Mean Reversion / Short-Term':
    'Exploits intraday or overnight over-extensions, entering contra-trend on exhaustion signals and exiting quickly as price reverts.',
  'Mean Reversion / Value':
    'Combines price reversion with a valuation anchor — entering when an asset is cheap relative to a fundamental or carry-based estimate of fair value.',
  'Volatility / Mean Reversion':
    'Sells volatility when implied or realised vol is stretched above its historical norm, expecting the eventual collapse back toward average levels.',
  'Trend Following':
    'Systematically rides sustained directional moves in price using breakout or moving-average signals, cutting losers quickly and letting winners run.',
  'Trend / Breakout':
    'Enters new positions when price breaks through a key structural level — support/resistance, channel boundary or ATR band — expecting momentum continuation.',
  'Trend / Regression':
    'Uses statistical regression channels to define trend direction; trades pullbacks within the channel in the direction of the dominant slope.',
  'Adaptive Trend':
    'Dynamically adjusts trend-detection sensitivity — lookback windows, ATR multipliers or signal filters — based on current market regime or volatility.',
  'Systematic Trend / CTA':
    'Replicates a diversified CTA-style portfolio: long/short across futures markets using rule-based trend signals, sized by inverse volatility.',
  'Trend-Following / Carry-Trend':
    'Blends trend momentum with carry (interest-rate differential or roll yield), entering only when both signals agree to improve signal quality.',
  'Trend-Following / Multi-Timeframe':
    'Aligns signals from multiple timeframes — a higher-frame trend filter with a lower-frame entry trigger — to reduce noise and improve entry precision.',
  'Breakout':
    'Buys or sells when price escapes a well-defined consolidation zone, expecting the breakout to initiate a new directional leg.',
  'Carry / Dollar-Hedged':
    'Earns the interest-rate differential between two currencies or assets while hedging out the USD directional exposure via an offsetting position.',
  'Carry / Macro-Filtered':
    'Applies a macro or risk-regime filter (e.g., VIX, credit spreads) to a carry strategy, stepping out during risk-off environments to avoid carry unwinds.',
  'Carry / Systematic Macro':
    'Combines carry with a broad set of systematic macro signals — growth, inflation, monetary policy — to tilt exposure in and out of high-carry positions.',
  'Cross-Asset / Rates-Driven Trend':
    'Follows trend signals in fixed income and uses rate dynamics as the primary driver to take positions across correlated equity or FX markets.',
  'Cross-Sectional / Factor Rotation':
    'Ranks a universe of instruments on multiple factors (momentum, value, quality) and rotates into top-ranked assets while shorting bottom-ranked ones.',
  'Macro / Rates-Driven':
    'Takes directional macro positions — typically in currencies, rates or equity indices — driven by central bank policy signals and yield curve dynamics.',
  'Macro / Risk-Regime':
    'Classifies the macro environment as risk-on or risk-off using a composite of indicators and adjusts portfolio direction accordingly.',
  'Seasonality':
    'Exploits recurrent calendar patterns — intraday, day-of-week, or month-of-year effects — that have historically shown statistical regularity.',
  'Statistical Arbitrage':
    'Identifies pairs or baskets of instruments with a stable long-run relationship and trades deviations from that relationship, expecting mean reversion.',
  'Systematic Macro / Trend-Following':
    'Overlays a discretionary macro view (interest rates, geopolitics, central bank policy) onto a systematic trend framework to filter or size entries.',
  'Tactical Allocation':
    'Dynamically shifts exposure between asset classes based on short-to-medium term signals — risk parity, momentum, or regime — rather than a static allocation.',
};

export type SourceInfo = {
  label: string;
  description: string;
};

export const SOURCE_INFO: Record<string, SourceInfo> = {
  indian_backtest: {
    label: 'NSE India — Historical Backtest',
    description:
      'Data sourced from the National Stock Exchange of India (NSE). End-of-day and intraday OHLCV bars covering NIFTY 50 and BANKNIFTY futures. Backtest spans multiple years of live exchange data with continuous contract adjustments.',
  },
  dukascopy: {
    label: 'Dukascopy — Tick & Bar Data',
    description:
      'Data provided by Dukascopy Bank SA, a Swiss forex & CFD broker. Tick-level and aggregated OHLCV bars for major and minor FX pairs with high historical depth (typically 10+ years). Widely used for institutional-grade forex strategy research.',
  },
  futures_backtest: {
    label: 'CME / US Futures — Historical Backtest',
    description:
      'Data sourced from CME Group exchange-traded futures (e.g., ES, NQ). Continuous back-adjusted contracts with dividend and roll adjustments. Intraday resolution with deep historical coverage suitable for systematic CTA-style research.',
  },
};
