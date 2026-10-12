import { useCallback, useEffect, useReducer, useState } from 'react';
import {
  demoFrameReducer,
  INITIAL_DEMO_FRAME_STATE,
  isMixedContentBlocked,
  type DemoFrameErrorReason,
  type DemoFrameStatus,
} from '@/utils/demoFrame';

export const DEMO_SLOW_AFTER_MS = 6_000;
export const DEMO_TIMEOUT_MS = 25_000;

export interface UseIframeStatusOptions {
  /**
   * Milliseconds before a still-loading frame is reported as slow (cold start).
   * @default 6000
   */
  slowAfterMs?: number;
  /**
   * Milliseconds before a frame that never fired `load` is reported as timed out.
   * @default 25000
   */
  timeoutMs?: number;
}

export interface IframeStatus {
  /** Current lifecycle phase. */
  status: DemoFrameStatus;
  /** Failure reason when `status` is `'error'`, otherwise `null`. */
  reason: DemoFrameErrorReason | null;
  /** Attach to the iframe's `onLoad`. */
  handleLoad: () => void;
  /** Remounts the iframe and re-runs reachability checks. */
  retry: () => void;
  /** Key to apply to the iframe so `retry` forces a fresh load. */
  frameKey: string;
}

/**
 * Tracks an embedded demo's lifecycle. It flags mixed content up front, probes reachability with a
 * `no-cors` request (which only rejects on network failure), and reports slow loads and timeouts.
 * @param {string} url - The absolute URL loaded in the iframe.
 * @param {UseIframeStatusOptions} [options={}] - Slow and timeout thresholds.
 * @returns {IframeStatus} The status plus handlers to wire into the iframe.
 * @example
 * const { status, reason, handleLoad, frameKey } = useIframeStatus(demoUrl);
 * <iframe key={frameKey} src={demoUrl} onLoad={handleLoad} />
 */
export const useIframeStatus = (
  url: string,
  { slowAfterMs = DEMO_SLOW_AFTER_MS, timeoutMs = DEMO_TIMEOUT_MS }: UseIframeStatusOptions = {}
): IframeStatus => {
  const [state, dispatch] = useReducer(demoFrameReducer, INITIAL_DEMO_FRAME_STATE);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    dispatch({ type: 'reset' });

    if (isMixedContentBlocked(window.location.protocol, url)) {
      dispatch({ type: 'failed', reason: 'mixed-content' });
      return;
    }

    const controller = new AbortController();
    fetch(url, { mode: 'no-cors', cache: 'no-store', signal: controller.signal }).catch(() => {
      if (!controller.signal.aborted) dispatch({ type: 'failed', reason: 'unreachable' });
    });

    const slowTimer = window.setTimeout(() => dispatch({ type: 'slow' }), slowAfterMs);
    const timeoutTimer = window.setTimeout(
      () => dispatch({ type: 'failed', reason: 'timeout' }),
      timeoutMs
    );

    return () => {
      controller.abort();
      window.clearTimeout(slowTimer);
      window.clearTimeout(timeoutTimer);
    };
  }, [url, attempt, slowAfterMs, timeoutMs]);

  const handleLoad = useCallback(() => dispatch({ type: 'loaded' }), []);
  const retry = useCallback(() => setAttempt((current) => current + 1), []);

  return {
    status: state.status,
    reason: state.reason,
    handleLoad,
    retry,
    frameKey: `${url}#${attempt}`,
  };
};
