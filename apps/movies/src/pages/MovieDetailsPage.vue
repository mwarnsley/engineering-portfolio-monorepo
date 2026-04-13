<template>
  <div class="page-stack">
    <RouterLink class="back-link" to="/">Back to browse</RouterLink>

    <EmptyState
      v-if="error"
      eyebrow="Movie details"
      title="We couldn't load this title"
      :message="error"
    />
    <section v-else-if="loading" class="status-panel">
      Loading movie details...
    </section>

    <template v-else-if="movie">
      <section class="detail-hero">
        <div class="detail-hero__poster-wrap">
          <img
            class="detail-hero__poster"
            :src="getImageUrl(movie.poster_path, 'w780')"
            :alt="`${movie.title} poster`"
          />
        </div>
        <div class="detail-hero__content">
          <p class="detail-hero__eyebrow">{{ releaseYear }} • {{ runtime }}</p>
          <h1>{{ movie.title }}</h1>
          <p class="detail-hero__overview">{{ movie.overview }}</p>

          <div class="detail-hero__stats">
            <div class="stat-card">
              <span>Rating</span>
              <strong>{{ rating }}</strong>
            </div>
            <div class="stat-card">
              <span>Budget</span>
              <strong>{{ formatCurrency(movie.budget) }}</strong>
            </div>
            <div class="stat-card">
              <span>Revenue</span>
              <strong>{{ formatCurrency(movie.revenue) }}</strong>
            </div>
          </div>

          <div class="detail-hero__chips">
            <span v-for="genre in movie.genres" :key="genre.id" class="genre-chip">
              {{ genre.name }}
            </span>
          </div>

          <p class="detail-hero__director">
            Directed by {{ directorsLabel }}
          </p>
        </div>
      </section>

      <CastGrid v-if="cast.length" :cast="cast" />
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import CastGrid from '../components/CastGrid.vue';
import EmptyState from '../components/EmptyState.vue';
import { getImageUrl, getMovieCredits, getMovieDetails } from '../lib/tmdb';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const movie = ref(null);
const cast = ref([]);
const directors = ref([]);
const error = ref('');
const loading = ref(false);

const rating = computed(() =>
  typeof movie.value?.vote_average === 'number'
    ? `${movie.value.vote_average.toFixed(1)} / 10`
    : 'N/A'
);
const releaseYear = computed(() => movie.value?.release_date?.slice(0, 4) || 'TBA');
const runtime = computed(() =>
  movie.value?.runtime ? `${movie.value.runtime} min` : 'Runtime unavailable'
);
const directorsLabel = computed(() =>
  directors.value.length ? directors.value.map(person => person.name).join(', ') : 'Unknown'
);

function formatCurrency(value) {
  if (!value) {
    return 'Unavailable';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

async function loadMovie() {
  error.value = '';
  loading.value = true;

  try {
    const [movieResponse, creditsResponse] = await Promise.all([
      getMovieDetails(props.id),
      getMovieCredits(props.id)
    ]);

    movie.value = movieResponse;
    cast.value = (creditsResponse.cast || []).slice(0, 12);
    directors.value = (creditsResponse.crew || []).filter(
      person => person.job === 'Director'
    );
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : 'Unable to load movie details.';
    movie.value = null;
    cast.value = [];
    directors.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadMovie();
});

watch(
  () => props.id,
  () => {
    loadMovie();
  }
);
</script>

<style scoped>
.page-stack {
  display: grid;
  gap: 24px;
}

.back-link {
  color: var(--text-soft);
  transition: color 180ms ease, transform 180ms ease;
}

.back-link:hover {
  color: #fff;
  transform: translateY(-1px);
}

.status-panel,
.detail-hero {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 28px;
  box-shadow: var(--shadow);
}

.status-panel {
  padding: 24px;
  background: var(--surface);
  backdrop-filter: blur(16px);
  text-align: center;
  color: var(--text-soft);
  font-size: 1rem;
}

.detail-hero {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 28px;
  padding: 24px;
  background: linear-gradient(180deg, rgba(10, 18, 31, 0.95), rgba(7, 12, 20, 0.95));
}

.detail-hero__poster {
  width: 100%;
  height: 100%;
  border-radius: 24px;
  object-fit: cover;
}

.detail-hero__content {
  display: grid;
  align-content: start;
  gap: 18px;
}

.detail-hero__eyebrow {
  margin: 0;
  color: var(--accent-strong);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.75rem;
}

.detail-hero h1 {
  margin: 0;
  line-height: 0.98;
}

.detail-hero__overview,
.detail-hero__director {
  margin: 0;
  color: var(--text-soft);
}

.detail-hero__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.stat-card,
.genre-chip {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
}

.stat-card {
  display: grid;
  gap: 4px;
  padding: 16px;
  border-radius: 18px;
}

.stat-card span {
  color: var(--text-soft);
  font-size: 0.85rem;
}

.stat-card strong {
  font-size: 1.05rem;
}

.detail-hero__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.genre-chip {
  padding: 8px 12px;
  border-radius: 999px;
}

@media (max-width: 980px) {
  .detail-hero,
  .detail-hero__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .detail-hero {
    grid-template-columns: 1fr;
  }

  .detail-hero__poster-wrap {
    max-width: 340px;
  }
}

@media (max-width: 720px) {
  .status-panel,
  .detail-hero {
    border-radius: 24px;
  }

  .detail-hero__stats {
    grid-template-columns: 1fr;
  }
}
</style>
