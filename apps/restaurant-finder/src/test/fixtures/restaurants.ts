import { RestaurantSummary } from '../../types/restaurant';

export const restaurantFixture: RestaurantSummary = {
  restaurantId: 'geoapify-silver-spurs',
  restaurantName: 'Silver Spurs',
  restaurantPhone: '(212) 228-2333',
  restaurantWebsite: 'https://silverspurs.example.com',
  priceRange: '$$',
  hours: 'Daily: 6am-11pm',
  lastUpdated: '2020-10-01T15:13:42.654Z',
  cuisines: ['American', 'Burgers', 'Diner'],
  highlights: ['Takeout', 'Outdoor seating'],
  geo: {
    lat: 40.727026,
    lon: -73.999819,
  },
  address: {
    city: 'New York',
    formatted: '490 Laguardia Pl New York, NY 10012',
    postalCode: '10012',
    state: 'NY',
    street: '490 Laguardia Pl',
  },
  menus: [
    {
      menuName: 'Main',
      menuSections: [
        {
          sectionName: 'Beverages',
          menuItems: [
            {
              name: 'Regular Coffee',
              description: '',
              price: 2.25,
            },
            {
              name: 'Latte',
              description: '',
              price: 4.75,
            },
          ],
        },
      ],
    },
  ],
};

export const secondaryRestaurantFixture: RestaurantSummary = {
  ...restaurantFixture,
  restaurantId: 'geoapify-lakefront-kitchen',
  restaurantName: 'Lakefront Kitchen',
  priceRange: '$$$',
  cuisines: ['Seafood', 'American'],
  address: {
    city: 'Chicago',
    formatted: '12 Shoreline Ave Chicago, IL 60614',
    postalCode: '60614',
    state: 'IL',
    street: '12 Shoreline Ave',
  },
};
