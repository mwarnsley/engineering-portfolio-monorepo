import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { loadStorage, saveStorage } from '@/utils/storage';
import { useMarketStore } from '@/stores/market';
import { useTransactionsStore } from '@/stores/transactions';
import type { Holding, PositionSummary } from '@/types/portfolio';
import type { Stock } from '@/types/stock';

const STORAGE_KEY = 'stock-trader.portfolio';
const DEFAULT_CASH = 10000;

type PortfolioState = {
  cash: number;
  holdings: Holding[];
};

export const usePortfolioStore = defineStore('portfolio', () => {
  const persisted = loadStorage<PortfolioState>(STORAGE_KEY, {
    cash: DEFAULT_CASH,
    holdings: [],
  });

  const cash = ref(persisted.cash);
  const holdings = ref<Holding[]>(persisted.holdings);

  const marketStore = useMarketStore();
  const transactionsStore = useTransactionsStore();

  const positions = computed<PositionSummary[]>(() => {
    return holdings.value.map((holding) => {
      const currentPrice = marketStore.getQuote(holding.symbol)?.price ?? holding.averagePrice;
      const marketValue = currentPrice * holding.shares;
      const costBasis = holding.averagePrice * holding.shares;
      const gainLoss = marketValue - costBasis;

      return {
        ...holding,
        currentPrice,
        marketValue,
        costBasis,
        gainLoss,
        gainLossPercent: costBasis === 0 ? 0 : (gainLoss / costBasis) * 100,
      };
    });
  });

  const investedValue = computed(() =>
    positions.value.reduce((total, position) => total + position.marketValue, 0)
  );
  const totalCostBasis = computed(() =>
    positions.value.reduce((total, position) => total + position.costBasis, 0)
  );
  const totalValue = computed(() => cash.value + investedValue.value);
  const gainLoss = computed(() => investedValue.value - totalCostBasis.value);

  const persist = (): void => {
    saveStorage(STORAGE_KEY, {
      cash: cash.value,
      holdings: holdings.value,
    });
  };

  function buyStock(stock: Stock, shares: number): { ok: boolean; message: string } {
    const normalizedShares = Math.floor(shares);

    if (normalizedShares <= 0) {
      return { ok: false, message: 'Enter at least 1 share.' };
    }

    if (stock.price <= 0) {
      return { ok: false, message: 'Live pricing is unavailable for this stock.' };
    }

    const totalPurchase = normalizedShares * stock.price;

    if (totalPurchase > cash.value) {
      return { ok: false, message: 'Not enough cash to complete this order.' };
    }

    const existing = holdings.value.find((holding) => holding.symbol === stock.symbol);

    if (existing) {
      const nextShares = existing.shares + normalizedShares;
      existing.averagePrice =
        (existing.averagePrice * existing.shares + totalPurchase) / nextShares;
      existing.shares = nextShares;
    } else {
      holdings.value.push({
        symbol: stock.symbol,
        shares: normalizedShares,
        averagePrice: stock.price,
      });
    }

    cash.value -= totalPurchase;
    transactionsStore.addTransaction({
      symbol: stock.symbol,
      type: 'buy',
      shares: normalizedShares,
      price: stock.price,
    });
    persist();
    return { ok: true, message: `Bought ${normalizedShares} shares of ${stock.symbol}.` };
  }

  function sellStock(stock: Stock, shares: number): { ok: boolean; message: string } {
    const normalizedShares = Math.floor(shares);
    const existing = holdings.value.find((holding) => holding.symbol === stock.symbol);

    if (!existing) {
      return { ok: false, message: 'You do not own this stock yet.' };
    }

    if (normalizedShares <= 0) {
      return { ok: false, message: 'Enter at least 1 share.' };
    }

    if (normalizedShares > existing.shares) {
      return { ok: false, message: 'You cannot sell more shares than you own.' };
    }

    const proceeds = normalizedShares * stock.price;
    existing.shares -= normalizedShares;

    if (existing.shares === 0) {
      holdings.value = holdings.value.filter((holding) => holding.symbol !== stock.symbol);
    }

    cash.value += proceeds;
    transactionsStore.addTransaction({
      symbol: stock.symbol,
      type: 'sell',
      shares: normalizedShares,
      price: stock.price,
    });
    persist();
    return { ok: true, message: `Sold ${normalizedShares} shares of ${stock.symbol}.` };
  }

  function getHolding(symbol: string): Holding | undefined {
    return holdings.value.find((holding) => holding.symbol === symbol);
  }

  return {
    cash,
    holdings,
    positions,
    investedValue,
    totalCostBasis,
    totalValue,
    gainLoss,
    buyStock,
    sellStock,
    getHolding,
  };
});
