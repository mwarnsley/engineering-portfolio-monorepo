import { describe, expect, it } from 'vitest';
import { renderWithProviders, screen, within } from '@/test';
import { MissionHistory } from './MissionHistory';

const getEntries = () =>
  within(screen.getByRole('region', { name: 'Career Experience' }))
    .getAllByRole('listitem')
    .filter((item) => item.parentElement?.tagName === 'OL');

describe('MissionHistory', () => {
  it('should render a labelled Career Experience region', () => {
    renderWithProviders(<MissionHistory />);
    expect(
      screen.getByRole('heading', { name: 'Career Experience', level: 2 })
    ).toBeInTheDocument();
  });

  it('should list Understood.org first as the current contract role', () => {
    renderWithProviders(<MissionHistory />);
    const [first] = getEntries();
    expect(first).toHaveTextContent('Senior Frontend Engineer (Contractor) · Understood.org');
    expect(first).toHaveTextContent('August 2026 – Present');
    expect(within(first).getByText('Current')).toBeInTheDocument();
  });

  it('should date MilliporeSigma from October 2023 to June 2026', () => {
    renderWithProviders(<MissionHistory />);
    const [, second] = getEntries();
    expect(second).toHaveTextContent('MilliporeSigma');
    expect(second).toHaveTextContent('October 2023 – June 2026');
  });

  it('should mark exactly one role as current', () => {
    renderWithProviders(<MissionHistory />);
    expect(screen.getAllByText('Current')).toHaveLength(1);
  });

  it.each(['Next.js 16 (Turbopack)', 'Statsig feature flagging', 'Playwright + axe-core'])(
    'should list the Understood.org highlight %s',
    (highlight) => {
      renderWithProviders(<MissionHistory />);
      const highlights = screen.getByRole('list', { name: 'Understood.org highlights' });
      expect(within(highlights).getByText(highlight)).toBeInTheDocument();
    }
  );
});
