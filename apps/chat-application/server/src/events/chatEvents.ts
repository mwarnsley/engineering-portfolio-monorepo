import type { Server, Socket } from 'socket.io';

export type ChatUserId = 'user-a' | 'user-b';

export interface ServerChatMessageInput {
  authorId: ChatUserId;
  authorLabel: string;
  body: string;
}

export interface ServerChatMessage extends ServerChatMessageInput {
  id: string;
  timestamp: string;
}

export interface TypingPayload {
  userId: ChatUserId;
  isTyping: boolean;
}

export function buildMessage(payload: ServerChatMessageInput): ServerChatMessage {
  return {
    ...payload,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
  };
}

export function registerChatEvents(io: Server, socket: Socket): void {
  socket.on('chat:message', (payload: ServerChatMessageInput) => {
    const body = payload.body.trim();
    if (!body) {
      return;
    }

    io.emit('chat:message', buildMessage({ ...payload, body }));
  });

  socket.on('chat:typing', (payload: TypingPayload) => {
    io.emit('chat:typing', payload);
  });

  socket.on('chat:reset', () => {
    io.emit('chat:reset');
  });
}
