import { describe, expect, it } from 'vitest';
import { renderWithProviders, screen } from '@/test';
import { Footer } from './Footer';

describe('Footer', () => {
  it('should show the current copyright year', () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText(`© ${new Date().getFullYear()} Marcus Warnsley`)).toBeInTheDocument();
  });

  it.each(['GitHub', 'LinkedIn'])('should label the %s link as opening a new tab', (name) => {
    renderWithProviders(<Footer />);
    expect(screen.getByRole('link', { name: `${name} (opens in a new tab)` })).toHaveAttribute(
      'target',
      '_blank'
    );
  });
});
