<template>
  <section class="empty-state">
    <p class="empty-state__eyebrow">{{ eyebrow }}</p>
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
  </section>
</template>

<script setup>
defineProps({
  eyebrow: {
    type: String,
    default: 'Heads up'
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.empty-state {
  position: relative;
  overflow: hidden;
  padding: 56px 24px;
  border: 1px solid var(--border);
  border-radius: 28px;
  background: var(--surface);
  box-shadow: var(--shadow);
  backdrop-filter: blur(16px);
  text-align: center;
}

.empty-state__eyebrow {
  margin: 0 0 8px;
  color: var(--accent-strong);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.75rem;
}

.empty-state h2 {
  margin: 0;
  line-height: 0.98;
}

.empty-state p:last-child {
  margin-bottom: 0;
  color: var(--text-soft);
}

@media (max-width: 720px) {
  .empty-state {
    border-radius: 24px;
  }
}
</style>
