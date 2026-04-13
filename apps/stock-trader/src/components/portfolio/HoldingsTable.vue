<script setup lang="ts">
import Badge from '@/components/ui/Badge.vue';
import Button from '@/components/ui/Button.vue';
import Table from '@/components/ui/Table.vue';
import type { PositionSummary } from '@/types/portfolio';
import { formatCurrency, formatPercent, formatSignedCurrency } from '@/utils/currency';

defineProps<{
  positions: PositionSummary[];
}>();

defineEmits<{
  (event: 'sell', symbol: string): void;
}>();
</script>

<template>
  <Table>
    <thead class="[&_tr]:border-b [&_tr]:border-white/10">
      <tr>
        <th class="h-12 px-4 text-left font-medium text-muted-foreground">Symbol</th>
        <th class="h-12 px-4 text-left font-medium text-muted-foreground">Shares</th>
        <th class="h-12 px-4 text-left font-medium text-muted-foreground">Avg Price</th>
        <th class="h-12 px-4 text-left font-medium text-muted-foreground">Current</th>
        <th class="h-12 px-4 text-left font-medium text-muted-foreground">Gain/Loss</th>
        <th class="h-12 px-4 text-right font-medium text-muted-foreground">Action</th>
      </tr>
    </thead>
    <tbody class="[&_tr:last-child]:border-0">
      <tr
        v-for="position in positions"
        :key="position.symbol"
        class="border-b border-white/5 transition hover:bg-white/[0.03]"
      >
        <td class="p-4 font-medium">{{ position.symbol }}</td>
        <td class="p-4">{{ position.shares }}</td>
        <td class="p-4">{{ formatCurrency(position.averagePrice) }}</td>
        <td class="p-4">{{ formatCurrency(position.currentPrice) }}</td>
        <td class="p-4">
          <div class="flex flex-col gap-1">
            <Badge :variant="position.gainLoss >= 0 ? 'success' : 'danger'" class="w-fit">
              {{ formatSignedCurrency(position.gainLoss) }}
            </Badge>
            <span class="text-xs text-muted-foreground">
              {{ formatPercent(position.gainLossPercent) }}
            </span>
          </div>
        </td>
        <td class="p-4 text-right">
          <Button variant="outline" size="sm" @click="$emit('sell', position.symbol)">Sell</Button>
        </td>
      </tr>
    </tbody>
  </Table>
</template>
