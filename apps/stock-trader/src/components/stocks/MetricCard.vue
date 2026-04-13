<script setup lang="ts">
import Badge from '@/components/ui/Badge.vue';
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';

defineProps<{
  title: string;
  value: string;
  detail: string;
  trend?: 'positive' | 'negative' | 'neutral';
}>();
</script>

<template>
  <Card class="overflow-hidden">
    <CardHeader class="flex-row items-start justify-between space-y-0">
      <div>
        <p class="text-sm text-muted-foreground">{{ title }}</p>
        <CardTitle class="mt-2 text-3xl">{{ value }}</CardTitle>
      </div>
      <Badge :variant="trend === 'negative' ? 'danger' : trend === 'positive' ? 'success' : 'outline'">
        {{ trend === 'negative' ? 'Down' : trend === 'positive' ? 'Up' : 'Stable' }}
      </Badge>
    </CardHeader>
    <CardContent>
      <p class="text-sm text-muted-foreground">{{ detail }}</p>
    </CardContent>
  </Card>
</template>
