import { createMemoryHistory } from 'vue-router';
import { createAppRouter, routes, scrollBehavior } from '../../../src/router/index';

describe('router', () => {
  it('defines the home route', () => {
    expect(routes[0].path).toBe('/');
  });

  it('defines the movie details route', () => {
    expect(routes[1].path).toBe('/movie/:id');
  });

  it('maps movie detail params as props', () => {
    expect(routes[1].props).toBe(true);
  });

  it('redirects unknown routes home', () => {
    expect(routes[2].redirect).toBe('/');
  });

  it('returns to the top on scroll', () => {
    expect(scrollBehavior()).toEqual({ top: 0 });
  });

  it('creates a working router instance', async () => {
    const router = createAppRouter(createMemoryHistory());

    await router.push('/');

    expect(router.currentRoute.value.name).toBe('home');
  });
});
