import { render, screen } from '@testing-library/react';

import App from './App';

jest.mock('./hooks/useRestaurantSearch', () => ({
  useRestaurantSearch: () => ({
    filters: { cuisine: '', priceRange: '' },
    hasSearched: false,
    isLoading: false,
    error: '',
    restaurants: [],
    setFilters: jest.fn(),
    runSearch: jest.fn().mockResolvedValue(undefined),
    searchNearby: jest.fn().mockResolvedValue(undefined),
    clearResults: jest.fn(),
  }),
}));

jest.mock('./hooks/useApiHealth', () => ({
  useApiHealth: () => ({
    configured: true,
    reachable: true,
    host: 'api.geoapify.com',
    message: 'Connected',
    status: 'ready',
  }),
}));

describe('App', () => {
  it('renders the results heading', () => {
    render(<App />);

    expect(screen.getByText('Restaurants worth exploring')).toBeInTheDocument();
  });

  it('renders the empty state prompt before searching', () => {
    render(<App />);

    expect(screen.getByText('Ready to find your next spot?')).toBeInTheDocument();
  });
});
