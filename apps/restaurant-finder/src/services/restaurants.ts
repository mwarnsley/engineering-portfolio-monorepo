import { http } from './http';
import { RestaurantSearchMode, RestaurantSummary } from '../types/restaurant';

export const searchRestaurants = async (
  params: RestaurantSearchMode
): Promise<RestaurantSummary[]> => {
  const response = await http.get<{ restaurants: RestaurantSummary[] }>('/restaurants', {
    params,
  });

  return response.data.restaurants ?? [];
};

export const fetchRestaurantById = async (restaurantId: string): Promise<RestaurantSummary> => {
  const response = await http.get<{ restaurant: RestaurantSummary }>(
    `/restaurants/${restaurantId}`
  );

  return response.data.restaurant;
};

export const getApiHealth = async () => {
  const response = await http.get<{
    configured: boolean;
    reachable: boolean | null;
    host: string;
    message: string;
    code?: string | null;
  }>('/health', {
    params: {
      probe: true,
    },
  });

  return response.data;
};
