<template>
  <RouterLink class="movie-card" :to="`/movie/${movie.id}`">
    <img
      class="movie-card__poster"
      :src="posterUrl"
      :alt="`${movie.title} poster`"
      loading="lazy"
    />
    <div class="movie-card__body">
      <p class="movie-card__meta">{{ releaseYear }}</p>
      <h3>{{ movie.title }}</h3>
      <p class="movie-card__rating">TMDB {{ rating }}</p>
    </div>
  </RouterLink>
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

const posterUrl = computed(() => getImageUrl(props.movie.poster_path, 'w500'));
const releaseYear = computed(() =>
  props.movie.release_date ? props.movie.release_date.slice(0, 4) : 'TBA'
);
const rating = computed(() =>
  typeof props.movie.vote_average === 'number'
    ? props.movie.vote_average.toFixed(1)
    : 'N/A'
);
</script>

<style scoped>
.movie-card {
  background: var(--surface-strong);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  overflow: hidden;
  transition: transform 180ms ease, border-color 180ms ease;
}

.movie-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 177, 92, 0.35);
}

.movie-card__poster {
  aspect-ratio: 2 / 3;
  width: 100%;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.05);
}

.movie-card__body {
  padding: 16px;
}

.movie-card__body h3 {
  margin: 8px 0 6px;
  font-size: 1.05rem;
}

.movie-card__meta,
.movie-card__rating {
  margin: 0;
  color: var(--text-soft);
}
</style>
