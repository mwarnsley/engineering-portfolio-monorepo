<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import StockCard from '@/components/stocks/StockCard.vue';
import { useMarketStore } from '@/stores/market';
import { usePortfolioStore } from '@/stores/portfolio';
import { usePreferencesStore } from '@/stores/preferences';

const marketStore = useMarketStore();
const portfolioStore = usePortfolioStore();
const preferencesStore = usePreferencesStore();
const search = ref('');

const filteredStocks = computed(() =>
  marketStore.quoteList.filter((stock) =>
    stock.symbol.toLowerCase().includes(search.value.trim().toLowerCase())
  )
);

async function quickBuy(symbol: string): Promise<void> {
  const stock = marketStore.getQuote(symbol);
  if (stock) {
    portfolioStore.buyStock(stock, 1);
  }
}

onMounted(async () => {
  await marketStore.fetchQuotes();
});
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-[28px] border border-border/70 bg-card/80 p-6 shadow-glow">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.25em] text-violet-300/80">Markets</p>
          <h1 class="mt-2 text-3xl font-semibold tracking-tight">Scan the tape and move with intent.</h1>
        </div>
        <div class="flex w-full gap-3 lg:w-auto">
          <Input v-model="search" class="lg:w-72" placeholder="Search symbol..." />
          <Button variant="outline" @click="marketStore.fetchQuotes()">Refresh</Button>
        </div>
      </div>
    </section>

    <section v-if="marketStore.error" class="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
      {{ marketStore.error }}
    </section>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <StockCard
        v-for="stock in filteredStocks"
        :key="stock.symbol"
        :stock="stock"
        :in-watchlist="preferencesStore.watchlist.includes(stock.symbol)"
        @buy="quickBuy(stock.symbol)"
        @watchlist="preferencesStore.toggleWatchlist"
      />
    </section>
  </div>
</template>
