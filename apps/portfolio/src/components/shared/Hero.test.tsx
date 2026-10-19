import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders, screen } from '@/test';
import { Hero } from './Hero';

const renderHero = () => {
  const onOpenTerminal = vi.fn();
  const onOpenProfile = vi.fn();
  const utils = renderWithProviders(
    <Hero
      onOpenTerminal={onOpenTerminal}
      onOpenProfile={onOpenProfile}
      onOpenArchitecture={vi.fn()}
    />
  );
  return { ...utils, onOpenTerminal, onOpenProfile };
};

describe('Hero', () => {
  it('should render a role-only kicker without repeating the name', () => {
    renderHero();
    const kicker = screen.getByText('Senior Frontend Engineer', { selector: 'p' });
    expect(kicker).not.toHaveTextContent('Marcus Warnsley');
  });

  it('should render the page heading', () => {
    renderHero();
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Engineering scalable, accessible frontend systems.',
      })
    ).toBeInTheDocument();
  });

  it('should state 10+ years of enterprise experience in the bio', () => {
    renderHero();
    expect(screen.getByText(/10\+ years of enterprise experience/)).toBeInTheDocument();
  });

  it('should not render the floating role badge', () => {
    renderHero();
    expect(screen.queryByText(/Remote/)).not.toBeInTheDocument();
  });

  it('should render the system blueprint card', () => {
    renderHero();
    expect(screen.getByRole('region', { name: /System Blueprint/ })).toBeInTheDocument();
  });

  it('should open the résumé drawer from View Résumé', async () => {
    const { user, onOpenProfile } = renderHero();
    await user.click(screen.getByRole('button', { name: 'View Résumé' }));
    expect(onOpenProfile).toHaveBeenCalledTimes(1);
  });

  it('should open the CLI from the inline link', async () => {
    const { user, onOpenTerminal } = renderHero();
    await user.click(screen.getByRole('button', { name: /interactive CLI/ }));
    expect(onOpenTerminal).toHaveBeenCalledTimes(1);
  });
});
