import { render, screen } from '@testing-library/react';

import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders the title', () => {
    render(<EmptyState description="Search soon" title="Nothing here yet" />);

    expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<EmptyState description="Search soon" title="Nothing here yet" />);

    expect(screen.getByText('Search soon')).toBeInTheDocument();
  });

  it('renders nested content', () => {
    render(
      <EmptyState description="Search soon" title="Nothing here yet">
        <button type="button">Try again</button>
      </EmptyState>
    );

    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});
