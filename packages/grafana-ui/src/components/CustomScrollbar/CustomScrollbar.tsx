import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import { type RefCallback, useCallback, useEffect, useRef, type JSX } from 'react';
import * as React from 'react';
import Scrollbars, { type positionValues } from 'react-custom-scrollbars-2';

import './CustomScrollbar.global.css';
import { ScrollIndicators } from './ScrollIndicators';

export type ScrollbarPosition = positionValues;

interface Props {
  className?: string;
  testId?: string;
  autoHide?: boolean;
  autoHideTimeout?: number;
  autoHeightMax?: string;
  hideTracksWhenNotNeeded?: boolean;
  hideHorizontalTrack?: boolean;
  hideVerticalTrack?: boolean;
  scrollRefCallback?: RefCallback<HTMLDivElement>;
  scrollTop?: number;
  setScrollTop?: (position: ScrollbarPosition) => void;
  showScrollIndicators?: boolean;
  autoHeightMin?: number | string;
  updateAfterMountMs?: number;
  onScroll?: React.UIEventHandler;
  divId?: string;
}

/**
 * Wraps component into <Scrollbars> component from `react-custom-scrollbars`
 * @deprecated Use `ScrollContainer` from `@grafana/ui` instead. It uses native scrollbars and has a simpler API.
 */
export const CustomScrollbar = ({
  autoHide = false,
  autoHideTimeout = 200,
  setScrollTop,
  className,
  testId,
  autoHeightMin = '0',
  autoHeightMax = '100%',
  hideTracksWhenNotNeeded = false,
  hideHorizontalTrack,
  hideVerticalTrack,
  scrollRefCallback,
  showScrollIndicators = false,
  updateAfterMountMs,
  scrollTop,
  onScroll,
  children,
  divId,
}: React.PropsWithChildren<Props>) => {
  const ref = useRef<Scrollbars & { view: HTMLDivElement; update: () => void }>(null);

  useEffect(() => {
    if (ref.current && scrollRefCallback) {
      scrollRefCallback(ref.current.view);
    }
  }, [ref, scrollRefCallback]);

  useScrollTop(ref.current, scrollTop);

  /**
   * Special logic for doing a update a few milliseconds after mount to check for
   * updated height due to dynamic content
   */
  useEffect(() => {
    if (!updateAfterMountMs) {
      return;
    }
    setTimeout(() => {
      const scrollbar = ref.current;
      if (scrollbar?.update) {
        scrollbar.update();
      }
    }, updateAfterMountMs);
  }, [updateAfterMountMs]);

  function renderTrack(className: string, hideTrack: boolean | undefined, passedProps: JSX.IntrinsicElements['div']) {
    if (passedProps.style && hideTrack) {
      passedProps.style.display = 'none';
    }

    return <div {...passedProps} className={className} />;
  }

  const renderTrackHorizontal = useCallback(
    (passedProps: JSX.IntrinsicElements['div']) => {
      return renderTrack('track-horizontal', hideHorizontalTrack, passedProps);
    },
    [hideHorizontalTrack]
  );

  const renderTrackVertical = useCallback(
    (passedProps: JSX.IntrinsicElements['div']) => {
      return renderTrack('track-vertical', hideVerticalTrack, passedProps);
    },
    [hideVerticalTrack]
  );

  const renderThumbHorizontal = useCallback((passedProps: JSX.IntrinsicElements['div']) => {
    return <div {...passedProps} className="thumb-horizontal" />;
  }, []);

  const renderThumbVertical = useCallback((passedProps: JSX.IntrinsicElements['div']) => {
    return <div {...passedProps} className="thumb-vertical" />;
  }, []);

  const renderView = useCallback(
    (passedProps: JSX.IntrinsicElements['div']) => {
      // fixes issues of visibility on safari and ios devices
      if (passedProps.style && passedProps.style['WebkitOverflowScrolling'] === 'touch') {
        passedProps.style['WebkitOverflowScrolling'] = 'auto';
      }

      return <div {...passedProps} className="scrollbar-view" id={divId} />;
    },
    [divId]
  );

  const onScrollStop = useCallback(() => {
    ref.current && setScrollTop && setScrollTop(ref.current.getValues());
  }, [setScrollTop]);

  return (
    <Scrollbars
      data-testid={testId}
      ref={ref}
      className={clsx(
        'gf-custom-scrollbar',
        stylex.props(styles.customScrollbar).className,
        className,
        showScrollIndicators && 'gf-custom-scrollbar--with-indicators'
      )}
      onScrollStop={onScrollStop}
      autoHeight={true}
      autoHide={autoHide}
      autoHideTimeout={autoHideTimeout}
      hideTracksWhenNotNeeded={hideTracksWhenNotNeeded}
      // These autoHeightMin & autoHeightMax options affect firefox and chrome differently.
      // Before these where set to inherit but that caused problems with cut of legends in firefox
      autoHeightMax={autoHeightMax}
      autoHeightMin={autoHeightMin}
      renderTrackHorizontal={renderTrackHorizontal}
      renderTrackVertical={renderTrackVertical}
      renderThumbHorizontal={renderThumbHorizontal}
      renderThumbVertical={renderThumbVertical}
      renderView={renderView}
      onScroll={onScroll}
    >
      {showScrollIndicators ? <ScrollIndicators>{children}</ScrollIndicators> : children}
    </Scrollbars>
  );
};

export default CustomScrollbar;

/**
 * Calling scrollTop on a scrollbar ref in a useEffect can race with internal state in react-custom-scrollbars-2, causing scrollTop to get called on a stale reference, which prevents the element from scrolling as desired.
 * Adding the reference to the useEffect dependency array not notify react that the reference has changed (and is an eslint violation), so we create a custom hook so updates to the reference trigger another render, fixing the race condition bug.
 *
 * @param scrollBar
 * @param scrollTop
 */
function useScrollTop(
  scrollBar: (Scrollbars & { view: HTMLDivElement; update: () => void }) | null,
  scrollTop?: number
) {
  useEffect(() => {
    if (scrollBar && scrollTop != null) {
      scrollBar.scrollTop(scrollTop);
    }
  }, [scrollTop, scrollBar]);
}

const styles = stylex.create({
  customScrollbar: {
    display: 'flex',
    flexGrow: 1,
  },
});
