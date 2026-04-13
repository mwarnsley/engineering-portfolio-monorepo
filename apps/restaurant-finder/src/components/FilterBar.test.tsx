import { render, screen } from '@testing-library/react';

import { FilterBar } from './FilterBar';

describe('FilterBar', () => {
  it('renders the cuisine filter label', () => {
    render(
      <FilterBar
        filters={{ cuisine: '', priceRange: '' }}
        options={{ cuisines: ['American'], priceRanges: ['$$'] }}
        onChange={jest.fn()}
      />
    );

    expect(screen.getAllByText('Cuisine').length).toBeGreaterThan(0);
  });

  it('renders the price range filter label', () => {
    render(
      <FilterBar
        filters={{ cuisine: '', priceRange: '' }}
        options={{ cuisines: ['American'], priceRanges: ['$$'] }}
        onChange={jest.fn()}
      />
    );

    expect(screen.getAllByText('Price range').length).toBeGreaterThan(0);
  });
});
