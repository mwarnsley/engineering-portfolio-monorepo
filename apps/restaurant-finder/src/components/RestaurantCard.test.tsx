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
