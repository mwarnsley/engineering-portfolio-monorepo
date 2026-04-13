describe('tmdb helpers', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    global.fetch = vi.fn();
  });

  it('builds a popular movies request with the api key', async () => {
    vi.stubEnv('VITE_TMDB_API_KEY', 'secret');
    vi.stubEnv('VITE_TMDB_API_URL', 'https://api.example/');
    fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ results: [] })
    });

    const { getPopularMovies } = await import('../../../src/lib/tmdb.js');
    await getPopularMovies(2);

    expect(fetch.mock.calls[0][0]).toContain('api_key=secret');
  });

  it('includes the page on popular movie requests', async () => {
    vi.stubEnv('VITE_TMDB_API_KEY', 'secret');
    vi.stubEnv('VITE_TMDB_API_URL', 'https://api.example/');
    fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ results: [] })
    });

    const { getPopularMovies } = await import('../../../src/lib/tmdb.js');
    await getPopularMovies(2);

    expect(fetch.mock.calls[0][0]).toContain('page=2');
  });

  it('builds a search request with the query', async () => {
    vi.stubEnv('VITE_TMDB_API_KEY', 'secret');
    vi.stubEnv('VITE_TMDB_API_URL', 'https://api.example/');
    fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ results: [] })
    });

    const { searchMovies } = await import('../../../src/lib/tmdb.js');
    await searchMovies('Dune', 3);

    expect(fetch.mock.calls[0][0]).toContain('query=Dune');
  });

  it('throws when the api key is missing', async () => {
    vi.stubEnv('VITE_TMDB_API_KEY', '');

    const { getPopularMovies } = await import('../../../src/lib/tmdb.js');

    await expect(getPopularMovies()).rejects.toThrow('Missing VITE_TMDB_API_KEY');
  });

  it('throws on a bad response status', async () => {
    vi.stubEnv('VITE_TMDB_API_KEY', 'secret');
    fetch.mockResolvedValue({
      ok: false,
      status: 500
    });

    const { getMovieDetails } = await import('../../../src/lib/tmdb.js');

    await expect(getMovieDetails(1)).rejects.toThrow(
      'TMDB request failed with status 500.'
    );
  });

  it('throws on an api error payload', async () => {
    vi.stubEnv('VITE_TMDB_API_KEY', 'secret');
    fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        status_code: 34,
        status_message: 'The resource you requested could not be found.'
      })
    });

    const { getMovieCredits } = await import('../../../src/lib/tmdb.js');

    await expect(getMovieCredits(1)).rejects.toThrow(
      'The resource you requested could not be found.'
    );
  });

  it('returns the fallback image when no path is provided', async () => {
    vi.stubEnv('VITE_TMDB_API_KEY', 'secret');

    const { getImageUrl } = await import('../../../src/lib/tmdb.js');

    expect(getImageUrl(null)).toBe('/images/no_image.jpg');
  });

  it('builds an image url when a path is provided', async () => {
    vi.stubEnv('VITE_TMDB_API_KEY', 'secret');
    vi.stubEnv('VITE_TMDB_IMAGE_BASE_URL', 'https://images.example/');

    const { getImageUrl } = await import('../../../src/lib/tmdb.js');

    expect(getImageUrl('/poster.jpg', 'w500')).toBe('https://images.example/w500/poster.jpg');
  });
});
