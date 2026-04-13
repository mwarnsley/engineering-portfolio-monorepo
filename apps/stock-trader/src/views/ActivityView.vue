<script setup lang="ts">
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import CardDescription from '@/components/ui/CardDescription.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import Input from '@/components/ui/Input.vue';
import TransactionList from '@/components/portfolio/TransactionList.vue';
import { useTransactionsStore } from '@/stores/transactions';

const transactionsStore = useTransactionsStore();

function setTypeFilter(type: 'all' | 'buy' | 'sell'): void {
  transactionsStore.setFilterType(type);
}

function updateSymbolFilter(value: string | number): void {
  transactionsStore.setFilterSymbol(String(value));
}
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>Review every simulated fill and filter your execution history.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex flex-col gap-3 md:flex-row">
          <Input
            :model-value="transactionsStore.filterSymbol"
            class="md:max-w-xs"
            placeholder="Filter by symbol"
            @update:model-value="updateSymbolFilter"
          />
          <div class="flex gap-2">
            <button
              v-for="type in ['all', 'buy', 'sell']"
              :key="type"
              class="rounded-lg border px-3 py-2 text-sm transition"
              :class="
                transactionsStore.filterType === type
                  ? 'border-violet-400/40 bg-violet-500/10 text-violet-200'
                  : 'border-border text-muted-foreground hover:bg-accent/60'
              "
              @click="setTypeFilter(type as 'all' | 'buy' | 'sell')"
            >
              {{ type.toUpperCase() }}
            </button>
          </div>
        </div>

        <TransactionList :transactions="transactionsStore.filteredTransactions" />
      </CardContent>
    </Card>
  </div>
</template>
