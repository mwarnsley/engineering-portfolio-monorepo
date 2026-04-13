import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import HomePage from '../../../src/pages/HomePage.vue';

const state = {
  error: ref(''),
  heading: ref('Popular movies'),
  heroMovie: ref(null),
  loadInitialMovies: vi.fn(),
  loadMore: vi.fn(),
  loading: ref(false),
  movies: ref([]),
  page: ref(1),
  searchTerm: ref(''),
  submitSearch: vi.fn(),
  totalPages: ref(1)
};

vi.mock('../../../src/composables/useMovieSearch', () => ({
  useMovieSearch: () => state
}));

describe('HomePage', () => {
  beforeEach(() => {
    state.error.value = '';
    state.heading.value = 'Popular movies';
    state.heroMovie.value = null;
    state.loading.value = false;
    state.movies.value = [];
    state.page.value = 1;
    state.searchTerm.value = '';
    state.totalPages.value = 1;
    state.loadInitialMovies.mockReset();
    state.loadMore.mockReset();
    state.submitSearch.mockReset();
  });

  it('loads initial movies on mount', () => {
    mount(HomePage, {
      global: {
        stubs: {
          HeroSpotlight: true,
          SearchBar: true,
          EmptyState: true,
          MovieGrid: true
        }
      }
    });

    expect(state.loadInitialMovies).toHaveBeenCalled();
  });

  it('shows the error state when loading fails', () => {
    state.error.value = 'Broken';

    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          HeroSpotlight: true,
          SearchBar: true,
          EmptyState: true,
          MovieGrid: true
        }
      }
    });

    expect(wrapper.findComponent({ name: 'EmptyState' }).exists()).toBe(true);
  });

  it('shows the loading panel before movies arrive', () => {
    state.loading.value = true;

    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          HeroSpotlight: true,
          SearchBar: true,
          EmptyState: true,
          MovieGrid: true
        }
      }
    });

    expect(wrapper.text()).toContain('Loading the latest movie lineup...');
  });

  it('shows the movie grid when movies exist', () => {
    state.movies.value = [{ id: 1, title: 'Alien' }];

    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          HeroSpotlight: true,
          SearchBar: true,
          EmptyState: true,
          MovieGrid: true
        }
      }
    });

    expect(wrapper.findComponent({ name: 'MovieGrid' }).exists()).toBe(true);
  });

  it('passes search events through to the composable', async () => {
    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          HeroSpotlight: true,
          EmptyState: true,
          MovieGrid: true,
          SearchBar: {
            name: 'SearchBar',
            template: '<button class="search-proxy" @click="$emit(\'search\', \'Sicario\')">Search</button>'
          }
        }
      }
    });

    await wrapper.find('.search-proxy').trigger('click');

    expect(state.submitSearch).toHaveBeenCalledWith('Sicario');
  });

  it('shows the load more button when another page exists', () => {
    state.movies.value = [{ id: 1, title: 'Alien' }];
    state.page.value = 1;
    state.totalPages.value = 3;

    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          HeroSpotlight: true,
          SearchBar: true,
          EmptyState: true,
          MovieGrid: {
            name: 'MovieGrid',
            props: ['title', 'movies'],
            template: '<div><slot name="actions" /></div>'
          }
        }
      }
    });

    expect(wrapper.find('.ghost-button').exists()).toBe(true);
  });

  it('runs loadMore when the button is clicked', async () => {
    state.movies.value = [{ id: 1, title: 'Alien' }];
    state.page.value = 1;
    state.totalPages.value = 3;

    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          HeroSpotlight: true,
          SearchBar: true,
          EmptyState: true,
          MovieGrid: {
            name: 'MovieGrid',
            props: ['title', 'movies'],
            template: '<div><slot name="actions" /></div>'
          }
        }
      }
    });

    await wrapper.find('.ghost-button').trigger('click');

    expect(state.loadMore).toHaveBeenCalled();
  });
});
