import { renderHook, act } from '@testing-library/react';

import { EXIT_DURATION_MS, TEXT_EXIT_DELAY_MS, TRANSITION_MS, ViewPhase, useViewPhase } from './unconfiguredPanelUtils';

describe('unconfiguredPanelUtils', () => {
  describe('TRANSITION_MS', () => {
    it('equals EXIT_DURATION_MS + TEXT_EXIT_DELAY_MS', () => {
      expect(TRANSITION_MS).toBe(EXIT_DURATION_MS + TEXT_EXIT_DELAY_MS);
    });
  });

  describe('useViewPhase', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      act(() => jest.runOnlyPendingTimers());
      jest.useRealTimers();
    });

    describe('initial state', () => {
      it('starts as QuietInitial when isActive is false', () => {
        const { result } = renderHook(() => useViewPhase(false));
        expect(result.current).toBe(ViewPhase.QuietInitial);
      });

      it('starts as Active when isActive is true', () => {
        const { result } = renderHook(() => useViewPhase(true));
        expect(result.current).toBe(ViewPhase.Active);
      });
    });

    describe('transitioning to active (false → true)', () => {
      it('immediately enters TransitioningToActive', () => {
        const { result, rerender } = renderHook(({ isActive }) => useViewPhase(isActive), {
          initialProps: { isActive: false },
        });

        act(() => rerender({ isActive: true }));
        expect(result.current).toBe(ViewPhase.TransitioningToActive);
      });

      it('settles to Active after TRANSITION_MS', () => {
        const { result, rerender } = renderHook(({ isActive }) => useViewPhase(isActive), {
          initialProps: { isActive: false },
        });

        act(() => rerender({ isActive: true }));
        act(() => jest.advanceTimersByTime(TRANSITION_MS));
        expect(result.current).toBe(ViewPhase.Active);
      });

      it('does not settle before TRANSITION_MS elapses', () => {
        const { result, rerender } = renderHook(({ isActive }) => useViewPhase(isActive), {
          initialProps: { isActive: false },
        });

        act(() => rerender({ isActive: true }));
        act(() => jest.advanceTimersByTime(TRANSITION_MS - 1));
        expect(result.current).toBe(ViewPhase.TransitioningToActive);
      });
    });

    describe('transitioning to quiet (true → false)', () => {
      it('immediately enters TransitioningToQuiet', () => {
        const { result, rerender } = renderHook(({ isActive }) => useViewPhase(isActive), {
          initialProps: { isActive: true },
        });

        act(() => rerender({ isActive: false }));
        expect(result.current).toBe(ViewPhase.TransitioningToQuiet);
      });

      it('settles to Quiet after TRANSITION_MS', () => {
        const { result, rerender } = renderHook(({ isActive }) => useViewPhase(isActive), {
          initialProps: { isActive: true },
        });

        act(() => rerender({ isActive: false }));
        act(() => jest.advanceTimersByTime(TRANSITION_MS));
        expect(result.current).toBe(ViewPhase.Quiet);
      });

      it('does not settle before TRANSITION_MS elapses', () => {
        const { result, rerender } = renderHook(({ isActive }) => useViewPhase(isActive), {
          initialProps: { isActive: true },
        });

        act(() => rerender({ isActive: false }));
        act(() => jest.advanceTimersByTime(TRANSITION_MS - 1));
        expect(result.current).toBe(ViewPhase.TransitioningToQuiet);
      });
    });

    describe('mid-transition reversal', () => {
      it('cancels a pending to-active transition when flipped back', () => {
        const { result, rerender } = renderHook(({ isActive }) => useViewPhase(isActive), {
          initialProps: { isActive: false },
        });

        act(() => rerender({ isActive: true }));
        act(() => jest.advanceTimersByTime(TRANSITION_MS / 2));

        // Flip back before the timer fires
        act(() => rerender({ isActive: false }));
        expect(result.current).toBe(ViewPhase.TransitioningToQuiet);

        // The original timer should not fire and resolve to Active
        act(() => jest.advanceTimersByTime(TRANSITION_MS));
        expect(result.current).toBe(ViewPhase.Quiet);
      });

      it('cancels a pending to-quiet transition when flipped back', () => {
        const { result, rerender } = renderHook(({ isActive }) => useViewPhase(isActive), {
          initialProps: { isActive: true },
        });

        act(() => rerender({ isActive: false }));
        act(() => jest.advanceTimersByTime(TRANSITION_MS / 2));

        // Flip back before the timer fires
        act(() => rerender({ isActive: true }));
        expect(result.current).toBe(ViewPhase.TransitioningToActive);

        act(() => jest.advanceTimersByTime(TRANSITION_MS));
        expect(result.current).toBe(ViewPhase.Active);
      });
    });
  });
});
