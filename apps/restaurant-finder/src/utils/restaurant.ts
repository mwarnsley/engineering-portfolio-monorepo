import { ActiveFilters, FilterOptions, RestaurantSummary } from '../types/restaurant';

export const createFilterOptions = (restaurants: RestaurantSummary[]): FilterOptions => {
  const cuisines = new Set<string>();
  const priceRanges = new Set<string>();

  restaurants.forEach((restaurant) => {
    restaurant.cuisines.forEach((cuisine) => cuisines.add(cuisine));

    if (restaurant.priceRange) {
      priceRanges.add(restaurant.priceRange);
    }
  });

  return {
    cuisines: Array.from(cuisines).sort((left, right) => left.localeCompare(right)),
    priceRanges: Array.from(priceRanges).sort((left, right) => left.localeCompare(right)),
  };
};

export const filterRestaurants = (restaurants: RestaurantSummary[], filters: ActiveFilters) => {
  return restaurants.filter((restaurant) => {
    const matchesCuisine = filters.cuisine ? restaurant.cuisines.includes(filters.cuisine) : true;
    const matchesPrice = filters.priceRange ? restaurant.priceRange === filters.priceRange : true;

    return matchesCuisine && matchesPrice;
  });
};

export const buildRestaurantDetailsPath = (restaurantId: string) => {
  return `/restaurants/${encodeURIComponent(restaurantId)}`;
};
