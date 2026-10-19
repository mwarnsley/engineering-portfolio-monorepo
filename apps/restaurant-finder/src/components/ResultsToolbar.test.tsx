import { render, screen } from '@testing-library/react';

import { ResultsToolbar } from './ResultsToolbar';

describe('ResultsToolbar', () => {
  it('renders the heading', () => {
    render(<ResultsToolbar hasSearched={false} isLoading={false} resultCount={0} totalCount={0} />);

    expect(screen.getByText('Restaurants worth exploring')).toBeInTheDocument();
  });

  it('shows the idle summary before search', () => {
    render(<ResultsToolbar hasSearched={false} isLoading={false} resultCount={0} totalCount={0} />);

    expect(screen.getByText('No search has been run yet.')).toBeInTheDocument();
  });

  it('shows the loading summary', () => {
    render(<ResultsToolbar hasSearched isLoading resultCount={0} totalCount={0} />);

    expect(screen.getByText('Refreshing restaurant data...')).toBeInTheDocument();
  });

  it('shows the result summary', () => {
    render(<ResultsToolbar hasSearched isLoading={false} resultCount={3} totalCount={4} />);

    expect(screen.getByText('3 visible results from 4 restaurants.')).toBeInTheDocument();
  });
});

it('uses singular labels for a single result and restaurant', () => {
  render(<ResultsToolbar hasSearched isLoading={false} resultCount={1} totalCount={1} />);
  expect(screen.getByText('1 visible result from 1 restaurant.')).toBeInTheDocument();
});
