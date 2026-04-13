<template>
  <section class="hero-card" :style="heroStyle">
    <div class="hero-card__overlay"></div>
    <div class="hero-card__content">
      <p class="hero-card__kicker">Featured tonight</p>
      <h1>{{ movie.title }}</h1>
      <p class="hero-card__copy">
        {{ summary }}
      </p>
      <RouterLink class="hero-card__cta" :to="`/movie/${movie.id}`">
        Explore details
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { getImageUrl } from '../lib/tmdb';

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
});

const heroStyle = computed(() => ({
  backgroundImage: `linear-gradient(135deg, rgba(11, 15, 25, 0.2), rgba(11, 15, 25, 0.85)), url(${getImageUrl(
    props.movie.backdrop_path,
    'original'
  )})`
}));

const summary = computed(() => {
  if (!props.movie.overview) {
    return 'A hand-picked spotlight from the current catalog.';
  }

  return props.movie.overview;
});
</script>

<style scoped>
.hero-card {
  position: relative;
  overflow: hidden;
  min-height: 500px;
  padding: 40px;
  border: 1px solid var(--border);
  border-radius: 28px;
  background-position: center;
  background-size: cover;
  box-shadow: var(--shadow);
}

.hero-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(5, 10, 19, 0.92), rgba(5, 10, 19, 0.22));
}

.hero-card__content {
  position: relative;
  z-index: 1;
  width: min(540px, 100%);
  display: grid;
  gap: 18px;
}

.hero-card__kicker {
  margin: 0;
  color: var(--accent-strong);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.75rem;
}

.hero-card h1 {
  margin: 0;
  line-height: 0.98;
  font-size: clamp(2.8rem, 7vw, 5.8rem);
}

.hero-card__copy {
  margin: 0;
  color: var(--text-soft);
}

.hero-card__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  justify-self: start;
  min-height: 48px;
  padding: 0 18px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--accent) 0%, #f4c15a 100%);
  color: #0c1423;
  font-weight: 700;
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.hero-card__cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(255, 138, 61, 0.25);
}

@media (max-width: 720px) {
  .hero-card {
    min-height: 420px;
    padding: 28px;
    border-radius: 24px;
  }

  .hero-card h1 {
    font-size: clamp(2.4rem, 12vw, 4rem);
  }
}
</style>
