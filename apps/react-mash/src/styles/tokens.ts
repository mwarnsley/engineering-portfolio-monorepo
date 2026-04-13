import { css } from 'styled-components';

export const colors = {
  background: '#f6f0ff',
  backgroundAccent: '#dff8ff',
  surface: '#ffffff',
  ink: '#241a4a',
  inkSoft: '#6f6791',
  primary: '#7158ff',
  secondary: '#0fa3b1',
  error: '#c94463',
  accents: {
    Crushes: '#ff5fa2',
    Careers: '#37c978',
    Pets: '#00a6fb',
    Vehicles: '#ff8a5b',
    Kids: '#e8c547',
    Honeymoon: '#ff7f97',
  },
} as const;

export const globalStyles = css`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-width: 320px;
    font-family: 'Trebuchet MS', 'Avenir Next', 'Segoe UI', sans-serif;
    color: ${colors.ink};
    background:
      radial-gradient(circle at top left, rgba(255, 95, 162, 0.24), transparent 34%),
      radial-gradient(circle at top right, rgba(15, 163, 177, 0.18), transparent 28%),
      linear-gradient(180deg, ${colors.background} 0%, ${colors.backgroundAccent} 100%);
  }

  button,
  input,
  select {
    font: inherit;
  }

  #root {
    min-height: 100vh;
  }
`;
