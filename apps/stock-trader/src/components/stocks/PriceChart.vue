<script setup lang="ts">
import { createChart, type IChartApi, type ISeriesApi, LineSeries } from 'lightweight-charts';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { PricePoint } from '@/types/stock';

const props = defineProps<{
  data: PricePoint[];
}>();

const chartContainer = ref<HTMLDivElement | null>(null);
let chart: IChartApi | null = null;
let series: ISeriesApi<'Line'> | null = null;
let observer: ResizeObserver | null = null;

function buildChart(): void {
  if (!chartContainer.value) {
    return;
  }

  chart?.remove();

  chart = createChart(chartContainer.value, {
    autoSize: true,
    layout: {
      background: { color: 'transparent' },
      textColor: '#cbd5e1',
    },
    grid: {
      vertLines: { color: 'rgba(148, 163, 184, 0.08)' },
      horzLines: { color: 'rgba(148, 163, 184, 0.08)' },
    },
    rightPriceScale: {
      borderColor: 'rgba(148, 163, 184, 0.12)',
    },
    timeScale: {
      borderColor: 'rgba(148, 163, 184, 0.12)',
      timeVisible: true,
    },
    crosshair: {
      vertLine: { color: '#a855f7' },
      horzLine: { color: '#a855f7' },
    },
  });

  series = chart.addSeries(LineSeries, {
    color: '#a855f7',
    lineWidth: 3,
    priceLineColor: '#a855f7',
    lastValueVisible: true,
  });

  series.setData(props.data.map((point) => ({ time: point.time as never, value: point.value })));
  chart.timeScale().fitContent();
}

onMounted(() => {
  buildChart();

  if (chartContainer.value) {
    observer = new ResizeObserver(() => chart?.applyOptions({ width: chartContainer.value?.clientWidth }));
    observer.observe(chartContainer.value);
  }
});

watch(
  () => props.data,
  () => {
    buildChart();
  },
  { deep: true }
);

onBeforeUnmount(() => {
  observer?.disconnect();
  chart?.remove();
});
</script>

<template>
  <div ref="chartContainer" class="h-[320px] w-full" />
</template>
