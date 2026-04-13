import { useMovieSearch } from '../../../src/composables/useMovieSearch';

const { getPopularMovies, searchMovies } = vi.hoisted(() => ({
  getPopularMovies: vi.fn(),
  searchMovies: vi.fn()
}));

vi.mock('../../../src/lib/tmdb', () => ({
  getPopularMovies,
  searchMovies
}));

describe('useMovieSearch', () => {
  beforeEach(() => {
    getPopularMovies.mockReset();
    searchMovies.mockReset();
  });

  it('starts with a popular movies heading', () => {
    const search = useMovieSearch();

    expect(search.heading.value).toBe('Popular movies');
  });

  it('loads popular movies initially', async () => {
    getPopularMovies.mockResolvedValue({
      page: 1,
      total_pages: 3,
      results: [{ id: 1, title: 'Alien' }]
    });

    const search = useMovieSearch();
    await search.loadInitialMovies();

    expect(getPopularMovies).toHaveBeenCalledWith(1);
  });

  it('stores the returned movies', async () => {
    getPopularMovies.mockResolvedValue({
      page: 1,
      total_pages: 3,
      results: [{ id: 1, title: 'Alien' }]
    });

    const search = useMovieSearch();
    await search.loadInitialMovies();

    expect(search.movies.value).toHaveLength(1);
  });

  it('uses the first movie as the hero', async () => {
    getPopularMovies.mockResolvedValue({
      page: 1,
      total_pages: 3,
      results: [{ id: 1, title: 'Alien' }]
    });

    const search = useMovieSearch();
    await search.loadInitialMovies();

    expect(search.heroMovie.value.title).toBe('Alien');
  });

  it('searches with a trimmed query', async () => {
    searchMovies.mockResolvedValue({
      page: 1,
      total_pages: 1,
      results: []
    });

    const search = useMovieSearch();
    await search.submitSearch('  Dune  ');

    expect(searchMovies).toHaveBeenCalledWith('Dune', 1);
  });

  it('updates the heading after a search', async () => {
    searchMovies.mockResolvedValue({
      page: 1,
      total_pages: 1,
      results: []
    });

    const search = useMovieSearch();
    await search.submitSearch('Dune');

    expect(search.heading.value).toBe('Results for "Dune"');
  });

  it('appends more results when loading more', async () => {
    getPopularMovies
      .mockResolvedValueOnce({
        page: 1,
        total_pages: 2,
        results: [{ id: 1, title: 'Alien' }]
      })
      .mockResolvedValueOnce({
        page: 2,
        total_pages: 2,
        results: [{ id: 2, title: 'Aliens' }]
      });

    const search = useMovieSearch();
    await search.loadInitialMovies();
    await search.loadMore();

    expect(search.movies.value).toHaveLength(2);
  });

  it('does not load more when already on the last page', async () => {
    getPopularMovies.mockResolvedValue({
      page: 1,
      total_pages: 1,
      results: [{ id: 1, title: 'Alien' }]
    });

    const search = useMovieSearch();
    await search.loadInitialMovies();
    await search.loadMore();

    expect(getPopularMovies).toHaveBeenCalledTimes(1);
  });

  it('stores a friendly error message on failure', async () => {
    getPopularMovies.mockRejectedValue(new Error('Network down'));

    const search = useMovieSearch();
    await search.loadInitialMovies();

    expect(search.error.value).toBe('Network down');
  });

  it('clears movies on a non-append failure', async () => {
    getPopularMovies.mockRejectedValue(new Error('Network down'));

    const search = useMovieSearch();
    await search.loadInitialMovies();

    expect(search.movies.value).toEqual([]);
  });
});
