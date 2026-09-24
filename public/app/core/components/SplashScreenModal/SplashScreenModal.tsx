import * as stylex from '@stylexjs/stylex';
import { useCallback, useState } from 'react';

import { t } from '@grafana/i18n';
import { IconButton, LinkButton } from '@grafana/ui';
import { ModalBase } from '@grafana/ui/internal';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { contextSrv } from 'app/core/services/context_srv';

import { SplashScreenNav } from './SplashScreenNav';
import { SplashScreenSlide } from './SplashScreenSlide';
import { type SplashFeatureCta, getSplashScreenConfig } from './splashContent';
import { useShouldShowSplash } from './useShouldShowSplash';

function resolveCtaUrl(cta: SplashFeatureCta): string {
  if (cta.requiresAdmin && !contextSrv.hasRole('Admin')) {
    return cta.fallbackUrl ?? cta.url;
  }
  if (cta.permission && !contextSrv.hasPermission(cta.permission)) {
    return cta.fallbackUrl ?? cta.url;
  }
  return cta.url;
}

export function SplashScreenModal() {
  const [activeIndex, setActiveIndex] = useState(0);
  const config = getSplashScreenConfig();
  const { shouldShow, dismiss } = useShouldShowSplash(config.version);

  const total = config.features.length;
  const goToPrev = useCallback(() => setActiveIndex((i) => (i - 1 + total) % total), [total]);
  const goToNext = useCallback(() => setActiveIndex((i) => (i + 1) % total), [total]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    },
    [goToPrev, goToNext]
  );

  if (!shouldShow) {
    return null;
  }

  const activeFeature = config.features[activeIndex];
  const cta = activeFeature.cta;
  const ctaUrl = cta ? resolveCtaUrl(cta) : '';

  const footer = (
    <>
      <SplashScreenNav
        activeIndex={activeIndex}
        total={total}
        onPrev={goToPrev}
        onNext={goToNext}
        onGoTo={setActiveIndex}
      />
      {cta && (
        <LinkButton
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          icon="external-link-alt"
          variant="secondary"
          fill="outline"
          size="md"
        >
          {cta.text}
        </LinkButton>
      )}
    </>
  );

  return (
    <ModalBase
      isOpen
      onDismiss={dismiss}
      aria-label={t('splash-screen.aria-label', "What's new in Grafana")}
      xstyle={styles.modal}
    >
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div {...stylex.props(styles.container)} onKeyDown={handleKeyDown}>
        <IconButton
          name="times"
          size="lg"
          onClick={dismiss}
          aria-label={t('splash-screen.close', 'Close')}
          xstyle={styles.close}
        />
        <SplashScreenSlide feature={activeFeature} footer={footer} />
      </div>
    </ModalBase>
  );
}

// ModalBase's small-height media query.
const smallHeight = '@media (max-height: 750px)';

const styles = stylex.create({
  // ModalBase's own small-height max height still wins.
  modal: {
    width: '860px',
    maxWidth: '95vw',
    height: '520px',
    maxHeight: { default: '85vh', [smallHeight]: '100%' },
    padding: 0,
    overflow: 'hidden',
  },
  close: {
    position: 'absolute',
    top: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    right: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    zIndex: 1,
    color: colors['--gf-colors-text-secondary'],
  },
  container: {
    position: 'relative',
    height: '100%',
  },
});
