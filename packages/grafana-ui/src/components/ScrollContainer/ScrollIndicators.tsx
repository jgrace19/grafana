import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState } from 'react';
import * as React from 'react';

import { useTheme2 } from '../../themes/ThemeContext';
import { durations, easings, motion } from '../../themes/stylex/constants.stylex';
import { spacing } from '../../themes/stylex/tokens.stylex';

export const ScrollIndicators = ({ children }: React.PropsWithChildren<{}>) => {
  const [showScrollTopIndicator, setShowTopScrollIndicator] = useState(false);
  const [showScrollBottomIndicator, setShowBottomScrollIndicator] = useState(false);
  const scrollTopMarker = useRef<HTMLDivElement>(null);
  const scrollBottomMarker = useRef<HTMLDivElement>(null);
  const theme = useTheme2();
  // we specifically don't want a theme color here
  // this gradient is more like a shadow
  const scrollGradientColor = `rgba(0, 0, 0, ${theme.isDark ? 0.25 : 0.08})`;

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
          styles.scrollTopIndicator(scrollGradientColor),
          showScrollTopIndicator && styles.scrollIndicatorVisible
        )}
        role="presentation"
      />
      <div {...stylex.props(styles.scrollContent)}>
        <div ref={scrollTopMarker} {...stylex.props(styles.scrollMarker, styles.scrollTopMarker)} />
        {children}
        <div ref={scrollBottomMarker} {...stylex.props(styles.scrollMarker, styles.scrollBottomMarker)} />
      </div>
      <div
        {...stylex.props(
          styles.scrollIndicator,
          styles.scrollBottomIndicator(scrollGradientColor),
          showScrollBottomIndicator && styles.scrollIndicatorVisible
        )}
        role="presentation"
      />
    </>
  );
};

const styles = stylex.create({
  scrollContent: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    position: 'relative',
  },
  scrollIndicator: {
    height: `max(5%, calc(${spacing['--gf-spacing-grid-size']} * 3))`,
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
  scrollTopIndicator: (color: string) => ({
    backgroundImage: `linear-gradient(0deg, transparent, ${color})`,
    top: 0,
  }),
  scrollBottomIndicator: (color: string) => ({
    backgroundImage: `linear-gradient(180deg, transparent, ${color})`,
    bottom: 0,
  }),
  scrollIndicatorVisible: {
    opacity: 1,
  },
  scrollMarker: {
    height: '1px',
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
  },
  scrollTopMarker: {
    top: 0,
  },
  scrollBottomMarker: {
    bottom: 0,
  },
});
