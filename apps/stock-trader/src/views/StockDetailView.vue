<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Badge from '@/components/ui/Badge.vue';
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import CardDescription from '@/components/ui/CardDescription.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import PriceChart from '@/components/stocks/PriceChart.vue';
import TradeTicket from '@/components/stocks/TradeTicket.vue';
import { useMarketStore } from '@/stores/market';
import { usePortfolioStore } from '@/stores/portfolio';
import type { PricePoint, Timeframe } from '@/types/stock';
import { formatCurrency, formatPercent, formatSignedCurrency } from '@/utils/currency';

const route = useRoute();
const marketStore = useMarketStore();
const portfolioStore = usePortfolioStore();
const timeframe = ref<Timeframe>('1W');
const chartData = ref<PricePoint[]>([]);
const feedback = ref('');

const symbol = computed(() => String(route.params.symbol ?? marketStore.selectedSymbol));
const stock = computed(
  () => marketStore.getQuote(symbol.value) ?? { symbol: symbol.value, price: 0, change: 0, changePercent: 0 }
);
const holding = computed(() => portfolioStore.getHolding(symbol.value));

async function refreshChart(): Promise<void> {
  chartData.value = await marketStore.fetchHistory(symbol.value, timeframe.value);
}

function handleBuy(shares: number): void {
  feedback.value = portfolioStore.buyStock(stock.value, shares).message;
}

function handleSell(shares: number): void {
  feedback.value = portfolioStore.sellStock(stock.value, shares).message;
}

watch(
  () => symbol.value,
  async (value) => {
    marketStore.selectSymbol(value);
    await marketStore.fetchQuotes();
    await refreshChart();
  },
  { immediate: true }
);

watch(
  () => timeframe.value,
  async () => {
    await refreshChart();
  }
);

onMounted(async () => {
  await marketStore.fetchQuotes();
});
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-[28px] border border-border/70 bg-card/80 p-6 shadow-glow">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.25em] text-violet-300/80">Stock Detail</p>
          <h1 class="mt-2 text-4xl font-semibold tracking-tight">{{ stock.symbol }}</h1>
          <div class="mt-4 flex flex-wrap items-center gap-3">
            <p class="text-3xl font-semibold">{{ formatCurrency(stock.price) }}</p>
            <Badge :variant="stock.change >= 0 ? 'success' : 'danger'">
              {{ formatSignedCurrency(stock.change) }}
            </Badge>
            <span class="text-sm text-muted-foreground">{{ formatPercent(stock.changePercent) }}</span>
          </div>
        </div>

        <div class="flex gap-2">
          <button
            v-for="option in ['1D', '1W', '1M', '1Y']"
            :key="option"
            class="rounded-lg border px-3 py-2 text-sm transition"
            :class="
              timeframe === option
                ? 'border-violet-400/40 bg-violet-500/10 text-violet-200'
                : 'border-border text-muted-foreground hover:bg-accent/60'
            "
            @click="timeframe = option as Timeframe"
          >
            {{ option }}
          </button>
        </div>
      </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>Price History</CardTitle>
          <CardDescription>Lightweight Charts integration with responsive scaling.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <PriceChart :data="chartData" />
          <p v-if="marketStore.historyError" class="text-sm text-amber-200">
            {{ marketStore.historyError }}
          </p>
        </CardContent>
      </Card>

      <TradeTicket
        :stock="stock"
        :cash="portfolioStore.cash"
        :holding="holding"
        @buy="handleBuy"
        @sell="handleSell"
      />
    </section>

    <section class="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Position</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-3xl font-semibold">{{ holding?.shares ?? 0 }}</p>
          <p class="mt-2 text-sm text-muted-foreground">Shares currently held.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Average Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-3xl font-semibold">{{ formatCurrency(holding?.averagePrice ?? 0) }}</p>
          <p class="mt-2 text-sm text-muted-foreground">Average filled price across buys.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Execution Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            {{ feedback || 'Place an order to simulate an execution.' }}
          </p>
        </CardContent>
      </Card>
    </section>
  </div>
</template>
