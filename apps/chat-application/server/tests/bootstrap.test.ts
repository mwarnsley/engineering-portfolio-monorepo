import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';

const mocks = vi.hoisted(() => ({
  use: vi.fn(),
  get: vi.fn(),
  listen: vi.fn(),
  createServer: vi.fn(),
  createSocketServer: vi.fn(),
}));
vi.mock('node:http', () => ({ default: { createServer: mocks.createServer } }));
vi.mock('express', () => ({
  default: Object.assign(() => ({ use: mocks.use, get: mocks.get }), {
    json: () => 'json middleware',
  }),
}));
vi.mock('cors', () => ({ default: () => 'cors middleware' }));
vi.mock('../src/socket/createSocketServer.js', () => ({
  createSocketServer: mocks.createSocketServer,
}));

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe('server bootstrap', () => {
  it.each([undefined, '4050'])(
    'listens on the configured port %s and exposes health',
    async (port) => {
      vi.resetModules();
      vi.stubEnv('PORT', port);
      const log = vi.spyOn(console, 'log').mockImplementation(() => {});
      const server = { listen: mocks.listen };
      mocks.createServer.mockReturnValue(server);
      mocks.listen.mockImplementation((_port: number, ready: () => void) => ready());
      await import('../src/index.js');
      expect(mocks.listen).toHaveBeenCalledWith(Number(port ?? 3010), expect.any(Function));
      expect(mocks.createSocketServer).toHaveBeenCalledWith(server);
      expect(log).toHaveBeenCalledWith(
        `Socket server listening on http://localhost:${port ?? 3010}`
      );
    }
  );

  it('registers CORS and JSON before the healthy response route', async () => {
    vi.resetModules();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mocks.createServer.mockReturnValue({ listen: mocks.listen });
    await import('../src/index.js');
    const json = vi.fn();
    const handler = mocks.get.mock.calls[0][1] as (
      request: Request,
      response: Pick<Response, 'json'>
    ) => void;
    handler({} as Request, { json });
    expect(mocks.use.mock.calls).toEqual([['cors middleware'], ['json middleware']]);
    expect(mocks.get.mock.calls[0][0]).toBe('/health');
    expect(json).toHaveBeenCalledWith({ status: 'ok' });
  });
});
