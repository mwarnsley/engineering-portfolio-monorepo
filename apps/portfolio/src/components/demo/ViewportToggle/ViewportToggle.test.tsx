import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders, screen } from '@/test';
import { ViewportToggle, type DemoViewport } from './ViewportToggle';

describe('ViewportToggle', () => {
  it('should expose a labelled group', () => {
    renderWithProviders(<ViewportToggle value="desktop" onChange={vi.fn()} />);
    expect(screen.getByRole('group', { name: 'Preview viewport' })).toBeInTheDocument();
  });

  it.each<DemoViewport>(['desktop', 'tablet', 'mobile'])(
    'should mark only the %s option as pressed when selected',
    (viewport) => {
      renderWithProviders(<ViewportToggle value={viewport} onChange={vi.fn()} />);
      const pressed = screen.getAllByRole('button', { pressed: true });
      expect(pressed).toHaveLength(1);
      expect(pressed[0]).toHaveAccessibleName(new RegExp(viewport, 'i'));
    }
  );

  it.each<[string, DemoViewport]>([
    ['Tablet', 'tablet'],
    ['Mobile', 'mobile'],
  ])('should call onChange with %s when pressed', async (label, expected) => {
    const onChange = vi.fn();
    const { user } = renderWithProviders(<ViewportToggle value="desktop" onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: label }));
    expect(onChange).toHaveBeenCalledWith(expected);
  });

  it('should hide decorative icons from assistive technology', () => {
    const { container } = renderWithProviders(
      <ViewportToggle value="desktop" onChange={vi.fn()} />
    );
    expect(container.querySelectorAll('svg:not([aria-hidden="true"])')).toHaveLength(0);
  });
});
