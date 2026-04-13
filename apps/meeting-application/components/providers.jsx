'use client';

import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

const theme = createTheme({
  primaryColor: 'cyan',
  defaultRadius: 'md',
  fontFamily: 'var(--font-sans), sans-serif',
  headings: {
    fontFamily: 'var(--font-display), sans-serif',
  },
  colors: {
    midnight: [
      '#eef6ff',
      '#d7e4fb',
      '#aec8f4',
      '#81aae9',
      '#5b90e0',
      '#447fdc',
      '#3676dc',
      '#2565c4',
      '#1859af',
      '#004b9a',
    ],
    ember: [
      '#fff3ea',
      '#ffe2cf',
      '#ffc39f',
      '#ffa16a',
      '#ff8540',
      '#ff731f',
      '#ff6910',
      '#e45604',
      '#cb4b00',
      '#b03d00',
    ],
  },
});

export function AppProviders({ children }) {
  return (
    <MantineProvider forceColorScheme="light" theme={theme}>
      <Notifications position="top-right" />
      {children}
    </MantineProvider>
  );
}
