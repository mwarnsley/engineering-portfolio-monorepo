/** @jest-environment node */

import { errorResponse, successResponse } from '../../lib/api';

describe('lib/api', () => {
  it('returns success payloads as json', async () => {
    const response = successResponse({ ok: true });

    expect(await response.json()).toEqual({ ok: true });
  });

  it('passes through success init options', () => {
    const response = successResponse({ ok: true }, { status: 201 });

    expect(response.status).toBe(201);
  });

  it('returns error payloads as json', async () => {
    const response = errorResponse('Nope', 400);

    expect(await response.json()).toEqual({ error: 'Nope' });
  });

  it('applies error status codes', () => {
    const response = errorResponse('Nope', 400);

    expect(response.status).toBe(400);
  });
});
