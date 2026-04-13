import { mount } from '@vue/test-utils';
import MovieCard from '../../../src/components/MovieCard.vue';

const movie = {
  id: 7,
  title: 'Heat',
  release_date: '1995-12-15',
  poster_path: '/heat.jpg',
  vote_average: 8.2
};

describe('MovieCard', () => {
  it('renders the movie title', () => {
    const wrapper = mount(MovieCard, { props: { movie } });

    expect(wrapper.text()).toContain('Heat');
  });

  it('shows the release year', () => {
    const wrapper = mount(MovieCard, { props: { movie } });

    expect(wrapper.text()).toContain('1995');
  });

  it('formats the rating to one decimal place', () => {
    const wrapper = mount(MovieCard, { props: { movie } });

    expect(wrapper.text()).toContain('TMDB 8.2');
  });

  it('links to the details page', () => {
    const wrapper = mount(MovieCard, { props: { movie } });

    expect(wrapper.find('.movie-card').attributes('href')).toBe('/movie/7');
  });
});
