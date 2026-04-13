import { screen } from '@testing-library/react';
import { AppFrame } from '../../components/app-frame';
import { renderWithProviders } from '../setup/render';

describe('components/AppFrame', () => {
  it('renders the Meeting Hub brand', () => {
    renderWithProviders(
      <AppFrame>
        <div>Body</div>
      </AppFrame>
    );

    expect(screen.getByText('Meeting Hub')).toBeInTheDocument();
  });

  it('renders primary navigation links', () => {
    renderWithProviders(
      <AppFrame>
        <div>Body</div>
      </AppFrame>
    );

    expect(screen.getAllByRole('link', { name: 'Overview' }).length).toBeGreaterThan(0);
  });

  it('marks the active route as filled', () => {
    global.mockPathname = '/discuss';

    renderWithProviders(
      <AppFrame>
        <div>Body</div>
      </AppFrame>
    );

    expect(screen.getAllByRole('link', { name: 'Discuss' })[0]).toHaveAttribute(
      'data-variant',
      'filled'
    );
  });
});
