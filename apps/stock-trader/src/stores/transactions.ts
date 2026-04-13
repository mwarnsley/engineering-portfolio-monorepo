import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { loadStorage, saveStorage } from '@/utils/storage';
import type { Transaction, TransactionType } from '@/types/transaction';

const STORAGE_KEY = 'stock-trader.transactions';

export const useTransactionsStore = defineStore('transactions', () => {
  const items = ref<Transaction[]>(loadStorage<Transaction[]>(STORAGE_KEY, []));
  const filterType = ref<'all' | TransactionType>('all');
  const filterSymbol = ref('');

  const persist = (): void => {
    saveStorage(STORAGE_KEY, items.value);
  };

  const filteredTransactions = computed(() => {
    return items.value.filter((transaction) => {
      const typeMatch = filterType.value === 'all' || transaction.type === filterType.value;
      const symbolMatch =
        filterSymbol.value.length === 0 ||
        transaction.symbol.toLowerCase().includes(filterSymbol.value.toLowerCase());
      return typeMatch && symbolMatch;
    });
  });

  function addTransaction(transaction: Omit<Transaction, 'id' | 'timestamp' | 'total'>): void {
    items.value.unshift({
      ...transaction,
      id: crypto.randomUUID(),
      total: transaction.price * transaction.shares,
      timestamp: new Date().toISOString(),
    });
    persist();
  }

  function setFilterType(next: 'all' | TransactionType): void {
    filterType.value = next;
  }

  function setFilterSymbol(symbol: string): void {
    filterSymbol.value = symbol;
  }

  return {
    items,
    filterType,
    filterSymbol,
    filteredTransactions,
    addTransaction,
    setFilterType,
    setFilterSymbol,
  };
});
