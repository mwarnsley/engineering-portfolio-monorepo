<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import CardDescription from '@/components/ui/CardDescription.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import MetricCard from '@/components/stocks/MetricCard.vue';
import PriceChart from '@/components/stocks/PriceChart.vue';
import StockCard from '@/components/stocks/StockCard.vue';
import TransactionList from '@/components/portfolio/TransactionList.vue';
import { useMarketStore } from '@/stores/market';
import { usePortfolioStore } from '@/stores/portfolio';
import { usePreferencesStore } from '@/stores/preferences';
import { useTransactionsStore } from '@/stores/transactions';
import type { PricePoint } from '@/types/stock';
import { formatCompactCurrency, formatCurrency, formatSignedCurrency } from '@/utils/currency';

const marketStore = useMarketStore();
const portfolioStore = usePortfolioStore();
const preferencesStore = usePreferencesStore();
const transactionsStore = useTransactionsStore();
const featuredTimeframe = ref<'1D' | '1W' | '1M'>('1W');
const featuredHistory = ref<PricePoint[]>([]);

const featuredStock = computed(
  () => marketStore.getQuote(marketStore.selectedSymbol) ?? { symbol: marketStore.selectedSymbol, price: 0, change: 0, changePercent: 0 }
);
const watchlistQuotes = computed(() =>
  preferencesStore.watchlist
    .map((symbol) => marketStore.getQuote(symbol))
    .filter((stock): stock is NonNullable<typeof stock> => Boolean(stock))
    .slice(0, 3)
);

async function quickBuy(symbol: string): Promise<void> {
  const stock = marketStore.getQuote(symbol);
  if (stock) {
    portfolioStore.buyStock(stock, 1);
  }
}

function setFeaturedTimeframe(timeframe: '1D' | '1W' | '1M'): void {
  featuredTimeframe.value = timeframe;
}

watch(
  () => [marketStore.selectedSymbol, featuredTimeframe.value] as const,
  async ([symbol, timeframe]) => {
    featuredHistory.value = await marketStore.fetchHistory(symbol, timeframe);
  },
  { immediate: true }
);

onMounted(async () => {
  if (marketStore.quoteList.length === 0) {
    await marketStore.fetchQuotes();
  }
});
</script>

<template>
  <div class="space-y-6">
    <section class="grid gap-4 md:grid-cols-3">
      <MetricCard
        title="Cash Balance"
        :value="formatCurrency(portfolioStore.cash)"
        detail="Liquidity available for your next trade."
        trend="neutral"
      />
      <MetricCard
        title="Portfolio Value"
        :value="formatCompactCurrency(portfolioStore.totalValue)"
        detail="Cash plus live market value of your positions."
        :trend="portfolioStore.totalValue >= 10000 ? 'positive' : 'negative'"
      />
      <MetricCard
        title="Open Gain / Loss"
        :value="formatSignedCurrency(portfolioStore.gainLoss)"
        detail="Unrealized performance versus your cost basis."
        :trend="portfolioStore.gainLoss >= 0 ? 'positive' : 'negative'"
      />
    </section>

    <section class="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <Card>
        <CardHeader class="flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>{{ featuredStock.symbol }} Price Action</CardTitle>
            <CardDescription class="mt-2">
              Featured market view with a live Finnhub price series when available.
            </CardDescription>
          </div>
          <div class="flex gap-2">
            <button
              v-for="timeframe in ['1D', '1W', '1M']"
              :key="timeframe"
              class="rounded-lg border px-3 py-2 text-sm transition"
              :class="
                featuredTimeframe === timeframe
                  ? 'border-violet-400/40 bg-violet-500/10 text-violet-200'
                  : 'border-border text-muted-foreground hover:bg-accent/60'
              "
              @click="setFeaturedTimeframe(timeframe as '1D' | '1W' | '1M')"
            >
              {{ timeframe }}
            </button>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex flex-wrap items-center gap-3">
            <p class="text-3xl font-semibold">{{ formatCurrency(featuredStock.price) }}</p>
            <p
              class="text-sm font-medium"
              :class="featuredStock.change >= 0 ? 'text-emerald-300' : 'text-rose-300'"
            >
              {{ formatSignedCurrency(featuredStock.change) }}
            </p>
          </div>
          <PriceChart :data="featuredHistory" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Watchlist Snapshot</CardTitle>
          <CardDescription>Your highest-conviction symbols, ready for a quick decision.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <StockCard
            v-for="stock in watchlistQuotes"
            :key="stock.symbol"
            :stock="stock"
            :in-watchlist="true"
            @buy="quickBuy(stock.symbol)"
            @watchlist="preferencesStore.toggleWatchlist"
          />
        </CardContent>
      </Card>
    </section>

    <section class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest executions across your paper trading journal.</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionList :transactions="transactionsStore.items.slice(0, 5)" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Market Status</CardTitle>
          <CardDescription>Quick glance at app health and live data readiness.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="rounded-2xl border border-border/70 bg-secondary/40 p-4">
            <p class="text-sm text-muted-foreground">Symbols tracked</p>
            <p class="mt-2 text-3xl font-semibold">{{ marketStore.symbols.length }}</p>
          </div>
          <div class="rounded-2xl border border-border/70 bg-secondary/40 p-4">
            <p class="text-sm text-muted-foreground">Data status</p>
            <p class="mt-2 text-sm text-foreground">
              {{ marketStore.error || 'Live quotes are connected and ready.' }}
            </p>
          </div>
          <div class="rounded-2xl border border-border/70 bg-secondary/40 p-4">
            <p class="text-sm text-muted-foreground">Current focus</p>
            <p class="mt-2 text-2xl font-semibold">{{ marketStore.selectedSymbol }}</p>
          </div>
        </CardContent>
      </Card>
    </section>
  </div>
</template>
