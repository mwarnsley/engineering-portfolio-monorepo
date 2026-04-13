import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { fetchCandleSeries, fetchQuotes } from '@/api/stocks';
import { loadStorage, saveStorage } from '@/utils/storage';
import type { PricePoint, Stock, Timeframe } from '@/types/stock';

const STORAGE_KEY = 'stock-trader.market';
const DEFAULT_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META'];

type MarketState = {
  selectedSymbol: string;
};

export const useMarketStore = defineStore('market', () => {
  const persisted = loadStorage<MarketState>(STORAGE_KEY, {
    selectedSymbol: DEFAULT_SYMBOLS[0],
  });

  const symbols = ref<string[]>(DEFAULT_SYMBOLS);
  const quotes = ref<Record<string, Stock>>({});
  const selectedSymbol = ref(persisted.selectedSymbol);
  const loading = ref(false);
  const error = ref('');
  const historyLoading = ref(false);
  const historyError = ref('');
  const chartHistory = ref<Record<string, PricePoint[]>>({});

  const quoteList = computed(() => symbols.value.map((symbol) => quotes.value[symbol]).filter(Boolean));

  const persist = (): void => {
    saveStorage(STORAGE_KEY, {
      selectedSymbol: selectedSymbol.value,
    });
  };

  async function fetchQuotesForMarket(): Promise<void> {
    loading.value = true;
    error.value = '';

    try {
      const response = await fetchQuotes(symbols.value);
      quotes.value = response.reduce<Record<string, Stock>>((accumulator, stock) => {
        accumulator[stock.symbol] = stock;
        return accumulator;
      }, {});

      const allUnavailable = response.every((stock) => stock.price === 0);
      if (allUnavailable) {
        error.value = 'Live market data is unavailable. Showing simulated fallback pricing.';
      }
    } catch {
      error.value = 'Unable to refresh live market data. Showing simulated fallback pricing.';
    } finally {
      loading.value = false;
    }
  }

  async function fetchHistory(symbol: string, timeframe: Timeframe): Promise<PricePoint[]> {
    historyLoading.value = true;
    historyError.value = '';

    try {
      const points = await fetchCandleSeries(symbol, timeframe);
      chartHistory.value[`${symbol}-${timeframe}`] = points;

      if (points.length === 0) {
        historyError.value = 'Price history is unavailable for the selected timeframe.';
      }

      return points;
    } catch {
      historyError.value = 'Unable to load chart data.';
      return [];
    } finally {
      historyLoading.value = false;
    }
  }

  function selectSymbol(symbol: string): void {
    selectedSymbol.value = symbol;
    persist();
  }

  function getQuote(symbol: string): Stock | undefined {
    return quotes.value[symbol];
  }

  return {
    symbols,
    quotes,
    selectedSymbol,
    loading,
    error,
    historyLoading,
    historyError,
    chartHistory,
    quoteList,
    fetchQuotes: fetchQuotesForMarket,
    fetchHistory,
    selectSymbol,
    getQuote,
  };
});
