<script setup lang="ts">
import { cn } from '@/utils/cn';

defineProps<{
  class?: string;
}>();
</script>

<template>
  <section
    :class="
      cn(
        'rounded-2xl border border-white/10 bg-card/90 shadow-glow backdrop-blur-sm',
        $props.class
      )
    "
  >
    <slot />
  </section>
</template>
