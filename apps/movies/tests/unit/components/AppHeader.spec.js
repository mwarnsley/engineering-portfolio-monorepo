import { mount } from '@vue/test-utils';
import AppHeader from '../../../src/components/AppHeader.vue';

describe('AppHeader', () => {
  it('shows the app title', () => {
    const wrapper = mount(AppHeader);

    expect(wrapper.text()).toContain('Movies');
  });

  it('links the brand to the home page', () => {
    const wrapper = mount(AppHeader);

    expect(wrapper.find('.site-header__brand').attributes('href')).toBe('/');
  });

  it('shows the TMDB attribution text', () => {
    const wrapper = mount(AppHeader);

    expect(wrapper.text()).toContain('Powered by TMDB');
  });

  it('opens the TMDB link in a new tab', () => {
    const wrapper = mount(AppHeader);

    expect(wrapper.find('.site-header__link').attributes('target')).toBe('_blank');
  });
});
