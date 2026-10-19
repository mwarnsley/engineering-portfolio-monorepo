describe('lib/mongoose', () => {
  beforeEach(() => {
    jest.resetModules();
    delete global.mongoose;
    process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/meeting-app-test';
  });

  it('connects with the configured database name', async () => {
    const connect = jest.fn().mockResolvedValue('connected');

    jest.doMock('mongoose', () => ({
      __esModule: true,
      default: { connect },
    }));

    const { connectToDatabase } = await import('../../lib/mongoose');

    await connectToDatabase();

    expect(connect).toHaveBeenCalledWith(process.env.MONGODB_URI, {
      bufferCommands: false,
      dbName: 'meeting-application',
    });
  });

  it('reuses a cached connection', async () => {
    const connect = jest.fn().mockResolvedValue('connected');

    jest.doMock('mongoose', () => ({
      __esModule: true,
      default: { connect },
    }));

    const { connectToDatabase } = await import('../../lib/mongoose');

    await connectToDatabase();
    await connectToDatabase();

    expect(connect).toHaveBeenCalledTimes(1);
  });
  it('requires a database URI before attempting a connection', async () => {
    delete process.env.MONGODB_URI;
    await expect(import('../../lib/mongoose')).rejects.toThrow(
      'Please define the MONGODB_URI environment variable.'
    );
  });

  it('reuses a connection cached by a previous module instance', async () => {
    const connection = { readyState: 1 };
    global.mongoose = { conn: connection, promise: Promise.resolve(connection) };
    const { connectToDatabase } = await import('../../lib/mongoose');
    await expect(connectToDatabase()).resolves.toBe(connection);
  });

  it('shares one pending connection across concurrent callers', async () => {
    let resolveConnection;
    const pending = new Promise((resolve) => {
      resolveConnection = resolve;
    });
    const connect = jest.fn().mockReturnValue(pending);
    jest.doMock('mongoose', () => ({ __esModule: true, default: { connect } }));
    const { connectToDatabase } = await import('../../lib/mongoose');
    const first = connectToDatabase();
    const second = connectToDatabase();
    resolveConnection('connected');
    expect(await Promise.all([first, second])).toEqual(['connected', 'connected']);
    expect(connect).toHaveBeenCalledTimes(1);
  });
});
