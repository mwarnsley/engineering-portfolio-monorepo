import { afterEach, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import PriceChart from './PriceChart.vue';
const { chart, setData, fitContent, createChart } = vi.hoisted(() => {
  const setData = vi.fn();
  const fitContent = vi.fn();
  const chart = {
    remove: vi.fn(),
    applyOptions: vi.fn(),
    addSeries: vi.fn(() => ({ setData })),
    timeScale: () => ({ fitContent }),
  };
  return { chart, setData, fitContent, createChart: vi.fn(() => chart) };
});
vi.mock('lightweight-charts', () => ({ createChart, LineSeries: 'line' }));
afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});
it('renders chart data, responds to resizing, rebuilds on data changes and cleans up resources', async () => {
  let resize!: ResizeObserverCallback;
  const observe = vi.fn();
  const disconnect = vi.fn();
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: ResizeObserverCallback) {
        resize = callback;
      }
      observe = observe;
      disconnect = disconnect;
    }
  );
  const points = [{ time: 1, value: 100 }];
  const wrapper = mount(PriceChart, { props: { data: points } });
  expect(setData).toHaveBeenCalledWith(points);
  expect(observe).toHaveBeenCalledWith(wrapper.element);
  resize([], {} as ResizeObserver);
  expect(chart.applyOptions).toHaveBeenCalledWith({ width: 0 });
  await wrapper.setProps({ data: [{ time: 2, value: 110 }] });
  expect(chart.remove).toHaveBeenCalledTimes(1);
  expect(setData).toHaveBeenLastCalledWith([{ time: 2, value: 110 }]);
  expect(fitContent).toHaveBeenCalledTimes(2);
  wrapper.unmount();
  expect(disconnect).toHaveBeenCalledOnce();
  expect(chart.remove).toHaveBeenCalledTimes(2);
});
