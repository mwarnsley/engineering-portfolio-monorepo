import { flushPromises, mount } from '@vue/test-utils';
import MovieDetailsPage from '../../../src/pages/MovieDetailsPage.vue';

const { getMovieDetails, getMovieCredits } = vi.hoisted(() => ({
  getMovieDetails: vi.fn(),
  getMovieCredits: vi.fn()
}));

vi.mock('../../../src/lib/tmdb', () => ({
  getImageUrl: vi.fn((path, size = 'w780') => `${size}:${path || 'fallback'}`),
  getMovieCredits,
  getMovieDetails
}));

const movie = {
  id: 1,
  title: 'Blade Runner',
  poster_path: '/poster.jpg',
  release_date: '1982-06-25',
  runtime: 117,
  vote_average: 8.1,
  budget: 28000000,
  revenue: 41000000,
  overview: 'Replicants on the run.',
  genres: [{ id: 1, name: 'Sci-Fi' }]
};

const credits = {
  cast: [{ id: 5, credit_id: 'five', name: 'Harrison Ford', character: 'Deckard' }],
  crew: [{ id: 6, name: 'Ridley Scott', job: 'Director' }]
};

const globalStubs = {
  EmptyState: {
    name: 'EmptyState',
    template: '<div class="empty-state-stub"></div>'
  },
  CastGrid: {
    name: 'CastGrid',
    template: '<div class="cast-grid-stub"></div>'
  }
};

describe('MovieDetailsPage', () => {
  beforeEach(() => {
    getMovieDetails.mockReset();
    getMovieCredits.mockReset();
  });

  it('loads movie details on mount', async () => {
    getMovieDetails.mockResolvedValue(movie);
    getMovieCredits.mockResolvedValue(credits);

    mount(MovieDetailsPage, {
      props: { id: '1' },
      global: {
        stubs: globalStubs
      }
    });

    await flushPromises();

    expect(getMovieDetails).toHaveBeenCalledWith('1');
  });

  it('loads movie credits on mount', async () => {
    getMovieDetails.mockResolvedValue(movie);
    getMovieCredits.mockResolvedValue(credits);

    mount(MovieDetailsPage, {
      props: { id: '1' },
      global: {
        stubs: globalStubs
      }
    });

    await flushPromises();

    expect(getMovieCredits).toHaveBeenCalledWith('1');
  });

  it('renders the movie title after loading', async () => {
    getMovieDetails.mockResolvedValue(movie);
    getMovieCredits.mockResolvedValue(credits);

    const wrapper = mount(MovieDetailsPage, {
      props: { id: '1' },
      global: {
        stubs: globalStubs
      }
    });

    await flushPromises();

    expect(wrapper.text()).toContain('Blade Runner');
  });

  it('renders the directors label', async () => {
    getMovieDetails.mockResolvedValue(movie);
    getMovieCredits.mockResolvedValue(credits);

    const wrapper = mount(MovieDetailsPage, {
      props: { id: '1' },
      global: {
        stubs: globalStubs
      }
    });

    await flushPromises();

    expect(wrapper.text()).toContain('Ridley Scott');
  });

  it('shows the cast grid when cast exists', async () => {
    getMovieDetails.mockResolvedValue(movie);
    getMovieCredits.mockResolvedValue(credits);

    const wrapper = mount(MovieDetailsPage, {
      props: { id: '1' },
      global: {
        stubs: globalStubs
      }
    });

    await flushPromises();

    expect(wrapper.find('.cast-grid-stub').exists()).toBe(true);
  });

  it('shows an error state when loading fails', async () => {
    getMovieDetails.mockRejectedValue(new Error('Nope'));
    getMovieCredits.mockResolvedValue(credits);

    const wrapper = mount(MovieDetailsPage, {
      props: { id: '1' },
      global: {
        stubs: globalStubs
      }
    });

    await flushPromises();

    expect(wrapper.find('.empty-state-stub').exists()).toBe(true);
  });

  it('reloads data when the route id changes', async () => {
    getMovieDetails.mockResolvedValue(movie);
    getMovieCredits.mockResolvedValue(credits);

    const wrapper = mount(MovieDetailsPage, {
      props: { id: '1' },
      global: {
        stubs: globalStubs
      }
    });

    await flushPromises();
    await wrapper.setProps({ id: '2' });
    await flushPromises();

    expect(getMovieDetails).toHaveBeenLastCalledWith('2');
  });
});
