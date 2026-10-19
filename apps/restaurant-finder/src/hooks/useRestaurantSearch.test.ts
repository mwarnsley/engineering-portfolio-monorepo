import { act, renderHook } from '@testing-library/react';
import { useRestaurantSearch } from './useRestaurantSearch';
import { searchRestaurants } from '../services/restaurants';
import { restaurantFixture } from '../test/fixtures/restaurants';

jest.mock('../services/restaurants', () => ({ searchRestaurants: jest.fn() }));
const originalGeolocation = Object.getOwnPropertyDescriptor(navigator, 'geolocation');

beforeEach(() => jest.resetAllMocks());
afterEach(() => {
  if (originalGeolocation) Object.defineProperty(navigator, 'geolocation', originalGeolocation);
  else Reflect.deleteProperty(navigator, 'geolocation');
});

it('tracks loading and resets filters when a search succeeds', async () => {
  let finish!: (restaurants: (typeof restaurantFixture)[]) => void;
  jest.mocked(searchRestaurants).mockReturnValue(
    new Promise((resolve) => {
      finish = resolve;
    })
  );
  const { result } = renderHook(useRestaurantSearch);
  act(() => result.current.setFilters({ cuisine: 'Seafood', priceRange: '$$$' }));
  let pending!: Promise<void>;
  act(() => {
    pending = result.current.runSearch({ mode: 'city', query: 'Chicago' });
  });
  expect(result.current).toMatchObject({ isLoading: true, hasSearched: true, error: '' });
  await act(async () => {
    finish([restaurantFixture]);
    await pending;
  });
  expect(searchRestaurants).toHaveBeenCalledWith({ mode: 'city', query: 'Chicago' });
  expect(result.current).toMatchObject({
    restaurants: [restaurantFixture],
    isLoading: false,
    filters: { cuisine: '', priceRange: '' },
  });
});

it.each([
  [new Error('Offline'), 'Offline'],
  ['unknown', 'Something went wrong while searching.'],
])('clears stale results on failure: %s', async (failure, message) => {
  jest
    .mocked(searchRestaurants)
    .mockResolvedValueOnce([restaurantFixture])
    .mockRejectedValueOnce(failure);
  const { result } = renderHook(useRestaurantSearch);
  await act(async () => result.current.runSearch({ mode: 'zip', query: '10012' }));
  await act(async () => result.current.runSearch({ mode: 'zip', query: '10013' }));
  expect(result.current).toMatchObject({
    restaurants: [],
    error: message,
    isLoading: false,
    hasSearched: true,
  });
});

it('clears results, filters, and the searched state', async () => {
  jest.mocked(searchRestaurants).mockResolvedValue([restaurantFixture]);
  const { result } = renderHook(useRestaurantSearch);
  await act(async () => result.current.runSearch({ mode: 'city', query: 'Chicago' }));
  act(() => result.current.setFilters({ cuisine: 'American', priceRange: '$$' }));
  act(() => result.current.clearResults());
  expect(result.current).toMatchObject({
    restaurants: [],
    hasSearched: false,
    error: '',
    filters: { cuisine: '', priceRange: '' },
  });
});

it('explains unsupported geolocation without requesting restaurants', async () => {
  Object.defineProperty(navigator, 'geolocation', { configurable: true, value: undefined });
  const { result } = renderHook(useRestaurantSearch);
  await act(async () => result.current.searchNearby());
  expect(result.current.error).toBe('Geolocation is not supported in this browser.');
  expect(searchRestaurants).not.toHaveBeenCalled();
});

it('explains denied geolocation without requesting restaurants', async () => {
  const getCurrentPosition = jest.fn((_success: PositionCallback, failure: PositionErrorCallback) =>
    failure({
      code: 1,
      message: 'Denied',
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    })
  );
  Object.defineProperty(navigator, 'geolocation', {
    configurable: true,
    value: { getCurrentPosition },
  });
  const { result } = renderHook(useRestaurantSearch);
  await act(async () => result.current.searchNearby());
  expect(result.current.error).toContain('Please try a city or zip code search.');
  expect(searchRestaurants).not.toHaveBeenCalled();
});

it('searches using the browser coordinates', async () => {
  const position = {
    coords: {
      latitude: 40,
      longitude: -74,
      accuracy: 5,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
      toJSON: () => ({}),
    },
    timestamp: 1,
    toJSON: () => ({}),
  };
  const getCurrentPosition = jest.fn((success: PositionCallback) => success(position));
  Object.defineProperty(navigator, 'geolocation', {
    configurable: true,
    value: { getCurrentPosition },
  });
  jest.mocked(searchRestaurants).mockResolvedValue([restaurantFixture]);
  const { result } = renderHook(useRestaurantSearch);
  await act(async () => result.current.searchNearby());
  expect(getCurrentPosition).toHaveBeenCalledWith(expect.any(Function), expect.any(Function), {
    enableHighAccuracy: true,
    timeout: 10000,
  });
  expect(searchRestaurants).toHaveBeenCalledWith({ mode: 'geo', latitude: 40, longitude: -74 });
  expect(result.current.restaurants).toEqual([restaurantFixture]);
});
