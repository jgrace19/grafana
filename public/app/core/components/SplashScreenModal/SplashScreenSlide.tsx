import * as stylex from '@stylexjs/stylex';
import { type ReactNode } from 'react';

import { colorManipulator, type GrafanaTheme2 } from '@grafana/data';
import { Badge, Icon, useTheme2 } from '@grafana/ui';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

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
  const heroBackground = `url(${feature.heroImageUrl}), ${buildHeroGradient(theme, accentColor)}`;

  return (
    <div {...stylex.props(styles.slide)}>
      <div {...stylex.props(styles.heroPanel, styles.heroBackground(heroBackground))} />
      <div {...stylex.props(styles.contentPanel)}>
        <Badge
          text={feature.badgeText}
          icon={feature.badgeIcon}
          color="green"
          className={stylex.props(styles.badge).className}
        />
        <h2 {...stylex.props(styles.title)}>{feature.title}</h2>
        <div {...stylex.props(styles.body)}>
          <div {...stylex.props(styles.iconBox, styles.iconBoxBackground(colorManipulator.alpha(accentColor, 0.12)))}>
            <Icon name={feature.icon} size="xl" xstyle={styles.color(accentColor)} />
          </div>
          <p {...stylex.props(styles.subtitle)}>{feature.subtitle}</p>
          <ul {...stylex.props(styles.bulletList)}>
            {feature.bullets.map((bullet, i) => (
              <li key={i} {...stylex.props(styles.bulletItem)}>
                <span {...stylex.props(styles.bulletDot, styles.backgroundColor(accentColor))} />
                <span {...stylex.props(styles.bulletText)}>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
        {footer && <div {...stylex.props(styles.footer)}>{footer}</div>}
      </div>
    </div>
  );
}

function buildHeroGradient(theme: GrafanaTheme2, accentColor: string): string {
  const { alpha, darken } = colorManipulator;
  const base = theme.colors.background.primary;
  return `radial-gradient(ellipse at 80% 20%, ${alpha(accentColor, 0.51)} 0%, ${alpha(darken(accentColor, 0.3), 0.46)} 25%, ${alpha(darken(accentColor, 0.6), 0.4)} 40%, ${alpha(darken(accentColor, 0.85), 0.7)} 60%, ${alpha(base, 0.85)} 75%, ${base} 100%)`;
}

const styles = stylex.create({
  slide: {
    display: 'flex',
    height: '100%',
  },
  heroPanel: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: '45%',
    backgroundPosition: 'center center, 0% 0%',
    backgroundSize: 'cover, auto',
    backgroundRepeat: 'no-repeat, repeat',
    borderTopLeftRadius: shape['--gf-shape-radius-lg'],
    borderTopRightRadius: 'unset',
    borderBottomRightRadius: 'unset',
    borderBottomLeftRadius: shape['--gf-shape-radius-lg'],
    overflow: 'hidden',
  },
  heroBackground: (backgroundImage: string) => ({ backgroundImage }),
  contentPanel: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '55%',
    paddingTop: spacing['--gf-spacing-x4'],
    paddingRight: spacing['--gf-spacing-x4'],
    paddingBottom: spacing['--gf-spacing-x4'],
    paddingLeft: spacing['--gf-spacing-x4'],
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'auto',
  },
  badge: {
    alignSelf: 'flex-start',
  },
  title: {
    fontFamily: typography['--gf-typography-h3-font-family'],
    fontWeight: typography['--gf-typography-h3-font-weight'],
    fontSize: typography['--gf-typography-h3-font-size'],
    lineHeight: typography['--gf-typography-h3-line-height'],
    letterSpacing: typography['--gf-typography-h3-letter-spacing'],
    margin: 0,
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['--gf-spacing-x1-5'],
  },
  subtitle: {
    margin: 0,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: shape['--gf-shape-radius-default'],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxBackground: (backgroundColor: string) => ({ backgroundColor }),
  color: (color: string) => ({ color }),
  backgroundColor: (backgroundColor: string) => ({ backgroundColor }),
  bulletList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['--gf-spacing-x1-5'],
  },
  bulletItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing['--gf-spacing-x1-5'],
  },
  bulletDot: {
    width: 6,
    height: 6,
    minWidth: 6,
    borderRadius: shape['--gf-shape-radius-circle'],
    // Vertically aligns the dot with the first line of text
    marginTop: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
  },
  bulletText: {
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    lineHeight: typography['--gf-typography-body-small-line-height'],
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing['--gf-spacing-x2'],
  },
});
