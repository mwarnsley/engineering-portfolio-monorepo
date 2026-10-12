import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface UseModalBehaviorOptions {
  /** Whether the modal is currently open. */
  isOpen: boolean;
  /** Called when the user requests dismissal (Escape key). */
  onClose: () => void;
  /** Container whose focusable descendants form the focus trap. */
  containerRef: RefObject<HTMLElement | null>;
  /** Element focused when the modal opens. Falls back to the first focusable element. */
  initialFocusRef?: RefObject<HTMLElement | null>;
}

/**
 * Applies accessible modal behavior: Escape-to-close, a Tab focus trap, body scroll lock, and
 * focus restoration to the previously focused element on close.
 * @param {UseModalBehaviorOptions} options - Open state, close handler, and focus targets.
 * @returns {void}
 * @example
 * useModalBehavior({ isOpen, onClose, containerRef: panelRef, initialFocusRef: closeButtonRef });
 */
export const useModalBehavior = ({
  isOpen,
  onClose,
  containerRef,
  initialFocusRef,
}: UseModalBehaviorOptions): void => {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const getFocusable = () =>
      Array.from(containerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []);

    const focusTimer = window.setTimeout(() => {
      (initialFocusRef?.current ?? getFocusable()[0])?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [isOpen, containerRef, initialFocusRef]);
};
