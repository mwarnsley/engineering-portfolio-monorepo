<script setup lang="ts">
import Badge from '@/components/ui/Badge.vue';
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import type { Transaction } from '@/types/transaction';
import { formatCurrency } from '@/utils/currency';

defineProps<{
  transactions: Transaction[];
}>();
</script>

<template>
  <div class="space-y-3">
    <Card v-for="transaction in transactions" :key="transaction.id">
      <CardContent class="flex flex-col gap-3 pt-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div class="flex items-center gap-3">
            <p class="font-semibold text-white">{{ transaction.symbol }}</p>
            <Badge :variant="transaction.type === 'buy' ? 'success' : 'danger'">
              {{ transaction.type.toUpperCase() }}
            </Badge>
          </div>
          <p class="mt-2 text-sm text-muted-foreground">
            {{ transaction.shares }} shares at {{ formatCurrency(transaction.price) }}
          </p>
        </div>

        <div class="text-left md:text-right">
          <p class="font-semibold">{{ formatCurrency(transaction.total) }}</p>
          <p class="mt-2 text-sm text-muted-foreground">
            {{ new Date(transaction.timestamp).toLocaleString() }}
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
