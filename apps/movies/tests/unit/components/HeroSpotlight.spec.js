import { mount } from '@vue/test-utils';
import HeroSpotlight from '../../../src/components/HeroSpotlight.vue';

const movie = {
  id: 42,
  title: 'Arrival',
  overview: 'First contact changes everything.',
  backdrop_path: '/arrival.jpg'
};

describe('HeroSpotlight', () => {
  it('renders the movie title', () => {
    const wrapper = mount(HeroSpotlight, { props: { movie } });

    expect(wrapper.find('h1').text()).toBe('Arrival');
  });

  it('renders the overview when present', () => {
    const wrapper = mount(HeroSpotlight, { props: { movie } });

    expect(wrapper.text()).toContain('First contact changes everything.');
  });

  it('links to the movie details page', () => {
    const wrapper = mount(HeroSpotlight, { props: { movie } });

    expect(wrapper.find('.hero-card__cta').attributes('href')).toBe('/movie/42');
  });

  it('falls back when no overview exists', () => {
    const wrapper = mount(HeroSpotlight, {
      props: {
        movie: {
          ...movie,
          overview: ''
        }
      }
    });

    expect(wrapper.text()).toContain('A hand-picked spotlight from the current catalog.');
  });
});
