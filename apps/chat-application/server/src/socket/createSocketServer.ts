import { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';
import { registerChatEvents } from '../events/chatEvents.js';

export function createSocketServer(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    registerChatEvents(io, socket);
  });

  return io;
}
