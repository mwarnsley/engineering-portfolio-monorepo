import { createServer } from 'node:http';
import { describe, expect, it, vi } from 'vitest';
import { createSocketServer } from '../src/socket/createSocketServer.js';

const mocks = vi.hoisted(() => ({ on: vi.fn(), registerChatEvents: vi.fn(), options: vi.fn() }));
vi.mock('socket.io', () => ({
  Server: class {
    on = mocks.on;
    constructor(...args: unknown[]) {
      mocks.options(...args);
    }
  },
}));
vi.mock('../src/events/chatEvents.js', () => ({ registerChatEvents: mocks.registerChatEvents }));

describe('socket gateway', () => {
  it('attaches the gateway to HTTP and registers each connected socket', () => {
    const http = createServer();
    const io = createSocketServer(http);
    const socket = { id: 'connection-1' };
    const connection = mocks.on.mock.calls[0][1] as (socket: { id: string }) => void;
    connection(socket);
    expect(mocks.options).toHaveBeenCalledWith(http, { cors: { origin: '*' } });
    expect(mocks.on.mock.calls[0][0]).toBe('connection');
    expect(mocks.registerChatEvents).toHaveBeenCalledWith(io, socket);
  });
});
