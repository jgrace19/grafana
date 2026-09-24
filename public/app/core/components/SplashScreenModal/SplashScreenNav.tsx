import { mergeStylexClassName } from '@grafana/ui/unstable';
import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';

import { t } from '@grafana/i18n';
import { Button, Text } from '@grafana/ui';

import { splashScreenNavStyles } from './SplashScreenNav.stylex';

interface SplashScreenNavProps {
  activeIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
}

export function SplashScreenNav({ activeIndex, total, onPrev, onNext, onGoTo }: SplashScreenNavProps) {

  return (
    <div {...stylex.props(splashScreenNavStyles.nav)}>
      <Button
        icon="angle-left"
        variant="secondary"
        fill="outline"
        size="sm"
        onClick={onPrev}
        aria-label={t('splash-screen.nav.prev', 'Previous')}
        {...stylex.props(splashScreenNavStyles.navButton)}
      />
      <div {...stylex.props(splashScreenNavStyles.dots)}>
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            {...stylex.props(
              splashScreenNavStyles.dotBase,
              i === activeIndex ? splashScreenNavStyles.dotActive : splashScreenNavStyles.dotInactive
            )}
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
        {...stylex.props(splashScreenNavStyles.navButton)}
      />
      <Text color="secondary" variant="bodySmall">
        {activeIndex + 1}/{total}
      </Text>
    </div>
  );
}

