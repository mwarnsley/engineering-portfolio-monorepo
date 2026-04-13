import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { notifications } from '@mantine/notifications';
import { DiscussionBoard } from '../../components/discussion-board';
import { renderWithProviders } from '../setup/render';
import { createMeeting } from '../setup/fixtures';

describe('components/DiscussionBoard', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('shows an empty helper when there are no meetings', () => {
    renderWithProviders(<DiscussionBoard meetings={[]} />);

    expect(screen.getByText(/Create a meeting first/)).toBeInTheDocument();
  });

  it('renders meeting threads from props', () => {
    renderWithProviders(<DiscussionBoard meetings={[createMeeting()]} />);

    expect(screen.getAllByText('Launch planning').length).toBeGreaterThan(0);
  });

  it('shows a success notification after posting a comment', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValue({
      json: async () => ({
        meeting: createMeeting({
          comments: [
            ...createMeeting().comments,
            {
              id: 'comment-2',
              author: 'Marcus',
              createdAt: '2026-04-10T13:00:00.000Z',
              message: 'New decision',
              sentiment: 'decision',
            },
          ],
        }),
      }),
      ok: true,
    });

    renderWithProviders(<DiscussionBoard meetings={[createMeeting()]} />);

    await user.type(screen.getByLabelText('Author'), 'Marcus');
    await user.type(screen.getByLabelText('Message'), 'We have a final decision to share.');
    await user.click(screen.getByRole('button', { name: 'Post update' }));

    await waitFor(() =>
      expect(notifications.show).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Comment posted' })
      )
    );
  });

  it('shows a failure notification when posting fails', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValue({
      json: async () => ({ error: 'Nope' }),
      ok: false,
    });

    renderWithProviders(<DiscussionBoard meetings={[createMeeting()]} />);

    await user.type(screen.getByLabelText('Author'), 'Marcus');
    await user.type(screen.getByLabelText('Message'), 'We have a final decision to share.');
    await user.click(screen.getByRole('button', { name: 'Post update' }));

    await waitFor(() =>
      expect(notifications.show).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Comment failed' })
      )
    );
  });
});
