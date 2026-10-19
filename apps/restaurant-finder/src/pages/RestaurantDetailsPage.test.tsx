import { act, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { RestaurantDetailsPage } from './RestaurantDetailsPage';
import type { RestaurantSummary } from '../types/restaurant';
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

const renderDetails = (path = '/restaurants/test') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/restaurants/:restaurantId?" element={<RestaurantDetailsPage />} />
      </Routes>
    </MemoryRouter>
  );

it.each([
  [new Error('Network unavailable'), 'Network unavailable'],
  ['unknown', 'We could not load restaurant details.'],
])('explains detail failures: %s', async (error, message) => {
  jest.mocked(fetchRestaurantById).mockRejectedValueOnce(error);
  renderDetails();
  expect(await screen.findByText(message)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Back to results' })).toHaveAttribute('href', '/');
});

it('shows the missing restaurant state for an empty response', async () => {
  // The API can return null at runtime despite the service's declared response type.
  jest.mocked(fetchRestaurantById).mockResolvedValueOnce(null as unknown as RestaurantSummary);
  renderDetails('/restaurants');
  expect(await screen.findByText('Restaurant not found')).toBeInTheDocument();
  expect(fetchRestaurantById).toHaveBeenLastCalledWith('');
});

it('renders fallback data when optional details are missing', async () => {
  jest.mocked(fetchRestaurantById).mockResolvedValueOnce({
    ...restaurantFixture,
    cuisines: [],
    priceRange: '',
    hours: '',
    restaurantPhone: '',
    restaurantWebsite: '',
    highlights: [],
    menus: [],
    geo: { lat: null, lon: null },
    address: { city: '', state: '', postalCode: '', formatted: '', street: '' },
  });
  renderDetails();
  expect(await screen.findByText('Address unavailable')).toBeInTheDocument();
  expect(screen.getByText('No menu data was returned for this restaurant')).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /Open map location/ })).not.toBeInTheDocument();
});

it('uses locality when the formatted address is missing and renders all attributes', async () => {
  jest.mocked(fetchRestaurantById).mockResolvedValueOnce({
    ...restaurantFixture,
    address: { ...restaurantFixture.address, formatted: '' },
    highlights: ['Takeout', 'Outdoor seating', 'Delivery'],
  });
  renderDetails('/restaurants/id%3Done');
  expect(await screen.findByText('New York, NY, 10012')).toBeInTheDocument();
  expect(screen.getByText('Delivery')).toBeInTheDocument();
  expect(fetchRestaurantById).toHaveBeenLastCalledWith('id=one');
});

it.each(['resolve', 'reject'])('ignores a late detail %s after unmount', async (outcome) => {
  let settle!: () => void;
  jest.mocked(fetchRestaurantById).mockReturnValueOnce(
    new Promise((resolve, reject) => {
      settle = () =>
        outcome === 'resolve' ? resolve(restaurantFixture) : reject(new Error('Late failure'));
    })
  );
  const { unmount } = renderDetails();
  unmount();
  await act(async () => settle());
  expect(screen.queryByText('Silver Spurs')).not.toBeInTheDocument();
});
