import { useEffect, useRef, useState } from 'react';
import useMountedState from 'react-use/lib/useMountedState';

export enum ViewPhase {
  QuietInitial = 'quiet-initial',
  Quiet = 'quiet',
  TransitioningToActive = 'transitioning-to-active',
  Active = 'active',
  TransitioningToQuiet = 'transitioning-to-quiet',
}

// UnconfiguredPanel's StyleX animations repeat these timings as literals.
export const EXIT_DURATION_MS = 400;
export const EXIT_EASING = 'cubic-bezier(0.2, 0, 0, 1)';
export const TEXT_EXIT_DELAY_MS = 30;
export const BUTTON_ANIM_DURATION_MS = 200;
export const BUTTON_STAGGER_INTERVAL_MS = 60;
// Longest path: text exit finishes at 400 + 30 = 430ms
export const TRANSITION_MS = EXIT_DURATION_MS + TEXT_EXIT_DELAY_MS;

export function useViewPhase(isActive: boolean): ViewPhase {
  const [phase, setPhase] = useState<ViewPhase>(() => (isActive ? ViewPhase.Active : ViewPhase.QuietInitial));
  const isMounted = useMountedState();
  const isFirstRenderRef = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const nextPhase = isActive ? ViewPhase.TransitioningToActive : ViewPhase.TransitioningToQuiet;
    const settledPhase = isActive ? ViewPhase.Active : ViewPhase.Quiet;

    setPhase(nextPhase);
    timerRef.current = setTimeout(() => {
      if (isMounted()) {
        setPhase(settledPhase);
      }
      timerRef.current = null;
    }, TRANSITION_MS);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isActive, isMounted]);

  return phase;
}
