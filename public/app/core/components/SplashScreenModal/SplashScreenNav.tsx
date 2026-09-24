import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { Button, Text } from '@grafana/ui';
import { motion } from '@grafana/ui/stylex/constants.stylex';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

interface SplashScreenNavProps {
  activeIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
}

export function SplashScreenNav({ activeIndex, total, onPrev, onNext, onGoTo }: SplashScreenNavProps) {
  return (
    <div {...stylex.props(styles.nav)}>
      <Button
        icon="angle-left"
        variant="secondary"
        fill="outline"
        size="sm"
        onClick={onPrev}
        aria-label={t('splash-screen.nav.prev', 'Previous')}
        xstyle={styles.navButton}
      />
      <div {...stylex.props(styles.dots)}>
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            {...stylex.props(styles.dotBase, i === activeIndex ? styles.dotActive : styles.dotInactive)}
            onClick={() => onGoTo(i)}
            aria-label={t('splash-screen.nav.go-to', 'Go to slide {{number}}', { number: i + 1 })}
            aria-current={i === activeIndex ? 'step' : undefined}
          />
        ))}
      </div>
      <Button
        icon="angle-right"
        variant="secondary"
        fill="outline"
        size="sm"
        onClick={onNext}
        aria-label={t('splash-screen.nav.next', 'Next')}
        xstyle={styles.navButton}
      />
      <Text color="secondary" variant="bodySmall">
        {activeIndex + 1}/{total}
      </Text>
    </div>
  );
}

const styles = stylex.create({
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
  },
  navButton: {
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    width: spacing['--gf-spacing-x3'],
    minWidth: spacing['--gf-spacing-x3'],
    justifyContent: 'center',
  },
  dots: {
    display: 'flex',
    alignItems: 'center',
    // 5px gap matches design's 9px center-to-center dot spacing
    gap: 5,
  },
  dotBase: {
    borderRadius: shape['--gf-shape-radius-circle'],
    borderStyle: 'none',
    padding: 0,
    cursor: 'pointer',
  },
  dotInactive: {
    width: 4,
    height: 4,
    backgroundColor: colors['--gf-colors-text-disabled'],
    opacity: { default: 0.65, ':hover': 1 },
    transitionProperty: { default: null, [motion.noPreference]: 'background-color' },
    transitionDuration: { default: null, [motion.noPreference]: '300ms' },
    transitionTimingFunction: { default: null, [motion.noPreference]: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    transitionDelay: { default: null, [motion.noPreference]: '0ms' },
  },
  dotActive: {
    width: 6,
    height: 6,
    backgroundColor: colors['--gf-colors-warning-text'],
  },
});
