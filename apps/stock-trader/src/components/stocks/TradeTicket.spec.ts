import { expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import TradeTicket from './TradeTicket.vue';
const stock = { symbol: 'AAPL', price: 100, change: 1, changePercent: 1 };
const holding = { symbol: 'AAPL', shares: 3, averagePrice: 100 };
it('normalizes share inputs and emits buy orders with an estimated total', async () => {
  const wrapper = mount(TradeTicket, { props: { stock, cash: 1000 } });
  expect(wrapper.findAll('button')[1].attributes('disabled')).toBeDefined();
  await wrapper.get('input').setValue(3);
  expect(wrapper.text()).toContain('$300.00');
  await wrapper.findAll('button')[2].trigger('click');
  expect(wrapper.emitted('buy')).toEqual([[3]]);
  wrapper.unmount();
});
it.each(['', '-2', '0'])('normalizes invalid shares %s to one', async (value) => {
  const wrapper = mount(TradeTicket, { props: { stock, cash: 1000 } });
  await wrapper.get('input').setValue(value);
  await wrapper.findAll('button')[2].trigger('click');
  expect(wrapper.emitted('buy')).toEqual([[1]]);
  wrapper.unmount();
});
it('executes sells, keeps sell mode for remaining shares, and resets it when the position closes', async () => {
  const wrapper = mount(TradeTicket, { props: { stock, cash: 1000, holding } });
  await wrapper.findAll('button')[1].trigger('click');
  await wrapper.setProps({ holding: { ...holding, shares: 2 } });
  await wrapper.findAll('button')[2].trigger('click');
  expect(wrapper.emitted('sell')).toEqual([[1]]);
  await wrapper.setProps({ holding: undefined });
  expect(wrapper.text()).toContain('Buy order');
  await wrapper.findAll('button')[0].trigger('click');
  expect(wrapper.findAll('button')[2].text()).toBe('Execute Buy');
  wrapper.unmount();
});
