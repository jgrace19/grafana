import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { splashScreenSlideStyles } from './SplashScreenSlide.stylex';
import { type ReactNode } from 'react';

import { colorManipulator, type GrafanaTheme2 } from '@grafana/data';
import { Badge, Icon, useTheme2 } from '@grafana/ui';

import { type AccentColorKey, type SplashFeature } from './splashContent';

interface SplashScreenSlideProps {
  feature: SplashFeature;
  footer?: ReactNode;
}

function resolveAccentColor(theme: GrafanaTheme2, key: AccentColorKey): string {
  switch (key) {
    case 'primary':
      return theme.colors.primary.text;
    case 'success':
      return theme.colors.success.text;
    default:
      return theme.visualization.getColorByName(key);
  }
}

export function SplashScreenSlide({ feature, footer }: SplashScreenSlideProps) {
  const theme = useTheme2();
  const accentColor = resolveAccentColor(theme, feature.accentColor);

  return (
    <div {...stylex.props(splashScreenSlideStyles.slide)}>
      <div {...stylex.props(splashScreenSlideStyles.heroPanel)} />
      <div {...stylex.props(splashScreenSlideStyles.contentPanel)}>
        <Badge text={feature.badgeText} icon={feature.badgeIcon} color="green" {...stylex.props(splashScreenSlideStyles.badge)} />
        <h2 {...stylex.props(splashScreenSlideStyles.title)}>{feature.title}</h2>
        <div {...stylex.props(splashScreenSlideStyles.body)}>
          <div {...stylex.props(splashScreenSlideStyles.iconBox)}>
            <Icon name={feature.icon} size="xl" {...stylex.props(splashScreenSlideStyles.iconBoxIcon)} />
          </div>
          <p {...stylex.props(splashScreenSlideStyles.subtitle)}>{feature.subtitle}</p>
          <ul {...stylex.props(splashScreenSlideStyles.bulletList)}>
            {feature.bullets.map((bullet, i) => (
              <li key={i} {...stylex.props(splashScreenSlideStyles.bulletItem)}>
                <span {...stylex.props(splashScreenSlideStyles.bulletDot)} />
                <span {...stylex.props(splashScreenSlideStyles.bulletText)}>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
        {footer && <div {...stylex.props(splashScreenSlideStyles.footer)}>{footer}</div>}
      </div>
    </div>
  );
}

function buildHeroGradient(theme: GrafanaTheme2, accentColor: string): string {
  const { alpha, darken } = colorManipulator;
  const base = theme.colors.background.primary;
  return `radial-gradient(ellipse at 80% 20%, ${alpha(accentColor, 0.51)} 0%, ${alpha(darken(accentColor, 0.3), 0.46)} 25%, ${alpha(darken(accentColor, 0.6), 0.4)} 40%, ${alpha(darken(accentColor, 0.85), 0.7)} 60%, ${alpha(base, 0.85)} 75%, ${base} 100%)`;
}

