import { shallowMount } from '@vue/test-utils';
import App from '../../../src/App.vue';

describe('App', () => {
  it('renders the app shell', () => {
    const wrapper = shallowMount(App, {
      global: {
        stubs: {
          AppHeader: true
        }
      }
    });

    expect(wrapper.find('.app-shell').exists()).toBe(true);
  });

  it('renders the backdrop', () => {
    const wrapper = shallowMount(App, {
      global: {
        stubs: {
          AppHeader: true
        }
      }
    });

    expect(wrapper.find('.app-shell__backdrop').exists()).toBe(true);
  });

  it('renders the main content area', () => {
    const wrapper = shallowMount(App, {
      global: {
        stubs: {
          AppHeader: true
        }
      }
    });

    expect(wrapper.find('.app-shell__main').exists()).toBe(true);
  });
});
