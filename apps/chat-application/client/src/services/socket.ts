import { io, Socket } from 'socket.io-client';
import type { ChatMessage, TypingState } from '../types/chat';

export interface ChatSocket {
  connect: () => void;
  disconnect: () => void;
  onConnect: (handler: () => void) => () => void;
  onDisconnect: (handler: () => void) => () => void;
  onMessage: (handler: (message: ChatMessage) => void) => () => void;
  onTyping: (handler: (state: TypingState) => void) => () => void;
  onReset: (handler: () => void) => () => void;
  emitMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  emitTyping: (state: TypingState) => void;
  emitReset: () => void;
}

function registerHandler<T>(
  socket: Socket,
  event: string,
  handler: (payload: T) => void
): () => void {
  socket.on(event, handler);

  return () => {
    socket.off(event, handler);
  };
}

export function createChatSocket(url = 'http://localhost:3010'): ChatSocket {
  const socketUrl = import.meta.env.VITE_SOCKET_URL ?? url;
  const socket = io(socketUrl, {
    autoConnect: false,
  });

  return {
    connect: () => socket.connect(),
    disconnect: () => socket.disconnect(),
    onConnect: (handler) => registerHandler<void>(socket, 'connect', handler),
    onDisconnect: (handler) => registerHandler<void>(socket, 'disconnect', handler),
    onMessage: (handler) => registerHandler<ChatMessage>(socket, 'chat:message', handler),
    onTyping: (handler) => registerHandler<TypingState>(socket, 'chat:typing', handler),
    onReset: (handler) => registerHandler<void>(socket, 'chat:reset', handler),
    emitMessage: (message) => socket.emit('chat:message', message),
    emitTyping: (state) => socket.emit('chat:typing', state),
    emitReset: () => socket.emit('chat:reset'),
  };
}
