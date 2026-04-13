import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useMarketStore } from '@/stores/market';
import { usePortfolioStore } from '@/stores/portfolio';
import { useTransactionsStore } from '@/stores/transactions';

describe('portfolio store', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it('adds stock to portfolio', () => {
    const marketStore = useMarketStore();
    const portfolioStore = usePortfolioStore();
    useTransactionsStore();

    marketStore.quotes.AAPL = { symbol: 'AAPL', price: 200, change: 5, changePercent: 2.5 };
    portfolioStore.buyStock(marketStore.quotes.AAPL, 2);

    expect(portfolioStore.holdings).toEqual([{ symbol: 'AAPL', shares: 2, averagePrice: 200 }]);
  });

  it('updates cash balance after buy', () => {
    const marketStore = useMarketStore();
    const portfolioStore = usePortfolioStore();
    useTransactionsStore();

    marketStore.quotes.AAPL = { symbol: 'AAPL', price: 125, change: 0, changePercent: 0 };
    portfolioStore.buyStock(marketStore.quotes.AAPL, 4);

    expect(portfolioStore.cash).toBe(9500);
  });

  it('removes shares after sell', () => {
    const marketStore = useMarketStore();
    const portfolioStore = usePortfolioStore();
    useTransactionsStore();

    marketStore.quotes.AAPL = { symbol: 'AAPL', price: 100, change: 0, changePercent: 0 };
    portfolioStore.buyStock(marketStore.quotes.AAPL, 5);
    portfolioStore.sellStock(marketStore.quotes.AAPL, 3);

    expect(portfolioStore.holdings[0]?.shares).toBe(2);
  });

  it('calculates live gain loss from quotes', () => {
    const marketStore = useMarketStore();
    const portfolioStore = usePortfolioStore();
    useTransactionsStore();

    marketStore.quotes.NVDA = { symbol: 'NVDA', price: 100, change: 0, changePercent: 0 };
    portfolioStore.buyStock(marketStore.quotes.NVDA, 10);
    marketStore.quotes.NVDA = { symbol: 'NVDA', price: 120, change: 20, changePercent: 20 };

    expect(portfolioStore.gainLoss).toBe(200);
  });
});
