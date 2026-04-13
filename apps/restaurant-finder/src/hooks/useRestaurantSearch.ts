import { useState } from 'react';

import {
  ActiveFilters,
  RestaurantSearchMode,
  RestaurantSummary,
  SearchMode,
} from '../types/restaurant';
import { searchRestaurants } from '../services/restaurants';

const initialFilters: ActiveFilters = {
  cuisine: '',
  priceRange: '',
};

export const useRestaurantSearch = () => {
  const [restaurants, setRestaurants] = useState<RestaurantSummary[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<ActiveFilters>(initialFilters);

  const loadRestaurants = async (params: RestaurantSearchMode) => {
    setError('');
    setHasSearched(true);
    setIsLoading(true);

    try {
      const nextRestaurants = await searchRestaurants(params);
      setRestaurants(nextRestaurants);
      setFilters(initialFilters);
    } catch (loadError) {
      setRestaurants([]);
      setError(
        loadError instanceof Error ? loadError.message : 'Something went wrong while searching.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const runSearch = async ({ mode, query }: { mode: SearchMode; query: string }) => {
    await loadRestaurants({
      mode,
      query,
    });
  };

  const searchNearby = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser.');
      return;
    }

    setError('');

    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
      });
    }).catch(() => null);

    if (!position) {
      setError('We could not access your location. Please try a city or zip code search.');
      return;
    }

    await loadRestaurants({
      mode: 'geo',
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  };

  const clearResults = () => {
    setRestaurants([]);
    setHasSearched(false);
    setError('');
    setFilters(initialFilters);
  };

  return {
    restaurants,
    hasSearched,
    isLoading,
    error,
    filters,
    setFilters,
    runSearch,
    searchNearby,
    clearResults,
  };
};
