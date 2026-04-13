import axios from 'axios';
import { loadStorage, saveStorage } from '@/utils/storage';
import type { CandleResponse, PricePoint, QuoteResponse, Stock, Timeframe } from '@/types/stock';

const api = axios.create({
  baseURL: 'https://finnhub.io/api/v1',
  timeout: 10000,
});

const QUOTE_CACHE_KEY = 'stock-trader.quote-cache';
const CANDLE_CACHE_KEY = 'stock-trader.candle-cache';

type QuoteCache = Record<string, Stock>;
type CandleCache = Record<string, PricePoint[]>;

const timeframeConfig: Record<Timeframe, { resolution: string; seconds: number }> = {
  '1D': { resolution: '15', seconds: 60 * 60 * 24 },
  '1W': { resolution: '60', seconds: 60 * 60 * 24 * 7 },
  '1M': { resolution: 'D', seconds: 60 * 60 * 24 * 30 },
  '1Y': { resolution: 'W', seconds: 60 * 60 * 24 * 365 },
};

function getSymbolHash(symbol: string): number {
  return Array.from(symbol).reduce((total, char, index) => total + char.charCodeAt(0) * (index + 11), 0);
}

function getSyntheticBasePrice(symbol: string): number {
  const hash = getSymbolHash(symbol);
  return 90 + (hash % 340);
}

function roundPrice(value: number): number {
  return Math.round(value * 100) / 100;
}

function getSyntheticQuote(symbol: string): Stock {
  const now = new Date();
  const hash = getSymbolHash(symbol);
  const basePrice = getSyntheticBasePrice(symbol);
  const dayFactor = (now.getUTCDate() + now.getUTCMonth() * 3 + now.getUTCFullYear()) % 17;
  const drift = ((hash % 7) - 3) * 0.45 + dayFactor * 0.18;
  const price = roundPrice(basePrice + drift);
  const previousClose = Math.max(basePrice - drift * 0.55, 1);
  const change = roundPrice(price - previousClose);
  const changePercent = roundPrice((change / previousClose) * 100);

  return {
    symbol,
    price,
    change,
    changePercent,
  };
}

function getSyntheticCandles(symbol: string, timeframe: Timeframe): PricePoint[] {
  const config = timeframeConfig[timeframe];
  const pointsByTimeframe: Record<Timeframe, number> = {
    '1D': 24,
    '1W': 28,
    '1M': 30,
    '1Y': 52,
  };
  const pointCount = pointsByTimeframe[timeframe];
  const now = Math.floor(Date.now() / 1000);
  const step = Math.max(Math.floor(config.seconds / pointCount), 1);
  const base = getSyntheticBasePrice(symbol);
  const hash = getSymbolHash(symbol);

  return Array.from({ length: pointCount }, (_, index) => {
    const progress = index / Math.max(pointCount - 1, 1);
    const wave = Math.sin(progress * Math.PI * 3 + hash / 19) * (base * 0.02);
    const micro = Math.cos(progress * Math.PI * 9 + hash / 29) * (base * 0.0075);
    const trend = (progress - 0.5) * ((hash % 13) - 6) * 0.9;
    const value = roundPrice(Math.max(base + wave + micro + trend, 1));

    return {
      time: now - step * (pointCount - index),
      value,
    };
  });
}

function getToken(): string {
  return import.meta.env.VITE_FINNHUB_API_KEY ?? '';
}

export function normalizeQuote(symbol: string, payload: QuoteResponse): Stock {
  return {
    symbol,
    price: Number(payload.c ?? 0),
    change: Number(payload.d ?? 0),
    changePercent: Number(payload.dp ?? 0),
  };
}

export function normalizeCandleData(payload: CandleResponse): PricePoint[] {
  if (payload.s !== 'ok' || !payload.c || !payload.t) {
    return [];
  }

  return payload.c.map((value, index) => ({
    time: payload.t?.[index] ?? 0,
    value: Number(value),
  }));
}

function getFallbackQuote(symbol: string): Stock {
  const cache = loadStorage<QuoteCache>(QUOTE_CACHE_KEY, {});
  return cache[symbol] ?? getSyntheticQuote(symbol);
}

function getFallbackCandles(symbol: string, timeframe: Timeframe): PricePoint[] {
  const cache = loadStorage<CandleCache>(CANDLE_CACHE_KEY, {});
  return cache[`${symbol}-${timeframe}`] ?? getSyntheticCandles(symbol, timeframe);
}

export async function fetchQuote(symbol: string): Promise<Stock> {
  const token = getToken();

  if (!token || token === 'YOUR_API_KEY') {
    return getFallbackQuote(symbol);
  }

  try {
    const response = await api.get<QuoteResponse>('/quote', {
      params: {
        symbol,
        token,
      },
    });
    const normalized = normalizeQuote(symbol, response.data);
    if (normalized.price <= 0) {
      return getFallbackQuote(symbol);
    }
    const cache = loadStorage<QuoteCache>(QUOTE_CACHE_KEY, {});
    saveStorage(QUOTE_CACHE_KEY, { ...cache, [symbol]: normalized });
    return normalized;
  } catch {
    return getFallbackQuote(symbol);
  }
}

export async function fetchQuotes(symbols: string[]): Promise<Stock[]> {
  return Promise.all(symbols.map((symbol) => fetchQuote(symbol)));
}

export async function fetchCandleSeries(symbol: string, timeframe: Timeframe): Promise<PricePoint[]> {
  const token = getToken();

  if (!token || token === 'YOUR_API_KEY') {
    return getFallbackCandles(symbol, timeframe);
  }

  const config = timeframeConfig[timeframe];
  const to = Math.floor(Date.now() / 1000);
  const from = to - config.seconds;

  try {
    const response = await api.get<CandleResponse>('/stock/candle', {
      params: {
        symbol,
        resolution: config.resolution,
        from,
        to,
        token,
      },
    });
    const normalized = normalizeCandleData(response.data);
    if (normalized.length === 0) {
      return getFallbackCandles(symbol, timeframe);
    }
    const cache = loadStorage<CandleCache>(CANDLE_CACHE_KEY, {});
    saveStorage(CANDLE_CACHE_KEY, { ...cache, [`${symbol}-${timeframe}`]: normalized });
    return normalized;
  } catch {
    return getFallbackCandles(symbol, timeframe);
  }
}
