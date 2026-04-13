import '@testing-library/jest-dom';
import React from 'react';

global.IS_REACT_ACT_ENVIRONMENT = true;
global.mockPathname = '/';
global.mockRefresh = jest.fn();
global.mockPush = jest.fn();

if (!global.matchMedia) {
  global.matchMedia = () => ({
    addEventListener: jest.fn(),
    addListener: jest.fn(),
    dispatchEvent: jest.fn(),
    matches: false,
    media: '',
    onchange: null,
    removeEventListener: jest.fn(),
    removeListener: jest.fn(),
  });
}

if (!global.ResizeObserver) {
  global.ResizeObserver = class {
    disconnect() {}
    observe() {}
    unobserve() {}
  };
}

if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = jest.fn();
}

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }) =>
    React.createElement(
      'a',
      {
        href: typeof href === 'string' ? href : href?.pathname || '',
        ...props,
      },
      children
    ),
}));

jest.mock('next/navigation', () => ({
  usePathname: () => global.mockPathname,
  useRouter: () => ({
    push: global.mockPush,
    refresh: global.mockRefresh,
  }),
}));

jest.mock('next/dynamic', () => () => {
  return function MockDynamicComponent() {
    return null;
  };
});

jest.mock('@mantine/notifications', () => {
  const ReactModule = require('react');

  return {
    Notifications: () => ReactModule.createElement('div', { 'data-testid': 'notifications-root' }),
    notifications: {
      show: jest.fn(),
    },
  };
});

beforeEach(() => {
  global.mockPathname = '/';
  global.mockPush.mockReset();
  global.mockRefresh.mockReset();
});
