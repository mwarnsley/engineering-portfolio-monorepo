<template>
  <section class="movie-section">
    <div class="movie-section__header">
      <div>
        <p class="movie-section__eyebrow">Browse</p>
        <h2>{{ title }}</h2>
      </div>
      <slot name="actions"></slot>
    </div>
    <div class="movie-grid">
      <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
    </div>
  </section>
</template>

<script setup>
import MovieCard from './MovieCard.vue';

defineProps({
  movies: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.movie-section {
  position: relative;
  overflow: hidden;
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: 28px;
  background: var(--surface);
  box-shadow: var(--shadow);
  backdrop-filter: blur(16px);
}

.movie-section__header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.movie-section__eyebrow {
  margin: 0 0 8px;
  color: var(--accent-strong);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.75rem;
}

.movie-section__header h2 {
  margin: 0;
  line-height: 0.98;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

@media (max-width: 980px) {
  .movie-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .movie-section {
    border-radius: 24px;
  }

  .movie-section__header {
    flex-direction: column;
    align-items: stretch;
  }

  .movie-grid {
    grid-template-columns: 1fr;
  }
}
</style>
