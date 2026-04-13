<template>
  <section class="cast-section">
    <div class="movie-section__header">
      <div>
        <p class="movie-section__eyebrow">Cast</p>
        <h2>Top billed actors</h2>
      </div>
    </div>
    <div class="cast-grid">
      <article
        v-for="person in cast"
        :key="person.credit_id || `${person.id}-${person.character}`"
        class="cast-card"
      >
        <img
          class="cast-card__photo"
          :src="getImageUrl(person.profile_path, 'w300')"
          :alt="person.name"
          loading="lazy"
        />
        <div class="cast-card__body">
          <h3>{{ person.name }}</h3>
          <p>{{ person.character || 'Role unavailable' }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { getImageUrl } from '../lib/tmdb';

defineProps({
  cast: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.cast-section {
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

.cast-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.cast-card {
  background: var(--surface-strong);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  overflow: hidden;
  transition: transform 180ms ease, border-color 180ms ease;
}

.cast-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 177, 92, 0.35);
}

.cast-card__photo {
  aspect-ratio: 2 / 3;
  width: 100%;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.05);
}

.cast-card__body {
  padding: 16px;
}

.cast-card__body h3 {
  margin: 8px 0 6px;
  font-size: 1.05rem;
}

.cast-card__body p {
  margin: 0;
  color: var(--text-soft);
}

@media (max-width: 980px) {
  .cast-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .cast-section {
    border-radius: 24px;
  }

  .cast-grid {
    grid-template-columns: 1fr;
  }
}
</style>
