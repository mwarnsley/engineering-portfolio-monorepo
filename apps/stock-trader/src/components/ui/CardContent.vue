<script setup lang="ts">
import { cn } from '@/utils/cn';

defineProps<{
  class?: string;
}>();
</script>

<template>
  <div :class="cn('px-6 pb-6', $props.class)">
    <slot />
  </div>
</template>
