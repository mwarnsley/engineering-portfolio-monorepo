jest.mock('next/dynamic', () => (loader) => {
  const React = require('react');
  const Calendar = React.lazy(async () => ({ default: await loader() }));
  return function CalendarLoader(props) {
    return (
      <React.Suspense fallback={<span>Loading calendar</span>}>
        <Calendar {...props} />
      </React.Suspense>
    );
  };
});
jest.mock('../../components/meeting-calendar', () => ({
  MeetingCalendar: ({ onSelectMeeting, onSelectTimeRange }) => (
    <div>
      <button onClick={() => onSelectMeeting('meeting-1')}>Select calendar meeting</button>
      <button onClick={() => onSelectMeeting('removed-meeting')}>
        Select stale calendar meeting
      </button>
      <button
        onClick={() =>
          onSelectTimeRange({ start: '2026-04-12T14:00:00.000Z', end: '2026-04-12T15:00:00.000Z' })
        }
      >
        Select time block
      </button>
    </div>
  ),
}));

jest.mock('@mantine/dates', () => ({
  DateTimePicker: ({ error, label, onChange, value }) => (
    <input
      aria-label={label}
      data-error={error}
      onChange={(event) => onChange?.(event.target.value ? new Date(event.target.value) : null)}
      value={value instanceof Date ? value.toISOString() : ''}
    />
  ),
}));

import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { notifications } from '@mantine/notifications';
import { AppProviders } from '../../components/providers';
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

describe('dashboard interactions and validation', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  const secondMeeting = () => createMeeting({ id: 'meeting-2', title: 'Team retrospective' });
  async function editFirst(user) {
    await user.click(screen.getByRole('button', { name: 'Edit Launch planning' }));
  }

  it('loads and updates one meeting without replacing another', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ meeting: createMeeting({ title: 'Updated planning' }) }),
    });
    renderWithProviders(
      <MeetingDashboard
        {...createDashboardData({ meetings: [createMeeting(), secondMeeting()] })}
      />
    );
    await editFirst(user);
    expect(screen.getByLabelText('Meeting title')).toHaveValue('Launch planning');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/meetings/meeting-1',
        expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining('2026-04-10T14:00:00.000Z'),
        })
      )
    );
    expect(screen.getByText('Team retrospective')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Updated planning' })).toBeInTheDocument();
  });

  it('resets an edited meeting back to the new meeting composer', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MeetingDashboard {...createDashboardData()} />);
    await editFirst(user);
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByLabelText('Meeting title')).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Create meeting' })).toBeInTheDocument();
  });

  it('validates required text before sending a meeting', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MeetingDashboard {...createDashboardData()} />);
    await user.click(screen.getByRole('button', { name: 'Create meeting' }));
    expect(screen.getByText('Give the meeting a more descriptive title.')).toBeInTheDocument();
    expect(screen.getByText('Write a short summary of the meeting purpose.')).toBeInTheDocument();
    expect(screen.getByText('Add a host or owner name.')).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it.each([
    ['Start time', '', 'Choose a start time.'],
    ['End time', '', 'Choose an end time.'],
    ['End time', '2026-04-10T13:00:00.000Z', 'End time must be after the start time.'],
  ])('validates %s value %s', async (label, value, error) => {
    const user = userEvent.setup();
    renderWithProviders(<MeetingDashboard {...createDashboardData()} />);
    await editFirst(user);
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
    await user.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(global.fetch).not.toHaveBeenCalled();
    // The date widget stand-in exposes Mantine's validation message through its error prop.
    expect(screen.getByLabelText(label)).toHaveAttribute('data-error', error);
  });

  it.each([
    [{}, 'Unable to save the meeting.'],
    [{ error: 'Conflict detected' }, 'Conflict detected'],
  ])('shows a save error and preserves the editable input: %j', async (body, message) => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValue({ ok: false, json: async () => body });
    renderWithProviders(<MeetingDashboard {...createDashboardData()} />);
    await editFirst(user);
    await user.click(screen.getByRole('button', { name: 'Save changes' }));
    await waitFor(() =>
      expect(notifications.show).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Save failed', message })
      )
    );
    expect(screen.getByLabelText('Meeting title')).toHaveValue('Launch planning');
    expect(screen.getByRole('button', { name: 'Save changes' })).not.toBeDisabled();
  });

  it('handles a rejected save without a message', async () => {
    const user = userEvent.setup();
    global.fetch.mockRejectedValue({});
    renderWithProviders(<MeetingDashboard {...createDashboardData()} />);
    await editFirst(user);
    await user.click(screen.getByRole('button', { name: 'Save changes' }));
    await waitFor(() =>
      expect(notifications.show).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Unable to save the meeting.' })
      )
    );
  });

  it.each([{ error: 'Permission denied' }, {}])(
    'keeps a meeting after a rejected delete: %j',
    async (body) => {
      const user = userEvent.setup();
      global.fetch.mockResolvedValue({ ok: false, json: async () => body });
      renderWithProviders(<MeetingDashboard {...createDashboardData()} />);
      await user.click(screen.getByRole('button', { name: 'Delete Launch planning' }));
      await waitFor(() =>
        expect(notifications.show).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Delete failed',
            message: body.error ?? 'Unable to delete the meeting.',
          })
        )
      );
      expect(screen.getByRole('button', { name: 'Delete Launch planning' })).not.toBeDisabled();
    }
  );

  it('selects the remaining meeting and resets the composer after deleting the edited meeting', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValue({ ok: true });
    renderWithProviders(
      <MeetingDashboard
        {...createDashboardData({ meetings: [createMeeting(), secondMeeting()] })}
      />
    );
    await editFirst(user);
    await user.click(screen.getByRole('button', { name: 'Delete Launch planning' }));
    expect(await screen.findByRole('heading', { name: 'Team retrospective' })).toBeInTheDocument();
    expect(screen.getByLabelText('Meeting title')).toHaveValue('');
    expect(global.mockRefresh).toHaveBeenCalled();
  });

  it('preserves the selected meeting when deleting a different meeting', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValue({ ok: true });
    renderWithProviders(
      <MeetingDashboard
        {...createDashboardData({ meetings: [createMeeting(), secondMeeting()] })}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Delete Team retrospective' }));
    await waitFor(() => expect(screen.queryByText('Team retrospective')).not.toBeInTheDocument());
    expect(screen.getByRole('heading', { name: 'Launch planning' })).toBeInTheDocument();
  });

  it('selects a pipeline meeting and preserves it across refreshed props', async () => {
    const user = userEvent.setup();
    const { rerender } = renderWithProviders(
      <MeetingDashboard
        {...createDashboardData({ meetings: [createMeeting(), secondMeeting()] })}
      />
    );
    await user.click(screen.getByText('Team retrospective'));
    rerender(
      <AppProviders>
        <MeetingDashboard
          {...createDashboardData({ meetings: [createMeeting(), secondMeeting()] })}
        />
      </AppProviders>
    );
    expect(screen.getByRole('heading', { name: 'Team retrospective' })).toBeInTheDocument();
    rerender(
      <AppProviders>
        <MeetingDashboard {...createDashboardData({ meetings: [] })} />
      </AppProviders>
    );
    expect(screen.getByText('No meetings yet')).toBeInTheDocument();
  });

  it('displays empty logistics and a database failure message', () => {
    renderWithProviders(
      <MeetingDashboard
        {...createDashboardData({
          error: 'Database unavailable',
          meetings: [createMeeting({ attendees: [], actionItems: [], comments: [] })],
        })}
      />
    );
    expect(screen.getByText('Database unavailable')).toBeInTheDocument();
    expect(screen.getByText('None yet')).toBeInTheDocument();
    expect(screen.getByText('No action items attached yet.')).toBeInTheDocument();
    expect(screen.getByText(/No comments yet/)).toBeInTheDocument();
  });

  it('opens an existing calendar meeting for editing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MeetingDashboard {...createDashboardData()} />);
    await user.click(screen.getByText('Calendar planner'));
    await user.click(await screen.findByRole('button', { name: 'Select calendar meeting' }));
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument();
    expect(screen.getByLabelText('Meeting title')).toHaveValue('Launch planning');
  });

  it('ignores a calendar selection for a removed meeting and can return to the form', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MeetingDashboard {...createDashboardData()} />);
    await user.click(screen.getByText('Calendar planner'));
    await user.click(await screen.findByRole('button', { name: 'Select stale calendar meeting' }));
    expect(screen.getByRole('button', { name: 'Back to form' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Back to form' }));
    expect(screen.getByRole('button', { name: 'Create meeting' })).toBeInTheDocument();
  });

  it('prefills a calendar time block for a new meeting', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MeetingDashboard {...createDashboardData()} />);
    await user.click(screen.getByText('Calendar planner'));
    await user.click(await screen.findByRole('button', { name: 'Select time block' }));
    expect(screen.getByLabelText('Start time')).toHaveValue('2026-04-12T14:00:00.000Z');
    expect(screen.getByLabelText('End time')).toHaveValue('2026-04-12T15:00:00.000Z');
    expect(notifications.show).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Calendar slot selected' })
    );
  });

  it('inserts a new meeting in chronological pipeline order', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        meeting: createMeeting({
          id: 'early',
          title: 'Earlier meeting',
          startTime: '2026-04-09T10:00:00.000Z',
        }),
      }),
    });
    renderWithProviders(<MeetingDashboard {...createDashboardData()} />);
    await user.type(screen.getByLabelText('Meeting title'), 'Earlier meeting');
    await user.type(screen.getByLabelText('Summary'), 'A useful meeting summary');
    await user.type(screen.getByLabelText('Meeting owner'), 'Ari');
    await user.click(screen.getByRole('button', { name: 'Create meeting' }));
    await screen.findByRole('button', { name: 'Edit Earlier meeting' });
    expect(
      screen
        .getAllByRole('button', { name: /^Edit / })
        .map((button) => button.getAttribute('aria-label'))
    ).toEqual(['Edit Earlier meeting', 'Edit Launch planning']);
  });
});
