jest.mock('@mantine/dates', () => ({
  DateTimePicker: ({ label, onChange, value }) => (
    <input
      aria-label={label}
      onChange={(event) => onChange?.(new Date(event.target.value))}
      value={value instanceof Date ? value.toISOString() : ''}
    />
  ),
}));

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { notifications } from '@mantine/notifications';
import { MeetingDashboard } from '../../components/meeting-dashboard';
import { renderWithProviders } from '../setup/render';
import { createDashboardData, createMeeting } from '../setup/fixtures';

describe('components/MeetingDashboard', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('renders an empty state when there are no meetings', () => {
    renderWithProviders(
      <MeetingDashboard
        {...createDashboardData({
          meetings: [],
          metrics: {
            activeDiscussions: 0,
            thisWeekCount: 0,
            totalMeetings: 0,
            upcomingCount: 0,
          },
        })}
      />
    );

    expect(screen.getByText('No meetings yet')).toBeInTheDocument();
  });

  it('renders meetings from the server payload', () => {
    renderWithProviders(<MeetingDashboard {...createDashboardData()} />);

    expect(screen.getAllByText('Launch planning').length).toBeGreaterThan(0);
  });

  it('shows a success notification after creating a meeting', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValue({
      json: async () => ({ meeting: createMeeting({ id: 'meeting-2', title: 'New sync' }) }),
      ok: true,
    });

    renderWithProviders(
      <MeetingDashboard
        {...createDashboardData({
          meetings: [],
          metrics: {
            activeDiscussions: 0,
            thisWeekCount: 0,
            totalMeetings: 0,
            upcomingCount: 0,
          },
        })}
      />
    );

    await user.type(screen.getByLabelText('Meeting title'), 'New sync');
    await user.type(
      screen.getByLabelText('Summary'),
      'This summary is long enough to satisfy validation.'
    );
    await user.type(screen.getByLabelText('Meeting owner'), 'Marcus');
    await user.click(screen.getByRole('button', { name: 'Create meeting' }));

    await waitFor(() =>
      expect(notifications.show).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Meeting created' })
      )
    );
  });

  it('adds a created meeting to the pipeline immediately', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValue({
      json: async () => ({ meeting: createMeeting({ id: 'meeting-2', title: 'New sync' }) }),
      ok: true,
    });

    renderWithProviders(
      <MeetingDashboard
        {...createDashboardData({
          meetings: [],
          metrics: {
            activeDiscussions: 0,
            thisWeekCount: 0,
            totalMeetings: 0,
            upcomingCount: 0,
          },
        })}
      />
    );

    await user.type(screen.getByLabelText('Meeting title'), 'New sync');
    await user.type(
      screen.getByLabelText('Summary'),
      'This summary is long enough to satisfy validation.'
    );
    await user.type(screen.getByLabelText('Meeting owner'), 'Marcus');
    await user.click(screen.getByRole('button', { name: 'Create meeting' }));

    expect((await screen.findAllByText('New sync')).length).toBeGreaterThan(0);
  });

  it('shows a save failure notification when the request fails', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValue({
      json: async () => ({ error: 'Broken request' }),
      ok: false,
    });

    renderWithProviders(<MeetingDashboard {...createDashboardData({ meetings: [] })} />);

    await user.type(screen.getByLabelText('Meeting title'), 'New sync');
    await user.type(
      screen.getByLabelText('Summary'),
      'This summary is long enough to satisfy validation.'
    );
    await user.type(screen.getByLabelText('Meeting owner'), 'Marcus');
    await user.click(screen.getByRole('button', { name: 'Create meeting' }));

    await waitFor(() =>
      expect(notifications.show).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Save failed' })
      )
    );
  });

  it('shows a delete success notification', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValue({
      json: async () => ({ ok: true }),
      ok: true,
    });

    renderWithProviders(<MeetingDashboard {...createDashboardData()} />);

    await user.click(screen.getByLabelText('Delete Launch planning'));

    await waitFor(() =>
      expect(notifications.show).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Meeting deleted' })
      )
    );
  });
});
