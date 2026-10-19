import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SearchHero } from './SearchHero';

describe('SearchHero', () => {
  it('renders the main heading', () => {
    render(
      <SearchHero
        apiHealth={{
          configured: true,
          reachable: true,
          host: 'api.geoapify.com',
          message: 'Connected',
          status: 'ready',
        }}
        isLoading={false}
        onSearch={jest.fn()}
        onSearchNearby={jest.fn()}
      />
    );

    expect(
      screen.getByText(
        /discover great restaurants with a search experience that feels polished and useful/i
      )
    ).toBeInTheDocument();
  });

  it('submits a city search', async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn().mockResolvedValue(undefined);

    render(
      <SearchHero
        apiHealth={{
          configured: true,
          reachable: true,
          host: 'api.geoapify.com',
          message: 'Connected',
          status: 'ready',
        }}
        isLoading={false}
        onSearch={onSearch}
        onSearchNearby={jest.fn()}
      />
    );

    await user.type(screen.getByRole('textbox', { name: /search restaurants/i }), 'Chicago');
    await user.click(screen.getByRole('button', { name: 'Search now' }));

    expect(onSearch).toHaveBeenCalledWith({ mode: 'city', query: 'Chicago' });
  });

  it('submits a nearby search', async () => {
    const user = userEvent.setup();
    const onSearchNearby = jest.fn().mockResolvedValue(undefined);

    render(
      <SearchHero
        apiHealth={{
          configured: true,
          reachable: true,
          host: 'api.geoapify.com',
          message: 'Connected',
          status: 'ready',
        }}
        isLoading={false}
        onSearch={jest.fn()}
        onSearchNearby={onSearchNearby}
      />
    );

    await user.click(screen.getByRole('button', { name: /use my location/i }));

    expect(onSearchNearby).toHaveBeenCalled();
  });
});

const healthy = {
  configured: true,
  reachable: true,
  host: 'api.example.com',
  message: 'Connected',
  status: 'ready' as const,
};

it('switches between zip and city modes when submitting', async () => {
  const user = userEvent.setup();
  const onSearch = jest.fn().mockResolvedValue(undefined);
  render(
    <SearchHero
      apiHealth={healthy}
      isLoading={false}
      onSearch={onSearch}
      onSearchNearby={jest.fn()}
    />
  );
  await user.click(screen.getByRole('button', { name: 'Zip code' }));
  await user.type(screen.getByRole('textbox', { name: 'Search restaurants' }), '10012');
  await user.click(screen.getByRole('button', { name: 'Search now' }));
  expect(onSearch).toHaveBeenLastCalledWith({ mode: 'zip', query: '10012' });
  await user.click(screen.getByRole('button', { name: 'City or area' }));
  expect(screen.getByText('Search by city or area')).toBeInTheDocument();
});

it.each([
  ['Indianapolis', 'city'],
  ['Chicago', 'city'],
  ['10012', 'zip'],
])('searches the %s preset and updates the query', async (query, mode) => {
  const onSearch = jest.fn().mockResolvedValue(undefined);
  render(
    <SearchHero
      apiHealth={healthy}
      isLoading={false}
      onSearch={onSearch}
      onSearchNearby={jest.fn()}
    />
  );
  await userEvent.setup().click(screen.getByRole('button', { name: `Try ${query}` }));
  expect(onSearch).toHaveBeenCalledWith({ mode, query });
  expect(screen.getByRole('textbox', { name: 'Search restaurants' })).toHaveValue(query);
});

it.each([
  { status: 'checking' as const, reachable: null, title: 'Checking the upstream API' },
  { status: 'error' as const, reachable: false, title: 'The API needs attention' },
])('explains the $status API status', ({ status, reachable, title }) => {
  render(
    <SearchHero
      apiHealth={{ ...healthy, status, reachable, host: '' }}
      isLoading={false}
      onSearch={jest.fn()}
      onSearchNearby={jest.fn()}
    />
  );
  expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
  expect(screen.queryByText(/^Host:/)).not.toBeInTheDocument();
});
