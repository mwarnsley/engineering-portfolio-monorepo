import { render, screen } from '@testing-library/react';
import { AppProviders } from '../../components/providers';

describe('components/AppProviders', () => {
  it('renders child content', () => {
    render(
      <AppProviders>
        <div>Child content</div>
      </AppProviders>
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders the notifications root', () => {
    render(
      <AppProviders>
        <div>Child content</div>
      </AppProviders>
    );

    expect(screen.getByTestId('notifications-root')).toBeInTheDocument();
  });
});
