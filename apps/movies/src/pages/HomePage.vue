<template>
  <div class="page-stack">
    <HeroSpotlight v-if="heroMovie" :movie="heroMovie" />

    <SearchBar :model-value="searchTerm" @search="submitSearch" />

    <EmptyState
      v-if="error"
      eyebrow="Configuration"
      title="The movie feed could not load"
      :message="error"
    />
    <section v-else-if="loading && !movies.length" class="status-panel">
      Loading the latest movie lineup...
    </section>

    <template v-else>
      <MovieGrid v-if="movies.length" :movies="movies" :title="heading">
        <template #actions>
          <button
            v-if="canLoadMore"
            class="ghost-button"
            type="button"
            :disabled="loading"
            @click="loadMore"
          >
            {{ loading ? 'Loading...' : 'Load more' }}
          </button>
        </template>
      </MovieGrid>

      <EmptyState
        v-else-if="!loading"
        eyebrow="No matches"
        title="Nothing landed yet"
        message="Try a different search or clear the query to return to popular movies."
      />
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import EmptyState from '../components/EmptyState.vue';
import HeroSpotlight from '../components/HeroSpotlight.vue';
import MovieGrid from '../components/MovieGrid.vue';
import SearchBar from '../components/SearchBar.vue';
import { useMovieSearch } from '../composables/useMovieSearch';

const {
  error,
  heading,
  heroMovie,
  loadInitialMovies,
  loadMore,
  loading,
  movies,
  page,
  searchTerm,
  submitSearch,
  totalPages
} = useMovieSearch();

const canLoadMore = computed(
  () => movies.value.length > 0 && page.value < totalPages.value
);

onMounted(() => {
  loadInitialMovies();
});
</script>

<style scoped>
.page-stack {
  display: grid;
  gap: 24px;
}

.status-panel {
  position: relative;
  overflow: hidden;
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: 28px;
  background: var(--surface);
  box-shadow: var(--shadow);
  backdrop-filter: blur(16px);
  text-align: center;
  color: var(--text-soft);
  font-size: 1rem;
}

.ghost-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 18px;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease;
}

.ghost-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(255, 138, 61, 0.25);
}

.ghost-button:disabled {
  opacity: 0.55;
  cursor: progress;
}

@media (max-width: 720px) {
  .status-panel {
    border-radius: 24px;
  }
}
</style>
