import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import MetricCard from '@/components/stocks/MetricCard.vue';

describe('MetricCard', () => {
  it('renders the title', () => {
    const wrapper = mount(MetricCard, {
      props: {
        title: 'Cash Balance',
        value: '$10,000.00',
        detail: 'Test detail',
        trend: 'positive',
      },
    });

    expect(wrapper.text()).toContain('Cash Balance');
  });

  it('renders the metric value', () => {
    const wrapper = mount(MetricCard, {
      props: {
        title: 'Cash Balance',
        value: '$10,000.00',
        detail: 'Test detail',
        trend: 'positive',
      },
    });

    expect(wrapper.text()).toContain('$10,000.00');
  });
});
