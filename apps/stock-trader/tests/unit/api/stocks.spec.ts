import { describe, expect, it } from 'vitest';
import { normalizeCandleData, normalizeQuote } from '@/api/stocks';

describe('stocks api normalization', () => {
  it('normalizes quote payloads', () => {
    expect(normalizeQuote('AAPL', { c: 221.1, d: 2.4, dp: 1.1 })).toEqual({
      symbol: 'AAPL',
      price: 221.1,
      change: 2.4,
      changePercent: 1.1,
    });
  });

  it('returns an empty normalized series for failed candle responses', () => {
    expect(normalizeCandleData({ s: 'no_data' })).toEqual([]);
  });

  it('maps candle payloads into lightweight chart points', () => {
    expect(normalizeCandleData({ s: 'ok', c: [100, 102], t: [1, 2] })).toEqual([
      { time: 1, value: 100 },
      { time: 2, value: 102 },
    ]);
  });
});
