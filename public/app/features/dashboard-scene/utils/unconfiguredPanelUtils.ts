import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState } from 'react';
import useMountedState from 'react-use/lib/useMountedState';

export enum ViewPhase {
  QuietInitial = 'quiet-initial',
  Quiet = 'quiet',
  TransitioningToActive = 'transitioning-to-active',
  Active = 'active',
  TransitioningToQuiet = 'transitioning-to-quiet',
}

export const EXIT_DURATION_MS = 400;
export const EXIT_EASING = 'cubic-bezier(0.2, 0, 0, 1)';
export const TEXT_EXIT_DELAY_MS = 30;
export const BUTTON_ANIM_DURATION_MS = 200;
export const BUTTON_STAGGER_INTERVAL_MS = 60;
export const TRANSITION_MS = EXIT_DURATION_MS + TEXT_EXIT_DELAY_MS;

function createFadeSlideKeyframes(yOffset: number, blur: number) {
  const blurOn = blur > 0 ? `blur(${blur}px)` : 'blur(0px)';
  return {
    enter: stylex.keyframes({
      from: { transform: `translateY(${yOffset}px)`, opacity: 0, filter: blurOn },
      to: { transform: 'translateY(0)', opacity: 1, filter: 'blur(0px)' },
    }),
    exit: stylex.keyframes({
      from: { transform: 'translateY(0)', opacity: 1, filter: 'blur(0px)' },
      to: { transform: `translateY(${yOffset}px)`, opacity: 0, filter: blurOn },
    }),
  };
}

const fadeSlide10_0 = createFadeSlideKeyframes(10, 0);
const fadeSlide10_3 = createFadeSlideKeyframes(10, 3);

export const gearFrames = createFadeSlideKeyframes(-30, 3);
export const textFrames = createFadeSlideKeyframes(20, 3);
export const buttonFrames = createFadeSlideKeyframes(8, 0);

export function fadeSlide(yOffset: number, blur = 0) {
  if (yOffset === 10 && blur === 0) {
    return fadeSlide10_0;
  }
  if (yOffset === 10 && blur === 3) {
    return fadeSlide10_3;
  }
  if (yOffset === -30 && blur === 3) {
    return gearFrames;
  }
  if (yOffset === 20 && blur === 3) {
    return textFrames;
  }
  if (yOffset === 8 && blur === 0) {
    return buttonFrames;
  }
  return fadeSlide10_0;
}

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
