import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { RestaurantDetailsPage } from './RestaurantDetailsPage';
import { restaurantFixture } from '../test/fixtures/restaurants';
import { fetchRestaurantById } from '../services/restaurants';

jest.mock('../services/restaurants', () => ({
  fetchRestaurantById: jest.fn(),
}));

describe('RestaurantDetailsPage', () => {
  beforeEach(() => {
    jest.mocked(fetchRestaurantById).mockResolvedValue(restaurantFixture);
  });

  it('renders the restaurant name after loading', async () => {
    render(
      <MemoryRouter initialEntries={['/restaurants/geoapify-silver-spurs']}>
        <Routes>
          <Route path="/restaurants/:restaurantId" element={<RestaurantDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Silver Spurs')).toBeInTheDocument();
    });
  });

  it('renders the overview section', async () => {
    render(
      <MemoryRouter initialEntries={['/restaurants/geoapify-silver-spurs']}>
        <Routes>
          <Route path="/restaurants/:restaurantId" element={<RestaurantDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('A cleaner look at the place data')).toBeInTheDocument();
    });
  });
});
