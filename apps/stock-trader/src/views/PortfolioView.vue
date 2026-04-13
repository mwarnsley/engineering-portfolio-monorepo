<script setup lang="ts">
import { useRouter } from 'vue-router';
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import CardDescription from '@/components/ui/CardDescription.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import HoldingsTable from '@/components/portfolio/HoldingsTable.vue';
import MetricCard from '@/components/stocks/MetricCard.vue';
import { usePortfolioStore } from '@/stores/portfolio';
import { formatCompactCurrency, formatCurrency, formatSignedCurrency } from '@/utils/currency';

const router = useRouter();
const portfolioStore = usePortfolioStore();

function goToSell(symbol: string): void {
  router.push(`/markets/${symbol}`);
}
</script>

<template>
  <div class="space-y-6">
    <section class="grid gap-4 md:grid-cols-3">
      <MetricCard
        title="Available Cash"
        :value="formatCurrency(portfolioStore.cash)"
        detail="Dry powder reserved for new opportunities."
        trend="neutral"
      />
      <MetricCard
        title="Invested Value"
        :value="formatCompactCurrency(portfolioStore.investedValue)"
        detail="Current market value of all open positions."
        :trend="portfolioStore.investedValue >= portfolioStore.totalCostBasis ? 'positive' : 'negative'"
      />
      <MetricCard
        title="Portfolio P/L"
        :value="formatSignedCurrency(portfolioStore.gainLoss)"
        detail="Live gain or loss based on current quotes."
        :trend="portfolioStore.gainLoss >= 0 ? 'positive' : 'negative'"
      />
    </section>

    <Card>
      <CardHeader>
        <CardTitle>Holdings</CardTitle>
        <CardDescription>Track sizing, basis, and unrealized performance in one view.</CardDescription>
      </CardHeader>
      <CardContent>
        <HoldingsTable :positions="portfolioStore.positions" @sell="goToSell" />
      </CardContent>
    </Card>
  </div>
</template>
