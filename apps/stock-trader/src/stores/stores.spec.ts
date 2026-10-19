import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';
import { fetchQuotes, fetchCandleSeries } from '@/api/stocks';
import { useMarketStore } from './market';
import { usePortfolioStore } from './portfolio';
import { usePreferencesStore } from './preferences';
import { useTransactionsStore } from './transactions';
vi.mock('@/api/stocks', () => ({ fetchQuotes: vi.fn(), fetchCandleSeries: vi.fn() }));
const stock = { symbol: 'AAPL', price: 100, change: 2, changePercent: 2 };
beforeEach(() => {
  localStorage.clear();
  setActivePinia(createPinia());
  vi.clearAllMocks();
});

describe('market lifecycle', () => {
  it('tracks loading and publishes normalized quotes', async () => {
    let resolve!: (value: (typeof stock)[]) => void;
    vi.mocked(fetchQuotes).mockReturnValue(
      new Promise((done) => {
        resolve = done;
      })
    );
    const store = useMarketStore();
    const pending = store.fetchQuotes();
    expect(store.loading).toBe(true);
    resolve([stock]);
    await pending;
    expect(store.quoteList).toEqual([stock]);
    expect(store.loading).toBe(false);
  });
  it.each(['empty', 'failure'])('reports %s quote errors and resets loading', async (mode) => {
    if (mode === 'empty') vi.mocked(fetchQuotes).mockResolvedValue([{ ...stock, price: 0 }]);
    else vi.mocked(fetchQuotes).mockRejectedValue(new Error('network'));
    const store = useMarketStore();
    await store.fetchQuotes();
    expect(store.error).toContain('simulated fallback pricing');
    expect(store.loading).toBe(false);
  });
  it('stores selected symbols across store lifetimes', () => {
    const store = useMarketStore();
    store.selectSymbol('MSFT');
    setActivePinia(createPinia());
    expect(useMarketStore().selectedSymbol).toBe('MSFT');
    expect(store.getQuote('UNKNOWN')).toBeUndefined();
  });
  it('caches history and clears an old error after recovery', async () => {
    const store = useMarketStore();
    store.historyError = 'old error';
    const points = [{ time: 1, value: 100 }];
    vi.mocked(fetchCandleSeries).mockResolvedValue(points);
    const pending = store.fetchHistory('AAPL', '1D');
    expect(store.historyLoading).toBe(true);
    await pending;
    expect(store.chartHistory['AAPL-1D']).toEqual(points);
    expect([store.historyLoading, store.historyError]).toEqual([false, '']);
  });
  it.each(['empty', 'failure'])('reports %s history', async (mode) => {
    if (mode === 'empty') vi.mocked(fetchCandleSeries).mockResolvedValue([]);
    else vi.mocked(fetchCandleSeries).mockRejectedValue(new Error('network'));
    const store = useMarketStore();
    expect(await store.fetchHistory('AAPL', '1D')).toEqual([]);
    expect(store.historyError).toBe(
      mode === 'empty'
        ? 'Price history is unavailable for the selected timeframe.'
        : 'Unable to load chart data.'
    );
    expect(store.historyLoading).toBe(false);
  });
});

describe('portfolio accounting and validation', () => {
  it.each([
    [0, 100, 'Enter at least 1 share.'],
    [1, 0, 'Live pricing is unavailable for this stock.'],
    [101, 100, 'Not enough cash to complete this order.'],
  ])('rejects buy of %s shares at %s', (shares, price, message) => {
    const store = usePortfolioStore();
    expect(store.buyStock({ ...stock, price: Number(price) }, Number(shares))).toEqual({
      ok: false,
      message,
    });
    expect(store.cash).toBe(10000);
    expect(useTransactionsStore().items).toEqual([]);
  });
  it('averages additional purchases, rounds shares, and persists balances', () => {
    const store = usePortfolioStore();
    store.buyStock(stock, 2.9);
    store.buyStock({ ...stock, price: 200 }, 2);
    expect(store.getHolding('AAPL')).toEqual({ symbol: 'AAPL', shares: 4, averagePrice: 150 });
    expect(store.cash).toBe(9400);
    expect(JSON.parse(localStorage.getItem('stock-trader.portfolio')!)).toEqual({
      cash: 9400,
      holdings: store.holdings,
    });
  });
  it('values unquoted holdings at cost and zero-cost holdings without division errors', () => {
    const store = usePortfolioStore();
    store.holdings = [
      { symbol: 'AAPL', shares: 2, averagePrice: 100 },
      { symbol: 'FREE', shares: 1, averagePrice: 0 },
    ];
    expect(store.positions.map((position) => position.gainLossPercent)).toEqual([0, 0]);
    expect([store.investedValue, store.totalCostBasis, store.totalValue, store.gainLoss]).toEqual([
      200, 200, 10200, 0,
    ]);
  });
  it.each([
    ['UNKNOWN', 1, 'You do not own this stock yet.'],
    ['AAPL', 0, 'Enter at least 1 share.'],
    ['AAPL', 3, 'You cannot sell more shares than you own.'],
  ])('rejects invalid sell %s %s', (symbol, shares, message) => {
    const store = usePortfolioStore();
    store.buyStock(stock, 2);
    expect(store.sellStock({ ...stock, symbol: String(symbol) }, Number(shares))).toEqual({
      ok: false,
      message,
    });
    expect(store.holdings[0].shares).toBe(2);
  });
  it('sells an entire position while retaining unrelated holdings', () => {
    const store = usePortfolioStore();
    store.buyStock(stock, 2);
    store.buyStock({ ...stock, symbol: 'MSFT' }, 1);
    expect(store.sellStock({ ...stock, price: 150 }, 2.9)).toEqual({
      ok: true,
      message: 'Sold 2 shares of AAPL.',
    });
    expect(store.holdings.map((holding) => holding.symbol)).toEqual(['MSFT']);
    expect(store.cash).toBe(10000);
  });
});

describe('preferences and transaction filters', () => {
  it('toggles watchlist membership and persists both changes', async () => {
    const store = usePreferencesStore();
    store.toggleWatchlist('AAPL');
    await nextTick();
    expect(store.watchlist).toEqual(['NVDA', 'MSFT']);
    store.toggleWatchlist('TSLA');
    await nextTick();
    expect(JSON.parse(localStorage.getItem('stock-trader.preferences')!).watchlist).toEqual([
      'NVDA',
      'MSFT',
      'TSLA',
    ]);
  });
  it('records newest-first fills with totals and persists generated identities', () => {
    const store = useTransactionsStore();
    store.addTransaction({ symbol: 'AAPL', type: 'buy', shares: 2, price: 100 });
    store.addTransaction({ symbol: 'MSFT', type: 'sell', shares: 1, price: 200 });
    expect(store.items.map(({ symbol, total }) => ({ symbol, total }))).toEqual([
      { symbol: 'MSFT', total: 200 },
      { symbol: 'AAPL', total: 200 },
    ]);
    expect(new Set(store.items.map((item) => item.id)).size).toBe(2);
    expect(JSON.parse(localStorage.getItem('stock-trader.transactions')!)).toEqual(store.items);
  });
  it('combines type and case-insensitive symbol filters', () => {
    const store = useTransactionsStore();
    store.addTransaction({ symbol: 'AAPL', type: 'buy', shares: 1, price: 100 });
    store.addTransaction({ symbol: 'MSFT', type: 'sell', shares: 1, price: 200 });
    expect(store.filteredTransactions).toHaveLength(2);
    store.setFilterType('sell');
    expect(store.filteredTransactions.map((item) => item.symbol)).toEqual(['MSFT']);
    store.setFilterType('all');
    store.setFilterSymbol('aa');
    expect(store.filteredTransactions.map((item) => item.symbol)).toEqual(['AAPL']);
  });
});
