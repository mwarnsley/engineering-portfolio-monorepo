const API_URL =
  import.meta.env.VITE_TMDB_API_URL || 'https://api.themoviedb.org/3/';
const IMAGE_BASE_URL =
  import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function buildUrl(path, params = {}) {
  const url = new URL(path, API_URL);

  if (!API_KEY) {
    throw new Error(
      'Missing VITE_TMDB_API_KEY. Add it to a local .env file before starting the app.'
    );
  }

  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'en-US');

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

async function request(path, params) {
  const response = await fetch(buildUrl(path, params));

  if (!response.ok) {
    throw new Error(`TMDB request failed with status ${response.status}.`);
  }

  const data = await response.json();

  if (data.status_code && data.status_message) {
    throw new Error(data.status_message);
  }

  return data;
}

export function getImageUrl(path, size = 'w780') {
  if (!path) {
    return '/images/no_image.jpg';
  }

  return `${IMAGE_BASE_URL}${size}${path}`;
}

export function getPopularMovies(page = 1) {
  return request('movie/popular', { page });
}

export function searchMovies(query, page = 1) {
  return request('search/movie', { query, page, include_adult: 'false' });
}

export function getMovieDetails(id) {
  return request(`movie/${id}`);
}

export function getMovieCredits(id) {
  return request(`movie/${id}/credits`);
}
