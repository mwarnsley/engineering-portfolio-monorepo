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
});
