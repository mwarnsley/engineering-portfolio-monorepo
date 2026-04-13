import { ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { loadStorage, saveStorage } from '@/utils/storage';

const STORAGE_KEY = 'stock-trader.preferences';

type PreferencesState = {
  watchlist: string[];
};

export const usePreferencesStore = defineStore('preferences', () => {
  const persisted = loadStorage<PreferencesState>(STORAGE_KEY, {
    watchlist: ['AAPL', 'NVDA', 'MSFT'],
  });

  const watchlist = ref<string[]>(persisted.watchlist);

  watch(
    watchlist,
    () => {
      saveStorage(STORAGE_KEY, {
        watchlist: watchlist.value,
      });
    },
    { deep: true }
  );

  function toggleWatchlist(symbol: string): void {
    if (watchlist.value.includes(symbol)) {
      watchlist.value = watchlist.value.filter((entry) => entry !== symbol);
      return;
    }

    watchlist.value = [...watchlist.value, symbol];
  }

  return {
    watchlist,
    toggleWatchlist,
  };
});
