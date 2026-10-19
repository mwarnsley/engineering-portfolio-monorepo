import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { RestaurantCard } from './RestaurantCard';
import { restaurantFixture } from '../test/fixtures/restaurants';

describe('RestaurantCard', () => {
  it('renders the restaurant name', () => {
    render(
      <MemoryRouter>
        <RestaurantCard restaurant={restaurantFixture} />
      </MemoryRouter>
    );

    expect(screen.getByText('Silver Spurs')).toBeInTheDocument();
  });

  it('renders the cuisine summary', () => {
    render(
      <MemoryRouter>
        <RestaurantCard restaurant={restaurantFixture} />
      </MemoryRouter>
    );

    expect(screen.getByText('American • Burgers • Diner')).toBeInTheDocument();
  });

  it('renders the website action', () => {
    render(
      <MemoryRouter>
        <RestaurantCard restaurant={restaurantFixture} />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Website' })).toBeInTheDocument();
  });

  it('renders a details route link', () => {
    render(
      <MemoryRouter>
        <RestaurantCard restaurant={restaurantFixture} />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Details' })).toHaveAttribute(
      'href',
      '/restaurants/geoapify-silver-spurs'
    );
  });

  it('renders an enabled visit location action when coordinates exist', () => {
    render(
      <MemoryRouter>
        <RestaurantCard restaurant={restaurantFixture} />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Visit' })).toBeInTheDocument();
  });
});

it.each([
  { lat: null, lon: -74 },
  { lat: 40, lon: null },
])('disables external actions for missing coordinates %j and website', (geo) => {
  render(
    <MemoryRouter>
      <RestaurantCard
        restaurant={{
          ...restaurantFixture,
          geo,
          restaurantWebsite: '',
          cuisines: [],
          priceRange: '',
          highlights: [],
        }}
      />
    </MemoryRouter>
  );
  expect(screen.getByRole('button', { name: 'Visit' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Website' })).toBeDisabled();
  expect(screen.getByText('Cuisine unavailable')).toBeInTheDocument();
});

it('accepts zero-valued map coordinates', () => {
  render(
    <MemoryRouter>
      <RestaurantCard restaurant={{ ...restaurantFixture, geo: { lat: 0, lon: 0 } }} />
    </MemoryRouter>
  );
  expect(screen.getByRole('link', { name: 'Visit' })).toHaveAttribute(
    'href',
    'https://www.google.com/maps/search/?api=1&query=0,0'
  );
});
