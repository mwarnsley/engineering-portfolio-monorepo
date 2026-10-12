import type { ReactElement, ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

export interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  /**
   * Initial router entries for the in-memory router.
   * @default ['/']
   */
  initialEntries?: string[];
}

/**
 * Renders UI wrapped in the app's providers and returns a configured `user-event` instance.
 * @param {ReactElement} ui - The element under test.
 * @param {RenderWithProvidersOptions} [options={}] - Router entries and RTL render options.
 * @returns The RTL render result plus a `user` instance for realistic interaction.
 * @example
 * const { user } = renderWithProviders(<ViewportToggle value="desktop" onChange={fn} />);
 */
export const renderWithProviders = (
  ui: ReactElement,
  { initialEntries = ['/'], ...options }: RenderWithProvidersOptions = {}
) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  );

  return { user: userEvent.setup(), ...render(ui, { wrapper: Wrapper, ...options }) };
};

export { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
