import { render, screen } from '@testing-library/react';

import { LoadingState } from './LoadingState';

describe('LoadingState', () => {
  it('renders six loading cards', () => {
    render(<LoadingState />);

    expect(screen.getAllByTestId('loading-card')).toHaveLength(6);
  });
});
