import { afterEach, expect, it, vi } from 'vitest';
import { loadStorage, saveStorage } from './storage';
afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});
it('round-trips stored state and falls back for missing or corrupt JSON', () => {
  saveStorage('state', { cash: 120 });
  expect(loadStorage('state', {})).toEqual({ cash: 120 });
  expect(loadStorage('missing', 10)).toBe(10);
  localStorage.setItem('state', '{');
  expect(loadStorage('state', 20)).toBe(20);
});
it('does not access browser storage during server rendering', () => {
  vi.stubGlobal('window', undefined);
  expect(loadStorage('state', 10)).toBe(10);
  expect(() => saveStorage('state', 20)).not.toThrow();
});
