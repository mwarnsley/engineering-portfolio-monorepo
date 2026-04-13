<template>
  <div class="app-shell">
    <div class="app-shell__backdrop"></div>
    <AppHeader />
    <main class="app-shell__main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
</script>

<style scoped>
.app-shell {
  position: relative;
  min-height: 100vh;
}

.app-shell__backdrop {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 80% 20%, rgba(39, 196, 245, 0.11), transparent 22%),
    radial-gradient(circle at 20% 30%, rgba(255, 138, 61, 0.1), transparent 25%);
}

.app-shell__main {
  position: relative;
  z-index: 1;
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 24px 0 72px;
}

@media (max-width: 720px) {
  .app-shell__main {
    width: min(100% - 24px, 1180px);
  }
}
</style>
