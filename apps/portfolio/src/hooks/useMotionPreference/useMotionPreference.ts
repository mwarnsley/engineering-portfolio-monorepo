import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/** Supplements Motion's initial preference snapshot with live OS preference changes. */
export function useMotionPreference() {
  const initialPreference = useReducedMotion();
  const [livePreference, setLivePreference] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = (event: MediaQueryListEvent) => setLivePreference(event.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return livePreference ?? initialPreference ?? true;
}
