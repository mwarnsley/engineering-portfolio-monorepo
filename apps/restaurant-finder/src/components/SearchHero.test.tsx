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
