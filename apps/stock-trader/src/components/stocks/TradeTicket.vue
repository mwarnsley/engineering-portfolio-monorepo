<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Badge from '@/components/ui/Badge.vue';
import Button from '@/components/ui/Button.vue';
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import Input from '@/components/ui/Input.vue';
import type { Holding } from '@/types/portfolio';
import type { Stock } from '@/types/stock';
import { formatCurrency } from '@/utils/currency';

const props = defineProps<{
  stock: Stock;
  cash: number;
  holding?: Holding;
}>();

const emit = defineEmits<{
  (event: 'buy', shares: number): void;
  (event: 'sell', shares: number): void;
}>();

const shares = ref(1);
const mode = ref<'buy' | 'sell'>('buy');

const parsedShares = computed(() => Math.max(1, Number(shares.value || 1)));
const estimatedTotal = computed(() => parsedShares.value * props.stock.price);

function updateShares(value: string | number): void {
  shares.value = Math.max(1, Number(value) || 1);
}

watch(
  () => props.holding?.shares,
  (value) => {
    if (!value && mode.value === 'sell') {
      mode.value = 'buy';
    }
  }
);
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between gap-3">
        <CardTitle>Trade Ticket</CardTitle>
        <Badge :variant="mode === 'buy' ? 'success' : 'danger'">
          {{ mode === 'buy' ? 'Buy order' : 'Sell order' }}
        </Badge>
      </div>
    </CardHeader>
    <CardContent class="space-y-5">
      <div class="grid grid-cols-2 gap-2 rounded-xl bg-white/5 p-1">
        <button
          class="rounded-lg px-3 py-2 text-sm font-medium transition"
          :class="mode === 'buy' ? 'bg-emerald-500 text-white' : 'text-muted-foreground'"
          @click="mode = 'buy'"
        >
          Buy
        </button>
        <button
          class="rounded-lg px-3 py-2 text-sm font-medium transition"
          :class="mode === 'sell' ? 'bg-rose-500 text-white' : 'text-muted-foreground'"
          :disabled="!holding"
          @click="mode = 'sell'"
        >
          Sell
        </button>
      </div>

      <div class="space-y-2">
        <label class="text-sm text-muted-foreground">Shares</label>
        <Input
          :model-value="shares"
          type="number"
          :min="1"
          :step="1"
          @update:model-value="updateShares"
        />
      </div>

      <div class="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div class="flex items-center justify-between text-sm">
          <span class="text-muted-foreground">Market price</span>
          <span>{{ formatCurrency(stock.price) }}</span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-muted-foreground">Estimated total</span>
          <span>{{ formatCurrency(estimatedTotal) }}</span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-muted-foreground">Available cash</span>
          <span>{{ formatCurrency(cash) }}</span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-muted-foreground">Owned shares</span>
          <span>{{ holding?.shares ?? 0 }}</span>
        </div>
      </div>

      <Button
        class="w-full"
        :variant="mode === 'buy' ? 'success' : 'danger'"
        @click="mode === 'buy' ? emit('buy', parsedShares) : emit('sell', parsedShares)"
      >
        {{ mode === 'buy' ? 'Execute Buy' : 'Execute Sell' }}
      </Button>
    </CardContent>
  </Card>
</template>
