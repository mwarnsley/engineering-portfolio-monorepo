export type DemoFrameStatus = 'loading' | 'slow' | 'ready' | 'error';

export type DemoFrameErrorReason = 'mixed-content' | 'unreachable' | 'timeout';

export interface DemoFrameState {
  /** Current lifecycle phase of the embedded demo. */
  status: DemoFrameStatus;
  /** Why the frame failed. Always `null` unless `status` is `'error'`. */
  reason: DemoFrameErrorReason | null;
}

export type DemoFrameAction =
  | { type: 'reset' }
  | { type: 'loaded' }
  | { type: 'slow' }
  | { type: 'failed'; reason: DemoFrameErrorReason };

export const INITIAL_DEMO_FRAME_STATE: DemoFrameState = { status: 'loading', reason: null };

/** Reasons a later iframe `load` event cannot override. Browsers fire `load` for their own error pages. */
const STICKY_ERROR_REASONS: ReadonlySet<DemoFrameErrorReason> = new Set([
  'mixed-content',
  'unreachable',
]);

const LOCAL_HOSTNAMES: ReadonlySet<string> = new Set(['localhost', '127.0.0.1', '[::1]']);

/**
 * Transitions the demo iframe lifecycle state.
 * @param {DemoFrameState} state - The current state.
 * @param {DemoFrameAction} action - The lifecycle event.
 * @returns {DemoFrameState} The next state.
 * @example
 * demoFrameReducer({ status: 'loading', reason: null }, { type: 'loaded' }); // { status: 'ready', reason: null }
 */
export const demoFrameReducer = (
  state: DemoFrameState,
  action: DemoFrameAction
): DemoFrameState => {
  switch (action.type) {
    case 'reset':
      return INITIAL_DEMO_FRAME_STATE;
    case 'loaded':
      if (state.status === 'error' && state.reason && STICKY_ERROR_REASONS.has(state.reason)) {
        return state;
      }
      return state.status === 'ready' ? state : { status: 'ready', reason: null };
    case 'slow':
      return state.status === 'loading' ? { status: 'slow', reason: null } : state;
    case 'failed':
      if (state.status === 'error' && state.reason === action.reason) return state;
      if (state.status === 'ready' && action.reason === 'timeout') return state;
      return { status: 'error', reason: action.reason };
  }
};

/**
 * Checks whether a hostname refers to the local machine.
 * @param {string} hostname - A `URL#hostname` or `location.hostname` value.
 * @returns {boolean} `true` for localhost, 127.0.0.1, and [::1].
 * @example
 * isLocalHostname('localhost'); // returns true
 */
export const isLocalHostname = (hostname: string): boolean => LOCAL_HOSTNAMES.has(hostname);

/**
 * Detects whether the browser will block embedding `frameUrl` as mixed content. Browsers treat
 * `http://localhost` as potentially trustworthy, so local URLs are never reported as blocked.
 * @param {string} pageProtocol - The host page protocol, e.g. `window.location.protocol`.
 * @param {string} frameUrl - The absolute URL the iframe will load.
 * @returns {boolean} `true` when an HTTPS page would embed a non-local HTTP URL.
 * @example
 * isMixedContentBlocked('https:', 'http://example.com'); // returns true
 * isMixedContentBlocked('https:', 'http://localhost:3002'); // returns false
 */
export const isMixedContentBlocked = (pageProtocol: string, frameUrl: string): boolean => {
  if (pageProtocol !== 'https:') return false;
  try {
    const { protocol, hostname } = new URL(frameUrl);
    return protocol === 'http:' && !isLocalHostname(hostname);
  } catch {
    return false;
  }
};

/**
 * Picks the URL to embed for a demo: the local dev server when the shell runs locally, otherwise
 * the production deployment (falling back to the local URL when none exists).
 * @param {{ localDevUrl: string; productionUrl: string | null }} urls - The registry URLs.
 * @param {string} hostname - The shell's current hostname.
 * @returns {string} The URL to load in the iframe.
 * @example
 * resolveDemoUrl({ localDevUrl: 'http://localhost:3002', productionUrl: 'https://x.app' }, 'localhost');
 * // returns "http://localhost:3002"
 */
export const resolveDemoUrl = (
  { localDevUrl, productionUrl }: { localDevUrl: string; productionUrl: string | null },
  hostname: string
): string => (isLocalHostname(hostname) ? localDevUrl : (productionUrl ?? localDevUrl));
