describe('models/Meeting', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  async function loadModel() {
    jest.doMock('mongoose', () => {
      class Schema {
        constructor(definition, options) {
          this.definition = definition;
          this.options = options;
          this.middlewares = {};
        }

        pre(name, callback) {
          this.middlewares[name] = callback;
        }
      }

      return {
        __esModule: true,
        Schema,
        default: {
          model: jest.fn((name, schema) => ({ modelName: name, schema })),
          models: {},
        },
      };
    });

    return import('../../models/Meeting');
  }

  it('applies defaults to the meeting mode field', async () => {
    const { Meeting } = await loadModel();

    expect(Meeting.schema.definition.mode.default).toBe('remote');
  });

  it('defines an empty default comments array', async () => {
    const { Meeting } = await loadModel();

    expect(Meeting.schema.definition.comments.default).toEqual([]);
  });

  it('invalidates meetings that end before they start', async () => {
    const { Meeting } = await loadModel();
    const invalidate = jest.fn();

    Meeting.schema.middlewares.validate.call({
      endTime: new Date('2026-04-10T13:00:00.000Z'),
      invalidate,
      startTime: new Date('2026-04-10T14:00:00.000Z'),
    });

    expect(invalidate).toHaveBeenCalledWith('endTime', 'End time must be after the start time.');
  });
  it.each([
    { startTime: new Date('2026-04-10T14:00:00Z'), endTime: new Date('2026-04-10T15:00:00Z') },
    { startTime: null, endTime: new Date('2026-04-10T15:00:00Z') },
    { startTime: new Date('2026-04-10T14:00:00Z'), endTime: null },
  ])('leaves valid or incomplete date ranges to field validation: %j', async (dates) => {
    const { Meeting } = await loadModel();
    const invalidate = jest.fn();
    Meeting.schema.middlewares.validate.call({ ...dates, invalidate });
    expect(invalidate).not.toHaveBeenCalled();
  });

  it('reuses an already registered model during module reload', async () => {
    const { Meeting } = await loadModel();
    const mongoose = (await import('mongoose')).default;
    mongoose.models.Meeting = Meeting;
    jest.isolateModules(() => {
      expect(require('../../models/Meeting').Meeting).toBe(Meeting);
    });
    expect(mongoose.model).toHaveBeenCalledTimes(1);
  });
});
