<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import AppShell from '@/components/layout/AppShell.vue';
import { useMarketStore } from '@/stores/market';

const marketStore = useMarketStore();

onMounted(async () => {
  document.documentElement.classList.add('dark');
  await marketStore.fetchQuotes();
});
</script>

<template>
  <AppShell>
    <RouterView />
  </AppShell>
</template>
