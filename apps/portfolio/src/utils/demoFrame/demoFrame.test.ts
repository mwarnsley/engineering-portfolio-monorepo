import { describe, expect, it } from 'vitest';
import {
  demoFrameReducer,
  INITIAL_DEMO_FRAME_STATE,
  isLocalHostname,
  isMixedContentBlocked,
  resolveDemoUrl,
  type DemoFrameAction,
  type DemoFrameState,
} from './demoFrame';

const loading: DemoFrameState = { status: 'loading', reason: null };
const slow: DemoFrameState = { status: 'slow', reason: null };
const ready: DemoFrameState = { status: 'ready', reason: null };
const timedOut: DemoFrameState = { status: 'error', reason: 'timeout' };
const unreachable: DemoFrameState = { status: 'error', reason: 'unreachable' };
const mixed: DemoFrameState = { status: 'error', reason: 'mixed-content' };

describe('demoFrameReducer', () => {
  it.each<[string, DemoFrameState, DemoFrameAction, DemoFrameState]>([
    ['reset from error returns to loading', unreachable, { type: 'reset' }, loading],
    ['reset from ready returns to loading', ready, { type: 'reset' }, loading],
    ['loaded while loading becomes ready', loading, { type: 'loaded' }, ready],
    ['loaded while slow becomes ready', slow, { type: 'loaded' }, ready],
    ['loaded after timeout recovers to ready', timedOut, { type: 'loaded' }, ready],
    ['loaded cannot mask unreachable', unreachable, { type: 'loaded' }, unreachable],
    ['loaded cannot mask mixed content', mixed, { type: 'loaded' }, mixed],
    ['slow while loading becomes slow', loading, { type: 'slow' }, slow],
    ['slow after ready is ignored', ready, { type: 'slow' }, ready],
    ['slow after error is ignored', timedOut, { type: 'slow' }, timedOut],
    ['timeout while slow becomes error', slow, { type: 'failed', reason: 'timeout' }, timedOut],
    ['timeout after ready is ignored', ready, { type: 'failed', reason: 'timeout' }, ready],
    [
      'unreachable after ready overrides the browser error page',
      ready,
      { type: 'failed', reason: 'unreachable' },
      unreachable,
    ],
    [
      'unreachable after timeout upgrades the reason',
      timedOut,
      { type: 'failed', reason: 'unreachable' },
      unreachable,
    ],
  ])('should handle: %s', (_label, state, action, expected) => {
    expect(demoFrameReducer(state, action)).toEqual(expected);
  });

  it('should preserve referential identity for no-op transitions', () => {
    expect(demoFrameReducer(ready, { type: 'loaded' })).toBe(ready);
  });

  it('should start in the loading state', () => {
    expect(INITIAL_DEMO_FRAME_STATE).toEqual(loading);
  });
});

describe('isLocalHostname', () => {
  it.each([
    ['localhost', true],
    ['127.0.0.1', true],
    ['[::1]', true],
    ['marcuswarnsley.dev', false],
    ['localhost.example.com', false],
  ])('should classify %s as local=%s', (hostname, expected) => {
    expect(isLocalHostname(hostname)).toBe(expected);
  });
});

describe('isMixedContentBlocked', () => {
  it.each([
    ['https:', 'http://demo.example.com', true],
    ['https:', 'https://demo.example.com', false],
    ['https:', 'http://localhost:3002', false],
    ['https:', 'http://127.0.0.1:3002', false],
    ['http:', 'http://demo.example.com', false],
    ['https:', 'not a url', false],
  ])('should return %s + %s -> %s', (pageProtocol, frameUrl, expected) => {
    expect(isMixedContentBlocked(pageProtocol, frameUrl)).toBe(expected);
  });
});

describe('resolveDemoUrl', () => {
  const urls = { localDevUrl: 'http://localhost:3002', productionUrl: 'https://demo.app' };

  it.each([
    ['localhost', urls, 'http://localhost:3002'],
    ['127.0.0.1', urls, 'http://localhost:3002'],
    ['marcuswarnsley.dev', urls, 'https://demo.app'],
    ['marcuswarnsley.dev', { ...urls, productionUrl: null }, 'http://localhost:3002'],
  ])('should resolve on %s', (hostname, registryUrls, expected) => {
    expect(resolveDemoUrl(registryUrls, hostname)).toBe(expected);
  });
});
