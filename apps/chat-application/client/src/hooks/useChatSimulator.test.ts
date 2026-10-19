import { act, renderHook } from '@testing-library/react';
import { useChatSimulator } from './useChatSimulator';
import type { ChatSocket } from '../services/socket';
import type { ChatMessage, TypingState } from '../types/chat';

function setup() {
  const listeners = {
    connect: () => {},
    disconnect: () => {},
    message: (_message: ChatMessage) => {},
    typing: (_state: TypingState) => {},
    reset: () => {},
  };
  const off = {
    connect: vi.fn(),
    disconnect: vi.fn(),
    message: vi.fn(),
    typing: vi.fn(),
    reset: vi.fn(),
  };
  const socket: ChatSocket = {
    connect: vi.fn(),
    disconnect: vi.fn(),
    emitMessage: vi.fn(),
    emitTyping: vi.fn(),
    emitReset: vi.fn(),
    onConnect: (handler) => {
      listeners.connect = handler;
      return off.connect;
    },
    onDisconnect: (handler) => {
      listeners.disconnect = handler;
      return off.disconnect;
    },
    onMessage: (handler) => {
      listeners.message = handler;
      return off.message;
    },
    onTyping: (handler) => {
      listeners.typing = handler;
      return off.typing;
    },
    onReset: (handler) => {
      listeners.reset = handler;
      return off.reset;
    },
  };
  const factory = () => socket;
  return { ...renderHook(() => useChatSimulator(factory)), socket, listeners, off };
}
const message: ChatMessage = {
  id: '1',
  authorId: 'user-a',
  authorLabel: 'User A',
  body: 'Hello',
  timestamp: '2026-01-01T12:00:00Z',
};

it('tracks disconnection and reconnection', () => {
  const { result, listeners, socket } = setup();
  act(() => listeners.connect());
  expect(result.current.isConnected).toBe(true);
  act(() => listeners.disconnect());
  expect(result.current.isConnected).toBe(false);
  expect(socket.connect).toHaveBeenCalledTimes(1);
});

it('trims outgoing messages and ignores blank bodies', () => {
  const { result, socket } = setup();
  act(() => {
    result.current.sendMessage('user-b', '  Hello  ');
    result.current.sendMessage('user-a', ' \n ');
  });
  expect(socket.emitMessage).toHaveBeenCalledExactlyOnceWith({
    authorId: 'user-b',
    authorLabel: 'User B',
    body: 'Hello',
  });
});

it('preserves message order and clears only the sending user typing state', () => {
  const { result, listeners } = setup();
  act(() => {
    listeners.typing({ userId: 'user-a', isTyping: true });
    listeners.typing({ userId: 'user-b', isTyping: true });
    listeners.message(message);
    listeners.message({ ...message, id: '2', body: 'Second' });
  });
  expect(result.current.messages.map(({ body }) => body)).toEqual(['Hello', 'Second']);
  expect(result.current.typingUsers).toEqual(['user-b']);
});

it('clears messages and typing indicators when the server resets', () => {
  const { result, listeners } = setup();
  act(() => {
    listeners.message(message);
    listeners.typing({ userId: 'user-b', isTyping: true });
  });
  act(() => listeners.reset());
  expect(result.current.messages).toEqual([]);
  expect(result.current.typingUsers).toEqual([]);
});

it('forwards typing and reset requests to the socket', () => {
  const { result, socket } = setup();
  act(() => {
    result.current.setTyping('user-b', false);
    result.current.resetChat();
  });
  expect(socket.emitTyping).toHaveBeenCalledWith({ userId: 'user-b', isTyping: false });
  expect(socket.emitReset).toHaveBeenCalledTimes(1);
});

it('unsubscribes every event and disconnects on unmount', () => {
  const { unmount, socket, off } = setup();
  unmount();
  for (const unsubscribe of Object.values(off)) expect(unsubscribe).toHaveBeenCalledTimes(1);
  expect(socket.disconnect).toHaveBeenCalledTimes(1);
});
