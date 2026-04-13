import { mount } from '@vue/test-utils';
import MovieGrid from '../../../src/components/MovieGrid.vue';

const movies = [
  { id: 1, title: 'Alien', poster_path: '/alien.jpg', release_date: '1979-05-25', vote_average: 8.4 },
  { id: 2, title: 'Aliens', poster_path: '/aliens.jpg', release_date: '1986-07-18', vote_average: 8.3 }
];

describe('MovieGrid', () => {
  it('renders the section title', () => {
    const wrapper = mount(MovieGrid, {
      props: {
        title: 'Popular movies',
        movies
      }
    });

    expect(wrapper.text()).toContain('Popular movies');
  });

  it('renders all movie cards', () => {
    const wrapper = mount(MovieGrid, {
      props: {
        title: 'Popular movies',
        movies
      }
    });

    expect(wrapper.findAllComponents({ name: 'MovieCard' })).toHaveLength(2);
  });

  it('renders slot content in the actions area', () => {
    const wrapper = mount(MovieGrid, {
      props: {
        title: 'Popular movies',
        movies
      },
      slots: {
        actions: '<button class="test-action">More</button>'
      }
    });

    expect(wrapper.find('.test-action').exists()).toBe(true);
  });
});
