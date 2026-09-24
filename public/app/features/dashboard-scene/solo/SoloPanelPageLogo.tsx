import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { soloPanelPageLogoStyles } from './SoloPanelPageLogo.stylex';
import { useEffect, useState } from 'react';

import { Trans } from '@grafana/i18n';
import { useTheme2 } from '@grafana/ui';
import grafanaTextLogoDarkSvg from 'img/grafana_text_logo_dark.svg';
import grafanaTextLogoLightSvg from 'img/grafana_text_logo_light.svg';

interface SoloPanelPageLogoProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  isHovered: boolean;
  hideLogo?: UrlQueryValue;
}

export function shouldHideSoloPanelLogo(hideLogo?: UrlQueryValue): boolean {
  if (hideLogo === undefined || hideLogo === null) {
    return false;
  }

  // React-router / locationSearchToObject can represent a "present but no value" query param as boolean true.
  if (hideLogo === true) {
    return true;
  }

  if (hideLogo === false) {
    return false;
  }

  const value = Array.isArray(hideLogo) ? String(hideLogo[0] ?? '') : String(hideLogo);

  // Treat presence as "true", except explicit disable values.
  // Examples:
  // - ?hideLogo           => hide
  // - ?hideLogo=true      => hide
  // - ?hideLogo=1         => hide
  // - ?hideLogo=false     => show
  // - ?hideLogo=0         => show
  const normalized = value.trim().toLowerCase();
  return normalized !== 'false' && normalized !== '0';
}

export function SoloPanelPageLogo({ containerRef, isHovered, hideLogo }: SoloPanelPageLogoProps) {
  const shouldHide = shouldHideSoloPanelLogo(hideLogo);
  const [scale, setScale] = useState(1);
  const theme = useTheme2();
  const grafanaLogo = theme.isDark ? grafanaTextLogoLightSvg : grafanaTextLogoDarkSvg;

  // Calculate responsive scale based on panel dimensions
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) {
        return;
      }

      const { width, height } = containerRef.current.getBoundingClientRect();
      // Use the smaller dimension to ensure it scales appropriately for both wide and tall panels
      const minDimension = Math.min(width, height);

      // Base scale calculation: scales from 0.6 (for small panels ~200px) up to 1.0 when the smaller dimension is ~800px
      // Clamp to a maximum of 1.0 for larger panels
      const baseScale = Math.max(0.6, Math.min(1.0, 0.6 + (minDimension - 200) / 600));

      // Also consider width specifically for very wide but short panels; reaches 1.0 when width is ~1000px
      const widthScale = Math.max(0.6, Math.min(1.0, 0.6 + (width - 200) / 800));

      // Use the average of both for balanced scaling; panels around 1000x1000px (or larger in both dimensions) reach a scale of 1.0
      const finalScale = Math.min(1.0, (baseScale + widthScale) / 2);
      setScale(finalScale);
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  if (shouldHide) {
    return null;
  }

  return (
    <div
      {...mergeStylexClassName(stylex.props(soloPanelPageLogoStyles.logoContainer), clsx(isHovered && stylex.props(soloPanelPageLogoStyles.logoHidden).className))}
      style={{
        fontSize: `${scale * 100}%`,
        top: `${8 * scale}px`,
        right: `${8 * scale}px`,
        padding: `${8 * scale}px ${8 * scale}px`,
      }}
    >
      <span {...stylex.props(soloPanelPageLogoStyles.text)}>
        <Trans i18nKey="embedded-panel.powered-by">Powered by</Trans>
      </span>
      <img
        src={grafanaLogo}
        alt="Grafana"
        {...stylex.props(soloPanelPageLogoStyles.logo)}
        style={{
          height: `${16 * scale}px`,
          marginLeft: '0.25em',
        }}
      />
    </div>
  );
}

