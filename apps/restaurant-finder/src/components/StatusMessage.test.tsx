import { render, screen } from '@testing-library/react';

import { StatusMessage } from './StatusMessage';

describe('StatusMessage', () => {
  it('renders the title', () => {
    render(
      <StatusMessage description="API request failed" title="Search unavailable" tone="danger" />
    );

    expect(screen.getByText('Search unavailable')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(
      <StatusMessage description="API request failed" title="Search unavailable" tone="danger" />
    );

    expect(screen.getByText('API request failed')).toBeInTheDocument();
  });
});
