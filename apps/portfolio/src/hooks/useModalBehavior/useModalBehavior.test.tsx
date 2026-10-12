import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders, screen } from '@/test';
import { useModalBehavior } from './useModalBehavior';

const Harness = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null);
  useModalBehavior({ isOpen, onClose, containerRef, initialFocusRef });

  return (
    <>
      <button type="button">Outside</button>
      <div ref={containerRef}>
        <button type="button" ref={initialFocusRef}>
          First
        </button>
        <button type="button">Last</button>
      </div>
    </>
  );
};

describe('useModalBehavior', () => {
  it('should focus the initial focus target when opened', async () => {
    renderWithProviders(<Harness isOpen onClose={vi.fn()} />);
    expect(await screen.findByRole('button', { name: 'First' })).toHaveFocus();
  });

  it('should lock body scroll while open', () => {
    renderWithProviders(<Harness isOpen onClose={vi.fn()} />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should restore body scroll when closed', () => {
    const { rerender } = renderWithProviders(<Harness isOpen onClose={vi.fn()} />);
    rerender(<Harness isOpen={false} onClose={vi.fn()} />);
    expect(document.body.style.overflow).toBe('');
  });

  it('should call onClose on Escape', async () => {
    const onClose = vi.fn();
    const { user } = renderWithProviders(<Harness isOpen onClose={onClose} />);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should ignore Escape while closed', async () => {
    const onClose = vi.fn();
    const { user } = renderWithProviders(<Harness isOpen={false} onClose={onClose} />);
    await user.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should wrap Tab from the last element to the first', async () => {
    const { user } = renderWithProviders(<Harness isOpen onClose={vi.fn()} />);
    await screen.findByRole('button', { name: 'First' });
    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
  });

  it('should wrap Shift+Tab from the first element to the last', async () => {
    const { user } = renderWithProviders(<Harness isOpen onClose={vi.fn()} />);
    await screen.findByRole('button', { name: 'First' });
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus();
  });
});
