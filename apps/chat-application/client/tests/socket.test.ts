import { createChatSocket } from '../src/services/socket';

const transport = vi.hoisted(() => ({
  connect: vi.fn(),
  disconnect: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
}));
const io = vi.hoisted(() => vi.fn(() => transport));
vi.mock('socket.io-client', () => ({ io }));

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe('chat socket adapter', () => {
  it.each([undefined, 'https://chat.example.test'])(
    'uses the default or explicit endpoint %s',
    (url) => {
      createChatSocket(url);
      expect(io).toHaveBeenCalledWith(url ?? 'http://localhost:3010', { autoConnect: false });
    }
  );

  it('prefers the configured deployment endpoint', () => {
    vi.stubEnv('VITE_SOCKET_URL', 'https://deployed.example.test');
    createChatSocket();
    expect(io).toHaveBeenCalledWith('https://deployed.example.test', { autoConnect: false });
  });

  it.each([
    ['onConnect', 'connect'],
    ['onDisconnect', 'disconnect'],
    ['onMessage', 'chat:message'],
    ['onTyping', 'chat:typing'],
    ['onReset', 'chat:reset'],
  ] as const)('unsubscribes only its %s listener', (method, event) => {
    const socket = createChatSocket();
    const handler = vi.fn();
    const unsubscribe = socket[method](handler);
    expect(transport.on).toHaveBeenCalledWith(event, handler);
    unsubscribe();
    expect(transport.off).toHaveBeenCalledWith(event, handler);
  });

  it('owns explicit transport connection lifetime', () => {
    const socket = createChatSocket();
    socket.connect();
    socket.disconnect();
    expect(transport.connect).toHaveBeenCalledTimes(1);
    expect(transport.disconnect).toHaveBeenCalledTimes(1);
  });

  it('preserves outgoing event contracts', () => {
    const socket = createChatSocket();
    const message = { authorId: 'user-a' as const, authorLabel: 'User A', body: 'Hello' };
    const typing = { userId: 'user-b' as const, isTyping: true };
    socket.emitMessage(message);
    socket.emitTyping(typing);
    socket.emitReset();
    expect(transport.emit.mock.calls).toEqual([
      ['chat:message', message],
      ['chat:typing', typing],
      ['chat:reset'],
    ]);
  });
});
