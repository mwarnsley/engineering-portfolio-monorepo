<script setup lang="ts">
import { Star } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import Badge from '@/components/ui/Badge.vue';
import Button from '@/components/ui/Button.vue';
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import type { Stock } from '@/types/stock';
import { formatCurrency, formatPercent, formatSignedCurrency } from '@/utils/currency';

const props = defineProps<{
  stock: Stock;
  inWatchlist: boolean;
}>();

defineEmits<{
  (event: 'buy', stock: Stock): void;
  (event: 'watchlist', symbol: string): void;
}>();
</script>

<template>
  <Card class="group transition-transform duration-300 hover:-translate-y-1">
    <CardContent class="pt-6">
      <div class="flex items-start justify-between gap-4">
        <div>
          <RouterLink
            :to="`/markets/${props.stock.symbol}`"
            class="text-xl font-semibold tracking-tight text-foreground transition group-hover:text-violet-300"
          >
            {{ props.stock.symbol }}
          </RouterLink>
          <p class="mt-1 text-2xl font-semibold">{{ formatCurrency(props.stock.price) }}</p>
        </div>

        <button
          class="rounded-full border border-border/70 p-2 text-muted-foreground transition hover:border-violet-400/40 hover:text-violet-200"
          @click="$emit('watchlist', props.stock.symbol)"
        >
          <Star :class="['h-4 w-4', props.inWatchlist ? 'fill-current text-violet-300' : '']" />
        </button>
      </div>

      <div class="mt-5 flex items-center justify-between">
        <div class="space-y-2">
          <Badge :variant="props.stock.change >= 0 ? 'success' : 'danger'">
            {{ formatSignedCurrency(props.stock.change) }}
          </Badge>
          <p class="text-sm text-muted-foreground">{{ formatPercent(props.stock.changePercent) }}</p>
        </div>

        <Button
          :variant="props.stock.price > 0 ? 'success' : 'outline'"
          size="sm"
          @click="$emit('buy', props.stock)"
        >
          Buy 1 share
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
