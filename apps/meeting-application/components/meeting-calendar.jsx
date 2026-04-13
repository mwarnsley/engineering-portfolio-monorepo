'use client';

import { useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

export function MeetingCalendar({ meetings, onSelectMeeting, onSelectTimeRange }) {
  const events = useMemo(
    () =>
      meetings.map((meeting) => ({
        id: meeting.id,
        end: meeting.endTime,
        start: meeting.startTime,
        title: meeting.title,
      })),
    [meetings]
  );

  return (
    <div className="calendarShell">
      <FullCalendar
        allDaySlot={false}
        editable={false}
        events={events}
        headerToolbar={{
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay',
          start: 'today prev,next',
        }}
        height={720}
        initialView="timeGridWeek"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        selectable
        select={(selection) =>
          onSelectTimeRange({
            end: selection.endStr,
            start: selection.startStr,
          })
        }
        eventClick={(info) => onSelectMeeting(info.event.id)}
      />
    </div>
  );
}
