jest.mock('../../lib/meetings', () => ({
  getDashboardData: jest.fn(),
}));

jest.mock('../../components/discussion-board', () => ({
  DiscussionBoard: ({ meetings }) => <div data-count={meetings.length}>Discuss board</div>,
}));

import { render, screen } from '@testing-library/react';
import DiscussPage, { dynamic } from '../../app/discuss/page';
import { getDashboardData } from '../../lib/meetings';
import { createDashboardData } from '../setup/fixtures';

describe('app/discuss/page', () => {
  it('exports a dynamic page mode', () => {
    expect(dynamic).toBe('force-dynamic');
  });

  it('passes meetings into the discussion board', async () => {
    getDashboardData.mockResolvedValue(createDashboardData());

    render(await DiscussPage());

    expect(screen.getByText('Discuss board')).toBeInTheDocument();
  });
});
