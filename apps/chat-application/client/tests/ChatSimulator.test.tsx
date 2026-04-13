import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatSimulator } from '../src/features/chat/ChatSimulator';
import type { ChatMessage, TypingState } from '../src/types/chat';
import type { ChatSocket } from '../src/services/socket';
import * as socketService from '../src/services/socket';

interface MockSocketControls {
  connect: () => void;
  disconnect: () => void;
  emitMessage: (message: ChatMessage) => void;
  emitTyping: (state: TypingState) => void;
  emitReset: () => void;
}

function createMockSocket(): { socket: ChatSocket; controls: MockSocketControls } {
  const listeners = {
    connect: new Set<() => void>(),
    disconnect: new Set<() => void>(),
    message: new Set<(message: ChatMessage) => void>(),
    typing: new Set<(state: TypingState) => void>(),
    reset: new Set<() => void>(),
  };

  const socket: ChatSocket = {
    connect: vi.fn(),
    disconnect: vi.fn(),
    onConnect: (handler) => {
      listeners.connect.add(handler);
      return () => listeners.connect.delete(handler);
    },
    onDisconnect: (handler) => {
      listeners.disconnect.add(handler);
      return () => listeners.disconnect.delete(handler);
    },
    onMessage: (handler) => {
      listeners.message.add(handler);
      return () => listeners.message.delete(handler);
    },
    onTyping: (handler) => {
      listeners.typing.add(handler);
      return () => listeners.typing.delete(handler);
    },
    onReset: (handler) => {
      listeners.reset.add(handler);
      return () => listeners.reset.delete(handler);
    },
    emitMessage: vi.fn(),
    emitTyping: vi.fn(),
    emitReset: vi.fn(),
  };

  return {
    socket,
    controls: {
      connect: () => listeners.connect.forEach((handler) => handler()),
      disconnect: () => listeners.disconnect.forEach((handler) => handler()),
      emitMessage: (message) => listeners.message.forEach((handler) => handler(message)),
      emitTyping: (state) => listeners.typing.forEach((handler) => handler(state)),
      emitReset: () => listeners.reset.forEach((handler) => handler()),
    },
  };
}

describe('ChatSimulator', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders connection status after socket connect', async () => {
    const mock = createMockSocket();
    vi.spyOn(socketService, 'createChatSocket').mockReturnValue(mock.socket);

    render(<ChatSimulator />);

    act(() => {
      mock.controls.connect();
    });

    expect(await screen.findByText('Connected')).toBeInTheDocument();
  });

  it('renders incoming messages in both panels', async () => {
    const mock = createMockSocket();
    vi.spyOn(socketService, 'createChatSocket').mockReturnValue(mock.socket);

    render(<ChatSimulator />);

    act(() => {
      mock.controls.connect();
      mock.controls.emitMessage({
        id: '1',
        authorId: 'user-a',
        authorLabel: 'User A',
        body: 'Hello from A',
        timestamp: '2026-04-12T19:30:00.000Z',
      });
    });

    expect(await screen.findAllByText('Hello from A')).toHaveLength(2);
  });

  it('emits a message when User A sends one', async () => {
    const mock = createMockSocket();
    vi.spyOn(socketService, 'createChatSocket').mockReturnValue(mock.socket);
    const user = userEvent.setup();

    render(<ChatSimulator />);

    act(() => {
      mock.controls.connect();
    });

    const inputs = screen.getAllByPlaceholderText(/Send a message as/i);
    await user.type(inputs[0], 'Message from the left');
    await user.click(screen.getAllByRole('button', { name: 'Send' })[0]);

    expect(mock.socket.emitMessage).toHaveBeenCalledWith({
      authorId: 'user-a',
      authorLabel: 'User A',
      body: 'Message from the left',
    });
  });

  it('shows the typing indicator when the other user is typing', async () => {
    const mock = createMockSocket();
    vi.spyOn(socketService, 'createChatSocket').mockReturnValue(mock.socket);

    render(<ChatSimulator />);

    act(() => {
      mock.controls.connect();
      mock.controls.emitTyping({
        userId: 'user-a',
        isTyping: true,
      });
    });

    expect(await screen.findByText('The other user is typing...')).toBeInTheDocument();
  });

  it('clears the conversation when reset is received', async () => {
    const mock = createMockSocket();
    vi.spyOn(socketService, 'createChatSocket').mockReturnValue(mock.socket);
    const user = userEvent.setup();

    render(<ChatSimulator />);

    act(() => {
      mock.controls.connect();
      mock.controls.emitMessage({
        id: '1',
        authorId: 'user-b',
        authorLabel: 'User B',
        body: 'Temporary message',
        timestamp: '2026-04-12T19:30:00.000Z',
      });
    });

    expect(await screen.findAllByText('Temporary message')).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: 'Clear chat' }));

    expect(mock.socket.emitReset).toHaveBeenCalledTimes(1);

    act(() => {
      mock.controls.emitReset();
    });

    await waitFor(() => {
      expect(screen.queryByText('Temporary message')).not.toBeInTheDocument();
    });
  });
});
