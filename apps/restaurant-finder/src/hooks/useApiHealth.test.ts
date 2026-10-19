import { act, renderHook, waitFor } from '@testing-library/react';
import { useApiHealth } from './useApiHealth';
import { getApiHealth } from '../services/restaurants';

jest.mock('../services/restaurants', () => ({ getApiHealth: jest.fn() }));
const healthy = {
  configured: true,
  reachable: true,
  host: 'api.example.com',
  message: 'Connected',
};

beforeEach(() => jest.resetAllMocks());

it.each([true, false, null])('reports health when reachable is %s', async (reachable) => {
  jest.mocked(getApiHealth).mockResolvedValue({ ...healthy, reachable });
  const { result } = renderHook(useApiHealth);
  expect(result.current.status).toBe('checking');
  await waitFor(() =>
    expect(result.current).toEqual({
      ...healthy,
      reachable,
      status: reachable === false ? 'error' : 'ready',
    })
  );
});

it.each([
  [new Error('Service offline'), 'Service offline'],
  ['offline', 'API health check failed unexpectedly.'],
])('reports a failed health request: %s', async (error, message) => {
  jest.mocked(getApiHealth).mockRejectedValue(error);
  const { result } = renderHook(useApiHealth);
  await waitFor(() =>
    expect(result.current).toMatchObject({ status: 'error', reachable: false, message })
  );
});

it.each(['resolve', 'reject'])('ignores a late %s after unmount', async (outcome) => {
  let settle!: () => void;
  jest.mocked(getApiHealth).mockReturnValue(
    new Promise((resolve, reject) => {
      settle = () => (outcome === 'resolve' ? resolve(healthy) : reject(new Error('Late failure')));
    })
  );
  const { result, unmount } = renderHook(useApiHealth);
  unmount();
  await act(async () => settle());
  expect(result.current.status).toBe('checking');
});
