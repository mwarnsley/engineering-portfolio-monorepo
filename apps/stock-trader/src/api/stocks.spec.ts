import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchCandleSeries,
  fetchQuote,
  fetchQuotes,
  normalizeCandleData,
  normalizeQuote,
} from './stocks';

const { get } = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock('axios', () => ({ default: { create: () => ({ get }) } }));

beforeEach(() => {
  localStorage.clear();
  get.mockReset();
  vi.stubEnv('VITE_FINNHUB_API_KEY', 'test-token');
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-19T12:00:00Z'));
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

describe('market data requests and fallbacks', () => {
  it('defaults missing quote fields and malformed candles safely', () => {
    expect(normalizeQuote('AAPL', {})).toEqual({
      symbol: 'AAPL',
      price: 0,
      change: 0,
      changePercent: 0,
    });
    expect(normalizeCandleData({ s: 'ok', c: [10], t: [] })).toEqual([{ time: 0, value: 10 }]);
  });
  it.each([{ s: 'ok' }, { s: 'ok', c: [10] }, { s: 'no_data' }])(
    'rejects incomplete candles %j',
    (data) => {
      expect(normalizeCandleData(data)).toEqual([]);
    }
  );
  it.each(['', 'YOUR_API_KEY', undefined])(
    'provides reproducible offline quotes for token %s',
    async (token) => {
      vi.stubEnv('VITE_FINNHUB_API_KEY', token);
      const quotes = await fetchQuotes(['AAPL', 'MSFT']);
      expect(quotes.map((quote) => quote.symbol)).toEqual(['AAPL', 'MSFT']);
      expect(quotes.every((quote) => quote.price > 0 && Number.isFinite(quote.changePercent))).toBe(
        true
      );
      expect(get).not.toHaveBeenCalled();
    }
  );
  it('requests quotes with credentials and preserves other cached symbols', async () => {
    localStorage.setItem('stock-trader.quote-cache', JSON.stringify({ MSFT: { price: 300 } }));
    get.mockResolvedValue({ data: { c: 100, d: 2, dp: 2 } });
    expect(await fetchQuote('AAPL')).toEqual({
      symbol: 'AAPL',
      price: 100,
      change: 2,
      changePercent: 2,
    });
    expect(get).toHaveBeenCalledWith('/quote', { params: { symbol: 'AAPL', token: 'test-token' } });
    expect(JSON.parse(localStorage.getItem('stock-trader.quote-cache')!)).toMatchObject({
      MSFT: { price: 300 },
      AAPL: { price: 100 },
    });
  });
  it.each(['error', 'invalid'])('uses cached quotes after %s response', async (mode) => {
    const cached = { symbol: 'AAPL', price: 150, change: 1, changePercent: 1 };
    localStorage.setItem('stock-trader.quote-cache', JSON.stringify({ AAPL: cached }));
    if (mode === 'error') get.mockRejectedValue(new Error('offline'));
    else get.mockResolvedValue({ data: { c: 0 } });
    expect(await fetchQuote('AAPL')).toEqual(cached);
  });
  it.each([
    ['1D', '15', 86400],
    ['1W', '60', 604800],
    ['1M', 'D', 2592000],
    ['1Y', 'W', 31536000],
  ] as const)('requests and caches %s candles', async (timeframe, resolution, seconds) => {
    get.mockResolvedValue({ data: { s: 'ok', c: [100, 110], t: [1, 2] } });
    const points = await fetchCandleSeries('AAPL', timeframe);
    const to = Math.floor(Date.now() / 1000);
    expect(get).toHaveBeenCalledWith('/stock/candle', {
      params: { symbol: 'AAPL', resolution, from: to - seconds, to, token: 'test-token' },
    });
    expect(points).toEqual([
      { time: 1, value: 100 },
      { time: 2, value: 110 },
    ]);
    expect(
      JSON.parse(localStorage.getItem('stock-trader.candle-cache')!)[`AAPL-${timeframe}`]
    ).toEqual(points);
  });
  it.each([
    ['1D', 24],
    ['1W', 28],
    ['1M', 30],
    ['1Y', 52],
  ] as const)('generates ordered positive fallback %s candles', async (timeframe, count) => {
    vi.stubEnv('VITE_FINNHUB_API_KEY', '');
    const points = await fetchCandleSeries('AAPL', timeframe);
    expect(points).toHaveLength(count);
    expect(
      points.every(
        (point, index) => point.value > 0 && (index === 0 || point.time > points[index - 1].time)
      )
    ).toBe(true);
    expect(get).not.toHaveBeenCalled();
  });
  it.each(['error', 'invalid', 'placeholder'])('uses cached history for %s', async (mode) => {
    const points = [{ time: 1, value: 123 }];
    localStorage.setItem('stock-trader.candle-cache', JSON.stringify({ 'AAPL-1W': points }));
    if (mode === 'error') get.mockRejectedValue(new Error('offline'));
    else if (mode === 'invalid') get.mockResolvedValue({ data: { s: 'no_data' } });
    else vi.stubEnv('VITE_FINNHUB_API_KEY', 'YOUR_API_KEY');
    expect(await fetchCandleSeries('AAPL', '1W')).toEqual(points);
  });
});
