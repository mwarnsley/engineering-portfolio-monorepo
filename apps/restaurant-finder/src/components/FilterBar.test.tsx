import userEvent from '@testing-library/user-event';
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

it.each([
  ['Cuisine filter', 'Seafood', { cuisine: 'Seafood', priceRange: '$$' }],
  ['Price range filter', '$$$', { cuisine: 'American', priceRange: '$$$' }],
])('updates %s while preserving the other filter', async (label, value, expected) => {
  const onChange = jest.fn();
  render(
    <FilterBar
      filters={{ cuisine: 'American', priceRange: '$$' }}
      options={{ cuisines: ['American', 'Seafood'], priceRanges: ['$$', '$$$'] }}
      onChange={onChange}
    />
  );
  await userEvent.setup().selectOptions(screen.getByRole('combobox', { name: label }), value);
  expect(onChange).toHaveBeenCalledWith(expected);
});

it('resets both filters', async () => {
  const onChange = jest.fn();
  render(
    <FilterBar
      filters={{ cuisine: 'American', priceRange: '$$' }}
      options={{ cuisines: ['American'], priceRanges: ['$$'] }}
      onChange={onChange}
    />
  );
  await userEvent.setup().click(screen.getByRole('button', { name: 'Reset filters' }));
  expect(onChange).toHaveBeenCalledWith({ cuisine: '', priceRange: '' });
});
