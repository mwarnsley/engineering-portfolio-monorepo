jest.mock('../../lib/meetings', () => ({
  getMeetingById: jest.fn(),
}));

import { screen } from '@testing-library/react';
import MeetingDetailPage, { dynamic } from '../../app/meetings/[id]/page';
import { getMeetingById } from '../../lib/meetings';
import { renderWithProviders } from '../setup/render';
import { createMeeting } from '../setup/fixtures';

describe('app/meetings/[id]/page', () => {
  it('exports a dynamic page mode', () => {
    expect(dynamic).toBe('force-dynamic');
  });

  it('renders a not found state when the meeting is missing', async () => {
    getMeetingById.mockResolvedValue(null);

    renderWithProviders(await MeetingDetailPage({ params: Promise.resolve({ id: 'missing' }) }));

    expect(screen.getByText('Meeting not found')).toBeInTheDocument();
  });

  it('renders meeting details when a meeting exists', async () => {
    getMeetingById.mockResolvedValue(createMeeting());

    renderWithProviders(await MeetingDetailPage({ params: Promise.resolve({ id: 'meeting-1' }) }));

    expect(screen.getByText('Launch planning')).toBeInTheDocument();
  });
});
