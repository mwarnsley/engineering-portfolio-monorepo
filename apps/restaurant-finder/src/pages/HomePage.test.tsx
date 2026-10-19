import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from './HomePage';
import { useRestaurantSearch } from '../hooks/useRestaurantSearch';
import { useApiHealth } from '../hooks/useApiHealth';
import { restaurantFixture } from '../test/fixtures/restaurants';

jest.mock('../hooks/useRestaurantSearch');
jest.mock('../hooks/useApiHealth');
const state = (overrides: Partial<ReturnType<typeof useRestaurantSearch>> = {}) => ({
  filters: { cuisine: '', priceRange: '' },
  hasSearched: true,
  isLoading: false,
  error: '',
  restaurants: [restaurantFixture],
  setFilters: jest.fn(),
  runSearch: jest.fn(),
  searchNearby: jest.fn(),
  clearResults: jest.fn(),
  ...overrides,
});
const renderPage = () =>
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );

beforeEach(() => {
  jest.mocked(useRestaurantSearch).mockReturnValue(state());
  jest.mocked(useApiHealth).mockReturnValue({
    configured: true,
    reachable: true,
    host: '',
    message: 'Connected',
    status: 'ready',
  });
});

it('displays API connection failures while preserving results', () => {
  jest.mocked(useApiHealth).mockReturnValue({
    configured: false,
    reachable: false,
    host: '',
    message: 'Missing key',
    status: 'error',
  });
  renderPage();
  expect(screen.getByText('API connection needs attention')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Silver Spurs' })).toBeInTheDocument();
});

it('displays search errors without stale restaurant cards', () => {
  jest.mocked(useRestaurantSearch).mockReturnValue(state({ error: 'Search failed' }));
  renderPage();
  expect(screen.getByText('Search failed')).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Silver Spurs' })).not.toBeInTheDocument();
});

it('shows loading feedback instead of stale results', () => {
  jest.mocked(useRestaurantSearch).mockReturnValue(state({ isLoading: true }));
  renderPage();
  expect(screen.getByText('Refreshing restaurant data...')).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Silver Spurs' })).not.toBeInTheDocument();
});

it('explains an empty successful search', () => {
  jest.mocked(useRestaurantSearch).mockReturnValue(state({ restaurants: [] }));
  renderPage();
  expect(screen.getByText('No restaurants matched that search')).toBeInTheDocument();
});

it('offers recovery when filters hide every match', async () => {
  const search = state({ filters: { cuisine: 'Seafood', priceRange: '' } });
  jest.mocked(useRestaurantSearch).mockReturnValue(search);
  renderPage();
  expect(screen.getByText('Filters removed every match')).toBeInTheDocument();
  await userEvent.setup().click(screen.getByRole('button', { name: 'Clear results' }));
  expect(search.clearResults).toHaveBeenCalledTimes(1);
});
