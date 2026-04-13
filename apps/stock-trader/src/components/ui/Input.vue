<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/utils/cn';

const props = defineProps<{
  modelValue?: string | number;
  class?: string;
  type?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number | string;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | number): void;
}>();

const value = computed(() => props.modelValue ?? '');
</script>

<template>
  <input
    :value="value"
    :type="type ?? 'text'"
    :placeholder="placeholder"
    :min="min"
    :max="max"
    :step="step"
    :class="
      cn(
        'flex h-10 w-full rounded-lg border border-input bg-background/80 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        props.class
      )
    "
    @input="
      emit(
        'update:modelValue',
        props.type === 'number'
          ? Number(($event.target as HTMLInputElement).value)
          : ($event.target as HTMLInputElement).value
      )
    "
  />
</template>
