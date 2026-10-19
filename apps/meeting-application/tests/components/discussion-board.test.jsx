import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { notifications } from '@mantine/notifications';
import { AppProviders } from '../../components/providers';
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

describe('discussion selection and validation', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('rejects incomplete comment fields before making a request', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DiscussionBoard meetings={[createMeeting()]} />);
    await user.click(screen.getByRole('button', { name: 'Post update' }));
    expect(screen.getByText('Add your name.')).toBeInTheDocument();
    expect(screen.getByText('Add a little more context to the comment.')).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('does not submit a valid comment when no meeting is selected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DiscussionBoard meetings={[]} />);
    await user.type(screen.getByLabelText('Author'), 'Ari');
    await user.type(screen.getByLabelText('Message'), 'A useful update');
    await user.click(screen.getByRole('button', { name: 'Post update' }));
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('shows a generic error if the API returns no error message', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValue({ ok: false, json: async () => ({}) });
    renderWithProviders(<DiscussionBoard meetings={[createMeeting()]} />);
    await user.type(screen.getByLabelText('Author'), 'Ari');
    await user.type(screen.getByLabelText('Message'), 'A useful update');
    await user.click(screen.getByRole('button', { name: 'Post update' }));
    await waitFor(() =>
      expect(notifications.show).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Unable to post the comment.' })
      )
    );
    expect(screen.getByRole('button', { name: 'Post update' })).not.toBeDisabled();
  });

  it('posts to the selected thread while preserving other meetings', async () => {
    const user = userEvent.setup();
    const second = createMeeting({ id: 'second', title: 'Retrospective', comments: [] });
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        meeting: {
          ...second,
          comments: [
            {
              id: 'new',
              author: 'Ari',
              createdAt: '2026-04-10T14:00:00.000Z',
              message: 'New decision',
              sentiment: 'decision',
            },
          ],
        },
      }),
    });
    renderWithProviders(<DiscussionBoard meetings={[createMeeting(), second]} />);
    await user.click(screen.getByText('Retrospective'));
    expect(screen.getByText('No discussion yet')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Author'), 'Ari');
    await user.type(screen.getByLabelText('Message'), 'New decision');
    await user.click(screen.getByRole('button', { name: 'Post update' }));
    expect(await screen.findByText('New decision')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/meetings/second/comments',
      expect.objectContaining({ method: 'POST' })
    );
    await user.click(screen.getByText('Launch planning'));
    expect(screen.getByText('Looks good to me.')).toBeInTheDocument();
  });

  it('preserves selection on refresh and falls back when the selected meeting disappears', async () => {
    const user = userEvent.setup();
    const first = createMeeting();
    const second = createMeeting({ id: 'second', title: 'Retrospective', comments: [] });
    const { rerender } = renderWithProviders(<DiscussionBoard meetings={[first, second]} />);
    await user.click(screen.getByText('Retrospective'));
    rerender(
      <AppProviders>
        <DiscussionBoard meetings={[{ ...first }, { ...second }]} />
      </AppProviders>
    );
    expect(screen.getByRole('heading', { name: 'Retrospective' })).toBeInTheDocument();
    rerender(
      <AppProviders>
        <DiscussionBoard meetings={[first]} />
      </AppProviders>
    );
    expect(screen.getByRole('heading', { name: 'Launch planning' })).toBeInTheDocument();
    rerender(
      <AppProviders>
        <DiscussionBoard meetings={[]} />
      </AppProviders>
    );
    expect(screen.getByText('No meetings yet')).toBeInTheDocument();
  });
});
