import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { RestaurantGrid } from './RestaurantGrid';
import { restaurantFixture, secondaryRestaurantFixture } from '../test/fixtures/restaurants';

describe('RestaurantGrid', () => {
  it('renders the first restaurant', () => {
    render(
      <MemoryRouter>
        <RestaurantGrid restaurants={[restaurantFixture, secondaryRestaurantFixture]} />
      </MemoryRouter>
    );

    expect(screen.getByText('Silver Spurs')).toBeInTheDocument();
  });

  it('renders the second restaurant', () => {
    render(
      <MemoryRouter>
        <RestaurantGrid restaurants={[restaurantFixture, secondaryRestaurantFixture]} />
      </MemoryRouter>
    );

    expect(screen.getByText('Lakefront Kitchen')).toBeInTheDocument();
  });
});
