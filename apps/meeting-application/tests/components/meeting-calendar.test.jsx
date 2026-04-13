const fullCalendarMock = jest.fn((props) => {
  global.calendarProps = props;
  return <div data-testid="full-calendar" />;
});

jest.mock('@fullcalendar/interaction', () => ({ __esModule: true, default: {} }));
jest.mock('@fullcalendar/daygrid', () => ({ __esModule: true, default: {} }));
jest.mock('@fullcalendar/timegrid', () => ({ __esModule: true, default: {} }));

jest.mock('@fullcalendar/react', () => ({
  __esModule: true,
  default: (props) => fullCalendarMock(props),
}));

import { screen } from '@testing-library/react';
import { MeetingCalendar } from '../../components/meeting-calendar';
import { renderWithProviders } from '../setup/render';
import { createMeeting } from '../setup/fixtures';

describe('components/MeetingCalendar', () => {
  it('passes mapped events into FullCalendar', () => {
    renderWithProviders(
      <MeetingCalendar
        meetings={[createMeeting()]}
        onSelectMeeting={jest.fn()}
        onSelectTimeRange={jest.fn()}
      />
    );

    expect(global.calendarProps.events[0].title).toBe('Launch planning');
  });

  it('forwards selected time ranges', () => {
    const onSelectTimeRange = jest.fn();

    renderWithProviders(
      <MeetingCalendar
        meetings={[createMeeting()]}
        onSelectMeeting={jest.fn()}
        onSelectTimeRange={onSelectTimeRange}
      />
    );

    global.calendarProps.select({ endStr: 'end', startStr: 'start' });

    expect(onSelectTimeRange).toHaveBeenCalledWith({ end: 'end', start: 'start' });
  });

  it('forwards event clicks by meeting id', () => {
    const onSelectMeeting = jest.fn();

    renderWithProviders(
      <MeetingCalendar
        meetings={[createMeeting()]}
        onSelectMeeting={onSelectMeeting}
        onSelectTimeRange={jest.fn()}
      />
    );

    global.calendarProps.eventClick({ event: { id: 'meeting-1' } });

    expect(onSelectMeeting).toHaveBeenCalledWith('meeting-1');
  });

  it('renders the calendar shell', () => {
    renderWithProviders(
      <MeetingCalendar
        meetings={[createMeeting()]}
        onSelectMeeting={jest.fn()}
        onSelectTimeRange={jest.fn()}
      />
    );

    expect(screen.getByTestId('full-calendar')).toBeInTheDocument();
  });
});
