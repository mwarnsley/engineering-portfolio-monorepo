<script setup lang="ts">
import { computed } from 'vue';
import { PieChart, WalletCards, Activity, BarChart3 } from 'lucide-vue-next';
import { RouterLink, useRoute } from 'vue-router';
import Badge from '@/components/ui/Badge.vue';
import { usePortfolioStore } from '@/stores/portfolio';
import { formatCompactCurrency, formatSignedCurrency } from '@/utils/currency';
import { cn } from '@/utils/cn';

const route = useRoute();
const portfolioStore = usePortfolioStore();

const navigation = [
  { label: 'Dashboard', to: '/', icon: BarChart3 },
  { label: 'Markets', to: '/markets', icon: PieChart },
  { label: 'Portfolio', to: '/portfolio', icon: WalletCards },
  { label: 'Activity', to: '/activity', icon: Activity },
];

const gainVariant = computed(() => (portfolioStore.gainLoss >= 0 ? 'success' : 'danger'));
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <div class="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-4 lg:grid-cols-[260px_1fr] lg:px-6">
      <aside
        class="sticky top-4 hidden h-[calc(100vh-2rem)] rounded-[28px] border border-border/70 bg-card/90 p-5 shadow-glow lg:flex lg:flex-col"
      >
        <div class="mb-8 space-y-3">
          <Badge variant="outline" class="w-fit border-violet-400/30 bg-violet-500/10 text-violet-200">
            Stock Trader Pro
          </Badge>
          <div>
            <h1 class="text-2xl font-semibold tracking-tight">Simulated Trading Desk</h1>
            <p class="mt-2 text-sm text-muted-foreground">
              Follow live market pricing, build conviction, and practice disciplined execution.
            </p>
          </div>
        </div>

        <nav class="space-y-2">
          <RouterLink
            v-for="item in navigation"
            :key="item.to"
            :to="item.to"
            :class="
              cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-accent/50 hover:text-foreground',
                route.path === item.to || route.path.startsWith(`${item.to}/`)
                  ? 'bg-accent text-foreground'
                  : ''
              )
            "
          >
            <component :is="item.icon" class="h-4 w-4" />
            {{ item.label }}
          </RouterLink>
        </nav>

        <div class="mt-auto rounded-2xl border border-border/70 bg-secondary/50 p-4">
          <p class="text-xs uppercase tracking-[0.25em] text-muted-foreground">Net Performance</p>
          <div class="mt-3 text-2xl font-semibold">{{ formatCompactCurrency(portfolioStore.totalValue) }}</div>
          <div class="mt-3 flex items-center justify-between">
            <span class="text-sm text-muted-foreground">Open P/L</span>
            <Badge :variant="gainVariant">{{ formatSignedCurrency(portfolioStore.gainLoss) }}</Badge>
          </div>
        </div>
      </aside>

      <div class="space-y-6">
        <header
          class="sticky top-4 z-20 flex flex-col gap-4 rounded-[28px] border border-border/70 bg-card/90 px-5 py-4 shadow-glow backdrop-blur xl:flex-row xl:items-center xl:justify-between"
        >
          <div>
            <p class="text-xs uppercase tracking-[0.25em] text-violet-300/80">Portfolio Simulation</p>
            <h2 class="mt-1 text-2xl font-semibold">Trade with discipline, not emotion.</h2>
          </div>

          <div class="flex items-center gap-3">
            <Badge :variant="gainVariant">{{ formatSignedCurrency(portfolioStore.gainLoss) }}</Badge>
          </div>
        </header>

        <main class="pb-10">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
