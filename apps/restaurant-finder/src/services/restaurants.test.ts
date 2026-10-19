import { fetchRestaurantById, getApiHealth, searchRestaurants } from './restaurants';
import { http } from './http';
import { restaurantFixture } from '../test/fixtures/restaurants';

jest.mock('./http', () => ({
  http: {
    get: jest.fn(),
  },
}));

describe('restaurant service', () => {
  it('returns restaurant search results', async () => {
    jest.mocked(http.get).mockResolvedValueOnce({
      data: { restaurants: [restaurantFixture] },
    });

    await expect(searchRestaurants({ mode: 'city', query: 'New York' })).resolves.toEqual([
      restaurantFixture,
    ]);
  });

  it('requests the search endpoint', async () => {
    jest.mocked(http.get).mockResolvedValueOnce({
      data: { restaurants: [restaurantFixture] },
    });

    await searchRestaurants({ mode: 'zip', query: '10012' });

    expect(http.get).toHaveBeenCalledWith('/restaurants', {
      params: { mode: 'zip', query: '10012' },
    });
  });

  it('returns restaurant details', async () => {
    jest.mocked(http.get).mockResolvedValueOnce({
      data: { restaurant: restaurantFixture },
    });

    await expect(fetchRestaurantById(restaurantFixture.restaurantId)).resolves.toEqual(
      restaurantFixture
    );
  });

  it('requests the detail endpoint', async () => {
    jest.mocked(http.get).mockResolvedValueOnce({
      data: { restaurant: restaurantFixture },
    });

    await fetchRestaurantById(restaurantFixture.restaurantId);

    expect(http.get).toHaveBeenCalledWith(`/restaurants/${restaurantFixture.restaurantId}`);
  });
});

it('defaults missing search results to an empty list', async () => {
  jest.mocked(http.get).mockResolvedValueOnce({ data: {} });
  await expect(searchRestaurants({ mode: 'city', query: 'Chicago' })).resolves.toEqual([]);
});

it('probes the upstream API and returns its health response', async () => {
  const health = {
    configured: true,
    reachable: false,
    host: 'api.example.com',
    message: 'Offline',
    code: 'UNREACHABLE',
  };
  jest.mocked(http.get).mockResolvedValueOnce({ data: health });
  await expect(getApiHealth()).resolves.toEqual(health);
  expect(http.get).toHaveBeenLastCalledWith('/health', { params: { probe: true } });
});

it('propagates request failures to the caller', async () => {
  jest.mocked(http.get).mockRejectedValueOnce(new Error('Offline'));
  await expect(searchRestaurants({ mode: 'zip', query: '10012' })).rejects.toThrow('Offline');
});
