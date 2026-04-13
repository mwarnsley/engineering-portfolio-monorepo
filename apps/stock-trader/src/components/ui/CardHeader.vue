<script setup lang="ts">
import { cn } from '@/utils/cn';

defineProps<{
  class?: string;
}>();
</script>

<template>
  <div :class="cn('flex flex-col gap-2 p-6', $props.class)">
    <slot />
  </div>
</template>
