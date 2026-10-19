import { restaurantFixture, secondaryRestaurantFixture } from '../test/fixtures/restaurants';
import { buildRestaurantDetailsPath, createFilterOptions, filterRestaurants } from './restaurant';

describe('restaurant utilities', () => {
  it('creates cuisine filters in sorted order', () => {
    expect(createFilterOptions([restaurantFixture, secondaryRestaurantFixture]).cuisines).toEqual([
      'American',
      'Burgers',
      'Diner',
      'Seafood',
    ]);
  });

  it('creates price range filters in sorted order', () => {
    expect(
      createFilterOptions([restaurantFixture, secondaryRestaurantFixture]).priceRanges
    ).toEqual(['$$', '$$$']);
  });

  it('keeps all restaurants when filters are empty', () => {
    expect(
      filterRestaurants([restaurantFixture, secondaryRestaurantFixture], {
        cuisine: '',
        priceRange: '',
      })
    ).toHaveLength(2);
  });

  it('filters by cuisine', () => {
    expect(
      filterRestaurants([restaurantFixture, secondaryRestaurantFixture], {
        cuisine: 'Seafood',
        priceRange: '',
      })
    ).toEqual([secondaryRestaurantFixture]);
  });

  it('filters by price range', () => {
    expect(
      filterRestaurants([restaurantFixture, secondaryRestaurantFixture], {
        cuisine: '',
        priceRange: '$$',
      })
    ).toEqual([restaurantFixture]);
  });

  it('builds an encoded details path', () => {
    expect(buildRestaurantDetailsPath('id=restaurant/1')).toBe('/restaurants/id%3Drestaurant%2F1');
  });
});

it('omits unknown prices and deduplicates filter options', () => {
  expect(
    createFilterOptions([restaurantFixture, { ...restaurantFixture, priceRange: '' }])
  ).toEqual({ cuisines: ['American', 'Burgers', 'Diner'], priceRanges: ['$$'] });
});

it('requires both selected filters to match', () => {
  expect(
    filterRestaurants([restaurantFixture, secondaryRestaurantFixture], {
      cuisine: 'Seafood',
      priceRange: '$$',
    })
  ).toEqual([]);
});
