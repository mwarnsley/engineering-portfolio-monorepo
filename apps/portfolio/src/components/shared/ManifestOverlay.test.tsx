import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders, screen } from '@/test/test-utils';
import { ManifestOverlay } from '@/components/shared/ManifestOverlay';

describe('résumé profile', () => {
  it('downloads the current résumé with its correct filename', () => {
    renderWithProviders(<ManifestOverlay isOpen onClose={vi.fn()} />);
    const link = screen.getByRole('link', { name: 'Download résumé (PDF)' });
    expect(link).toHaveAttribute('href', '/resume.pdf');
    expect(link).toHaveAttribute('download', 'Marcus Warnsley - Senior Frontend Engineer.pdf');
  });

  it('includes education from the current résumé', () => {
    renderWithProviders(<ManifestOverlay isOpen onClose={vi.fn()} />);
    expect(
      screen.getByText('Bachelor of Science in Business Information Systems')
    ).toBeInTheDocument();
    expect(screen.getByText('Indiana Wesleyan University')).toBeInTheDocument();
    expect(screen.getByText('2015 · Marion, IN · GPA: 3.7/4.0')).toBeInTheDocument();
  });
});
