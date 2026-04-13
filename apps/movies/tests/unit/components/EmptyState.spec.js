import { mount } from '@vue/test-utils';
import EmptyState from '../../../src/components/EmptyState.vue';

describe('EmptyState', () => {
  it('renders the title', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'Nothing here',
        message: 'Try again later.'
      }
    });

    expect(wrapper.find('h2').text()).toBe('Nothing here');
  });

  it('renders the message', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'Nothing here',
        message: 'Try again later.'
      }
    });

    expect(wrapper.text()).toContain('Try again later.');
  });

  it('uses the default eyebrow text', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'Nothing here',
        message: 'Try again later.'
      }
    });

    expect(wrapper.text()).toContain('Heads up');
  });

  it('renders a custom eyebrow text', () => {
    const wrapper = mount(EmptyState, {
      props: {
        eyebrow: 'Search',
        title: 'Nothing here',
        message: 'Try again later.'
      }
    });

    expect(wrapper.text()).toContain('Search');
  });
});
