import { computed, ref } from 'vue';
import { getPopularMovies, searchMovies } from '../lib/tmdb';

export function useMovieSearch() {
  const heroMovie = ref(null);
  const loading = ref(false);
  const error = ref('');
  const movies = ref([]);
  const page = ref(0);
  const totalPages = ref(0);
  const searchTerm = ref('');

  const heading = computed(() =>
    searchTerm.value ? `Results for "${searchTerm.value}"` : 'Popular movies'
  );

  async function loadMovies({ query = '', nextPage = 1, append = false } = {}) {
    loading.value = true;
    error.value = '';

    try {
      const response = query
        ? await searchMovies(query, nextPage)
        : await getPopularMovies(nextPage);

      const incomingMovies = response.results || [];

      page.value = response.page || nextPage;
      totalPages.value = response.total_pages || 0;
      searchTerm.value = query;
      heroMovie.value =
        nextPage === 1 ? incomingMovies[0] || null : heroMovie.value;
      movies.value = append ? [...movies.value, ...incomingMovies] : incomingMovies;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to load movies.';
      if (!append) {
        movies.value = [];
        heroMovie.value = null;
      }
    } finally {
      loading.value = false;
    }
  }

  async function loadInitialMovies() {
    await loadMovies();
  }

  async function submitSearch(query) {
    await loadMovies({ query: query.trim() });
  }

  async function loadMore() {
    if (loading.value || page.value >= totalPages.value) {
      return;
    }

    await loadMovies({
      query: searchTerm.value,
      nextPage: page.value + 1,
      append: true
    });
  }

  return {
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
  };
}
