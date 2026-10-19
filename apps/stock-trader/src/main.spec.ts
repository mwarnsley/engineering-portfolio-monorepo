import { afterEach, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import type { App } from 'vue';
import { useMarketStore } from '@/stores/market';
vi.mock('@/api/stocks', () => ({
  fetchQuotes: vi.fn(async () => [{ symbol: 'AAPL', price: 100, change: 1, changePercent: 1 }]),
  fetchCandleSeries: vi.fn(async () => [{ time: 1, value: 100 }]),
}));
vi.mock('lightweight-charts', () => ({
  LineSeries: 'line',
  createChart: () => ({
    addSeries: () => ({ setData: vi.fn() }),
    timeScale: () => ({ fitContent: vi.fn() }),
    applyOptions: vi.fn(),
    remove: vi.fn(),
  }),
}));
afterEach(() => {
  const container = document.querySelector<HTMLDivElement & { __vue_app__?: App }>('#app');
  container?.__vue_app__?.unmount();
  container?.remove();
  document.documentElement.classList.remove('dark');
  vi.restoreAllMocks();
  localStorage.clear();
});
it('boots the real application with Pinia and navigates every registered route', async () => {
  localStorage.clear();
  window.history.replaceState({}, '', '/');
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  const container = document.createElement('div');
  container.id = 'app';
  document.body.append(container);
  await import('./main');
  const { default: router } = await import('./router');
  await router.isReady();
  await flushPromises();
  expect(container.textContent).toContain('Watchlist Snapshot');
  expect(useMarketStore().getQuote('AAPL')?.price).toBe(100);
  for (const [path, heading] of [
    ['/markets', 'Scan the tape'],
    ['/markets/AAPL', 'Stock Detail'],
    ['/portfolio', 'Holdings'],
    ['/activity', 'Activity Log'],
  ]) {
    await router.push(path);
    await flushPromises();
    expect(container.textContent).toContain(heading);
  }
  expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 });
});
