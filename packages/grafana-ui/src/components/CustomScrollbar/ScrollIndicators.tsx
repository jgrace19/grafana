import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState } from 'react';
import * as React from 'react';

import { durations, easings, motion } from '../../themes/stylex/constants.stylex';
import { colors, spacing } from '../../themes/stylex/tokens.stylex';

export const ScrollIndicators = ({ children }: React.PropsWithChildren<{}>) => {
  const [showScrollTopIndicator, setShowTopScrollIndicator] = useState(false);
  const [showScrollBottomIndicator, setShowBottomScrollIndicator] = useState(false);
  const scrollTopMarker = useRef<HTMLDivElement>(null);
  const scrollBottomMarker = useRef<HTMLDivElement>(null);

  // Here we observe the top and bottom markers to determine if we should show the scroll indicators
  useEffect(() => {
    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === scrollTopMarker.current) {
          setShowTopScrollIndicator(!entry.isIntersecting);
        } else if (entry.target === scrollBottomMarker.current) {
          setShowBottomScrollIndicator(!entry.isIntersecting);
        }
      });
    });
    [scrollTopMarker, scrollBottomMarker].forEach((ref) => {
      if (ref.current) {
        intersectionObserver.observe(ref.current);
      }
    });
    return () => intersectionObserver.disconnect();
  }, []);

  return (
    <>
      <div
        {...stylex.props(
          styles.scrollIndicator,
          styles.scrollTopIndicator,
          showScrollTopIndicator && styles.scrollIndicatorVisible
        )}
      />
      <div {...stylex.props(styles.scrollContent)}>
        <div ref={scrollTopMarker} />
        {children}
        <div ref={scrollBottomMarker} />
      </div>
      <div
        {...stylex.props(
          styles.scrollIndicator,
          styles.scrollBottomIndicator,
          showScrollBottomIndicator && styles.scrollIndicatorVisible
        )}
      />
    </>
  );
};

const styles = stylex.create({
  scrollContent: {
    flex: '1',
    position: 'relative',
  },
  scrollIndicator: {
    height: `calc(${spacing['--gf-spacing-grid-size']} * 6)`,
    left: 0,
    opacity: 0,
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'opacity' },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: durations.standard },
    transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: easings.easeInOut },
    transitionDelay: { default: null, [motion.noPreferenceOrReduce]: '0ms' },
    zIndex: 1,
  },
  scrollTopIndicator: {
    backgroundImage: `linear-gradient(0deg, transparent, ${colors['--gf-colors-background-canvas']})`,
    top: 0,
  },
  scrollBottomIndicator: {
    backgroundImage: `linear-gradient(180deg, transparent, ${colors['--gf-colors-background-canvas']})`,
    bottom: 0,
  },
  scrollIndicatorVisible: {
    opacity: 1,
  },
});
