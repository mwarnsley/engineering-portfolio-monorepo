<template>
  <header class="site-header">
    <RouterLink class="site-header__brand" to="/">
      <span class="site-header__title">Movies</span>
    </RouterLink>
    <a
      class="site-header__link"
      href="https://www.themoviedb.org/"
      target="_blank"
      rel="noreferrer"
    >
      Powered by TMDB
    </a>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 24px 0 14px;
  backdrop-filter: blur(12px);
}

.site-header__brand {
  display: inline-flex;
  flex-direction: column;
  gap: 2px;
}

.site-header__title {
  font-size: clamp(1.7rem, 3vw, 2.4rem);
  font-weight: 700;
}

.site-header__link {
  color: var(--text-soft);
  transition: color 180ms ease, transform 180ms ease;
}

.site-header__link:hover {
  color: #fff;
  transform: translateY(-1px);
}

@media (max-width: 720px) {
  .site-header {
    width: min(100% - 24px, 1180px);
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
