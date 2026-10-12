import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useIframeStatus } from './useIframeStatus';

const URL_UNDER_TEST = 'https://demo.example.com';
const OPTIONS = { slowAfterMs: 1_000, timeoutMs: 5_000 };

const flushPromises = () => act(async () => {});

describe('useIframeStatus', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    fetchMock = vi.fn(() => new Promise<Response>(() => {}));
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('should start in the loading state', () => {
    const { result } = renderHook(() => useIframeStatus(URL_UNDER_TEST, OPTIONS));
    expect(result.current.status).toBe('loading');
  });

  it('should probe the URL with a no-cors request', () => {
    renderHook(() => useIframeStatus(URL_UNDER_TEST, OPTIONS));
    expect(fetchMock).toHaveBeenCalledWith(
      URL_UNDER_TEST,
      expect.objectContaining({ mode: 'no-cors' })
    );
  });

  it('should become ready when the iframe loads', () => {
    const { result } = renderHook(() => useIframeStatus(URL_UNDER_TEST, OPTIONS));
    act(() => result.current.handleLoad());
    expect(result.current.status).toBe('ready');
  });

  it('should report slow after the slow threshold', () => {
    const { result } = renderHook(() => useIframeStatus(URL_UNDER_TEST, OPTIONS));
    act(() => vi.advanceTimersByTime(OPTIONS.slowAfterMs));
    expect(result.current.status).toBe('slow');
  });

  it('should report a timeout after the timeout threshold', () => {
    const { result } = renderHook(() => useIframeStatus(URL_UNDER_TEST, OPTIONS));
    act(() => vi.advanceTimersByTime(OPTIONS.timeoutMs));
    expect(result.current).toMatchObject({ status: 'error', reason: 'timeout' });
  });

  it('should report unreachable when the probe fails', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    const { result } = renderHook(() => useIframeStatus(URL_UNDER_TEST, OPTIONS));
    await flushPromises();
    expect(result.current).toMatchObject({ status: 'error', reason: 'unreachable' });
  });

  it('should change the frame key and return to loading on retry', () => {
    const { result } = renderHook(() => useIframeStatus(URL_UNDER_TEST, OPTIONS));
    const initialKey = result.current.frameKey;
    act(() => vi.advanceTimersByTime(OPTIONS.timeoutMs));
    act(() => result.current.retry());
    expect(result.current.status).toBe('loading');
    expect(result.current.frameKey).not.toBe(initialKey);
  });

  it('should abort the probe on unmount', () => {
    const { unmount } = renderHook(() => useIframeStatus(URL_UNDER_TEST, OPTIONS));
    const { signal } = fetchMock.mock.calls[0][1] as RequestInit;
    unmount();
    expect(signal?.aborted).toBe(true);
  });

  it('should flag mixed content without probing when an https page embeds http', () => {
    vi.stubGlobal('location', { ...window.location, protocol: 'https:' });
    const { result } = renderHook(() => useIframeStatus('http://demo.example.com', OPTIONS));
    expect(result.current).toMatchObject({ status: 'error', reason: 'mixed-content' });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
