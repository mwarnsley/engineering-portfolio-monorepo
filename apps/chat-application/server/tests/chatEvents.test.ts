import { describe, expect, it, vi } from 'vitest';
import { buildMessage, registerChatEvents } from '../src/events/chatEvents.js';

function createIoMock() {
  return {
    emit: vi.fn(),
  };
}

function createSocketMock() {
  const handlers = new Map<string, (...args: any[]) => void>();

  return {
    on: vi.fn((event: string, handler: (...args: any[]) => void) => {
      handlers.set(event, handler);
    }),
    trigger: (event: string, payload?: unknown) => {
      const handler = handlers.get(event);
      if (handler) {
        handler(payload);
      }
    },
  };
}

describe('chat events', () => {
  it('creates a timestamped message object', () => {
    const message = buildMessage({
      authorId: 'user-a',
      authorLabel: 'User A',
      body: 'Hello',
    });

    expect(message.id).toBeTruthy();
    expect(message.timestamp).toBeTruthy();
  });

  it('broadcasts sanitized chat messages', () => {
    const io = createIoMock();
    const socket = createSocketMock();

    registerChatEvents(io as never, socket as never);
    socket.trigger('chat:message', {
      authorId: 'user-b',
      authorLabel: 'User B',
      body: '  Trim me  ',
    });

    expect(io.emit).toHaveBeenCalledWith(
      'chat:message',
      expect.objectContaining({
        body: 'Trim me',
      })
    );
  });

  it('ignores empty chat messages', () => {
    const io = createIoMock();
    const socket = createSocketMock();

    registerChatEvents(io as never, socket as never);
    socket.trigger('chat:message', {
      authorId: 'user-b',
      authorLabel: 'User B',
      body: '   ',
    });

    expect(io.emit).not.toHaveBeenCalled();
  });

  it('broadcasts typing updates', () => {
    const io = createIoMock();
    const socket = createSocketMock();

    registerChatEvents(io as never, socket as never);
    socket.trigger('chat:typing', {
      userId: 'user-a',
      isTyping: true,
    });

    expect(io.emit).toHaveBeenCalledWith('chat:typing', {
      userId: 'user-a',
      isTyping: true,
    });
  });

  it('broadcasts reset events', () => {
    const io = createIoMock();
    const socket = createSocketMock();

    registerChatEvents(io as never, socket as never);
    socket.trigger('chat:reset');

    expect(io.emit).toHaveBeenCalledWith('chat:reset');
  });
});
