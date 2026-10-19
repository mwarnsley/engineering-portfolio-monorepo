import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { nextTick, type Component } from 'vue';
import DashboardView from './DashboardView.vue';
import MarketsView from './MarketsView.vue';
import StockDetailView from './StockDetailView.vue';
import PortfolioView from './PortfolioView.vue';
import ActivityView from './ActivityView.vue';
import App from '@/App.vue';
import StockCard from '@/components/stocks/StockCard.vue';
import { useMarketStore } from '@/stores/market';
import { usePortfolioStore } from '@/stores/portfolio';
import { usePreferencesStore } from '@/stores/preferences';
import { useTransactionsStore } from '@/stores/transactions';
import { fetchQuotes, fetchCandleSeries } from '@/api/stocks';
vi.mock('@/api/stocks', () => ({ fetchQuotes: vi.fn(), fetchCandleSeries: vi.fn() }));
const quotes = [
  { symbol: 'AAPL', price: 100, change: 2, changePercent: 2 },
  { symbol: 'MSFT', price: 200, change: -4, changePercent: -2 },
];
let wrappers: VueWrapper[] = [];
beforeEach(() => {
  localStorage.clear();
  setActivePinia(createPinia());
  vi.clearAllMocks();
  vi.mocked(fetchQuotes).mockResolvedValue(quotes);
  vi.mocked(fetchCandleSeries).mockResolvedValue([{ time: 1, value: 100 }]);
});
afterEach(() => {
  wrappers.forEach((wrapper) => wrapper.unmount());
  wrappers = [];
  document.documentElement.classList.remove('dark');
});
async function render(component: Component, path = '/') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: DashboardView },
      { path: '/markets', component: MarketsView },
      { path: '/markets/:symbol', component: StockDetailView },
      { path: '/portfolio', component: PortfolioView },
      { path: '/activity', component: ActivityView },
    ],
  });
  await router.push(path);
  await router.isReady();
  const wrapper = mount(component, { global: { plugins: [router], stubs: { PriceChart: true } } });
  wrappers.push(wrapper);
  await flushPromises();
  return { wrapper, router };
}
function button(wrapper: VueWrapper, text: string) {
  const found = wrapper.findAll('button').find((entry) => entry.text() === text);
  if (!found) throw new Error(`Missing button: ${text}`);
  return found;
}
it('loads markets, searches case-insensitively, buys and toggles watchlist, and refreshes', async () => {
  const { wrapper } = await render(MarketsView, '/markets');
  expect(wrapper.findAllComponents(StockCard)).toHaveLength(2);
  await wrapper.get('input').setValue(' msF ');
  expect(wrapper.findAllComponents(StockCard).map((card) => card.props('stock').symbol)).toEqual([
    'MSFT',
  ]);
  await button(wrapper, 'Buy 1 share').trigger('click');
  expect(usePortfolioStore().getHolding('MSFT')?.shares).toBe(1);
  await wrapper.findComponent(StockCard).findAll('button')[0].trigger('click');
  expect(usePreferencesStore().watchlist).not.toContain('MSFT');
  await button(wrapper, 'Refresh').trigger('click');
  await flushPromises();
  expect(fetchQuotes).toHaveBeenCalledTimes(2);
});
it('displays market errors and zero-priced stocks without crashing', async () => {
  vi.mocked(fetchQuotes).mockResolvedValue([{ ...quotes[0], price: 0, change: -1 }]);
  const { wrapper } = await render(MarketsView, '/markets');
  expect(wrapper.text()).toContain('Live market data is unavailable');
  await button(wrapper, 'Buy 1 share').trigger('click');
  expect(usePortfolioStore().holdings).toEqual([]);
});
it('loads a dashboard on first visit and switches featured history', async () => {
  const { wrapper } = await render(DashboardView);
  expect(fetchQuotes).toHaveBeenCalledOnce();
  await button(wrapper, '1M').trigger('click');
  await flushPromises();
  expect(fetchCandleSeries).toHaveBeenLastCalledWith('AAPL', '1M');
  await button(wrapper, 'Buy 1 share').trigger('click');
  expect(usePortfolioStore().getHolding('AAPL')?.shares).toBe(1);
  await wrapper.findComponent(StockCard).findAll('button')[0].trigger('click');
  expect(usePreferencesStore().watchlist).not.toContain('AAPL');
});
it('reuses loaded quotes and displays losses and unavailable focus data', async () => {
  const market = useMarketStore();
  market.quotes = { MSFT: quotes[1] };
  market.selectedSymbol = 'MSFT';
  market.error = 'Connection interrupted';
  const portfolio = usePortfolioStore();
  portfolio.cash = 0;
  portfolio.holdings = [{ symbol: 'MSFT', shares: 1, averagePrice: 250 }];
  const { wrapper } = await render(DashboardView);
  expect(fetchQuotes).not.toHaveBeenCalled();
  expect(wrapper.text()).toContain('Connection interrupted');
  expect(wrapper.text()).toContain('-$50.00');
  market.selectSymbol('UNKNOWN');
  await flushPromises();
  expect(wrapper.text()).toContain('UNKNOWN Price Action');
});
it('trades on detail pages, changes timeframes, and reacts to symbol navigation', async () => {
  const { wrapper, router } = await render(StockDetailView, '/markets/AAPL');
  expect(wrapper.text()).toContain('Place an order to simulate an execution.');
  await button(wrapper, 'Execute Buy').trigger('click');
  expect(wrapper.text()).toContain('Bought 1 shares of AAPL.');
  await button(wrapper, 'Sell').trigger('click');
  await button(wrapper, 'Execute Sell').trigger('click');
  expect(wrapper.text()).toContain('Sold 1 shares of AAPL.');
  await button(wrapper, '1Y').trigger('click');
  await flushPromises();
  expect(fetchCandleSeries).toHaveBeenLastCalledWith('AAPL', '1Y');
  await router.push('/markets/MSFT');
  await flushPromises();
  expect(useMarketStore().selectedSymbol).toBe('MSFT');
  expect(wrapper.get('h1').text()).toBe('MSFT');
});
it('uses the selected symbol when no route parameter is supplied and displays history errors', async () => {
  useMarketStore().selectedSymbol = 'UNKNOWN';
  vi.mocked(fetchCandleSeries).mockResolvedValue([]);
  const { wrapper } = await render(StockDetailView);
  expect(wrapper.get('h1').text()).toBe('UNKNOWN');
  expect(wrapper.text()).toContain('Price history is unavailable');
  await button(wrapper, 'Execute Buy').trigger('click');
  expect(wrapper.text()).toContain('Live pricing is unavailable for this stock.');
});
it('shows winning and losing holdings and navigates to the selected sell ticket', async () => {
  useMarketStore().quotes = { AAPL: quotes[0], MSFT: quotes[1] };
  const portfolio = usePortfolioStore();
  portfolio.holdings = [
    { symbol: 'AAPL', shares: 2, averagePrice: 90 },
    { symbol: 'MSFT', shares: 1, averagePrice: 250 },
  ];
  const { wrapper, router } = await render(PortfolioView, '/portfolio');
  expect(wrapper.text()).toContain('+$20.00');
  expect(wrapper.text()).toContain('-$50.00');
  await button(wrapper, 'Sell').trigger('click');
  await flushPromises();
  expect(router.currentRoute.value.path).toBe('/markets/AAPL');
  portfolio.holdings = [{ symbol: 'AAPL', shares: 2, averagePrice: 90 }];
  await nextTick();
  expect(wrapper.text()).toContain('+11.11%');
});
it('filters activity through visible symbol and transaction-type controls', async () => {
  const transactions = useTransactionsStore();
  transactions.addTransaction({ symbol: 'AAPL', type: 'buy', shares: 2, price: 100 });
  transactions.addTransaction({ symbol: 'MSFT', type: 'sell', shares: 1, price: 200 });
  const { wrapper } = await render(ActivityView, '/activity');
  expect(wrapper.text()).toContain('MSFT');
  await button(wrapper, 'BUY').trigger('click');
  expect(wrapper.text()).not.toContain('MSFT');
  await button(wrapper, 'ALL').trigger('click');
  await wrapper.get('input').setValue('ms');
  expect(wrapper.text()).not.toContain('AAPL');
});
it('mounts the app shell, enables dark mode, and marks nested market navigation active', async () => {
  const { wrapper, router } = await render(App, '/markets/AAPL');
  expect(document.documentElement.classList.contains('dark')).toBe(true);
  expect(wrapper.get('a[href="/markets"]').classes()).toContain('bg-accent');
  const portfolio = usePortfolioStore();
  portfolio.holdings = [{ symbol: 'AAPL', shares: 1, averagePrice: 150 }];
  await nextTick();
  expect(wrapper.text()).toContain('-$50.00');
  await router.push('/activity');
  await flushPromises();
  expect(wrapper.get('a[href="/activity"]').classes()).toContain('bg-accent');
});
