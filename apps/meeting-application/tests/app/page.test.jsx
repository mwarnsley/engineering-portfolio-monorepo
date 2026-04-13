jest.mock('../../lib/meetings', () => ({
  getDashboardData: jest.fn(),
}));

jest.mock('../../components/meeting-dashboard', () => ({
  MeetingDashboard: (props) => <div data-props={JSON.stringify(props)}>Dashboard</div>,
}));

import { render, screen } from '@testing-library/react';
import HomePage, { dynamic } from '../../app/page';
import { getDashboardData } from '../../lib/meetings';
import { createDashboardData } from '../setup/fixtures';

describe('app/page', () => {
  it('exports a dynamic page mode', () => {
    expect(dynamic).toBe('force-dynamic');
  });

  it('passes dashboard data into the dashboard component', async () => {
    getDashboardData.mockResolvedValue(createDashboardData());

    render(await HomePage());

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
