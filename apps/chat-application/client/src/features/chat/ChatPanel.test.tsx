import { act, fireEvent, render, screen } from '@testing-library/react';
import { ChatPanel } from './ChatPanel';

const config = { userId: 'user-a' as const, title: 'User A', accentClassName: 'text-sky-300' };
const setup = (isConnected = true) => {
  const onSendMessage = vi.fn();
  const onTypingChange = vi.fn();
  const view = render(
    <ChatPanel
      config={config}
      messages={[]}
      isConnected={isConnected}
      typingUsers={[]}
      onSendMessage={onSendMessage}
      onTypingChange={onTypingChange}
    />
  );
  return {
    ...view,
    onSendMessage,
    onTypingChange,
    input: screen.getByRole('textbox', { name: 'User A message input' }),
  };
};

afterEach(() => vi.useRealTimers());

it('resets typing only after 1200ms of inactivity', () => {
  vi.useFakeTimers();
  const { input, onTypingChange } = setup();
  fireEvent.change(input, { target: { value: 'Hello' } });
  act(() => vi.advanceTimersByTime(1000));
  fireEvent.change(input, { target: { value: 'Hello there' } });
  act(() => vi.advanceTimersByTime(1199));
  expect(onTypingChange.mock.calls).toEqual([
    ['user-a', true],
    ['user-a', true],
  ]);
  act(() => vi.advanceTimersByTime(1));
  expect(onTypingChange).toHaveBeenLastCalledWith('user-a', false);
});

it('cancels scheduled typing updates after unmount', () => {
  vi.useFakeTimers();
  const { input, onTypingChange, unmount } = setup();
  fireEvent.change(input, { target: { value: 'Hello' } });
  unmount();
  act(() => vi.advanceTimersByTime(1200));
  expect(onTypingChange.mock.calls).toEqual([['user-a', true]]);
});

it('sends on Enter, clears the draft, and cancels pending typing updates', () => {
  vi.useFakeTimers();
  const { input, onSendMessage, onTypingChange } = setup();
  fireEvent.change(input, { target: { value: 'Hello' } });
  fireEvent.keyDown(input, { key: 'Enter' });
  act(() => vi.advanceTimersByTime(1200));
  expect(onSendMessage).toHaveBeenCalledWith('user-a', 'Hello');
  expect(input).toHaveValue('');
  expect(onTypingChange.mock.calls).toEqual([
    ['user-a', true],
    ['user-a', false],
  ]);
});

it('preserves the draft on Shift+Enter and ordinary keys', () => {
  const { input, onSendMessage } = setup();
  fireEvent.change(input, { target: { value: 'First line' } });
  fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
  fireEvent.keyDown(input, { key: 'ArrowLeft' });
  expect(onSendMessage).not.toHaveBeenCalled();
  expect(input).toHaveValue('First line');
});

it('rejects whitespace-only drafts and reports no typing', () => {
  const { input, onSendMessage, onTypingChange } = setup();
  fireEvent.change(input, { target: { value: '   ' } });
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(onSendMessage).not.toHaveBeenCalled();
  expect(onTypingChange).toHaveBeenCalledWith('user-a', false);
  expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
});

it('disables the send button for a disconnected panel with a draft', () => {
  const { input } = setup(false);
  fireEvent.change(input, { target: { value: 'Queued draft' } });
  expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
});

it('stops typing on blur', () => {
  const { input, onTypingChange } = setup();
  fireEvent.change(input, { target: { value: 'Hello' } });
  fireEvent.blur(input);
  expect(onTypingChange).toHaveBeenLastCalledWith('user-a', false);
});
