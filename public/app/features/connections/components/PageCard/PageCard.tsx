import * as stylex from '@stylexjs/stylex';

import { type IconName } from '@grafana/data';
import { locationService } from '@grafana/runtime';
import { Icon, useTheme2 } from '@grafana/ui';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

type PageCardProps = {
  title: string;
  description: string;
  icon: IconName;
  url: string;
  index: number;
};

export default function PageCard({ title, description, icon, url, index }: PageCardProps) {
  const theme = useTheme2();
  const hoverBackground = theme.colors.emphasize(theme.colors.background.secondary, 0.03);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      locationService.push(url);
    }
  };

  return (
    <div
      {...stylex.props(styles.card, styles.hoverBackground(hoverBackground))}
      role="button"
      tabIndex={0}
      onClick={() => locationService.push(url)}
      onKeyDown={onKeyDown}
    >
      <Icon name={icon} xstyle={[styles.logo, index % 2 === 0 ? styles.evenLogo : styles.oddLogo]} />
      <div {...stylex.props(styles.contentColumn)}>
        <h3 {...stylex.props(styles.title)}>{title}</h3>
        <p {...stylex.props(styles.description)}>{description}</p>
      </div>
    </div>
  );
}

const styles = stylex.create({
  card: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing['--gf-spacing-x2'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    borderRadius: shape['--gf-shape-radius-default'],
    paddingTop: spacing['--gf-spacing-x3'],
    paddingRight: spacing['--gf-spacing-x4'],
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 2.25)`,
    paddingLeft: spacing['--gf-spacing-x4'],
    minHeight: `calc(${spacing['--gf-spacing-grid-size']} * 19.4)`,
    cursor: { default: null, ':hover': 'pointer' },
    width: `calc(${spacing['--gf-spacing-grid-size']} * 48)`,
  },
  hoverBackground: (hover: string) => ({
    backgroundColor: { default: colors['--gf-colors-background-secondary'], ':hover': hover },
  }),
  contentColumn: {
    flex: '1',
  },
  title: {
    marginBottom: spacing['--gf-spacing-x1'],
    fontSize: typography['--gf-typography-h4-font-size'],
    fontWeight: typography['--gf-typography-h4-font-weight'],
    color: colors['--gf-colors-text-primary'],
  },
  description: {
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    display: '-webkit-box',
    overflow: 'hidden',
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    color: colors['--gf-colors-text-secondary'],
  },
  logo: {
    objectFit: 'contain',
    width: '47px',
    height: '47px',
    paddingTop: `calc(${spacing['--gf-spacing-grid-size']} * 1.2)`,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 1.2)`,
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 1.2)`,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 1.2)`,
    borderRadius: spacing['--gf-spacing-x1'],
  },
  evenLogo: {
    color: '#4ADE80',
    backgroundColor: 'rgba(34, 197, 94, 0.10)',
  },
  oddLogo: {
    color: '#FB923C',
    backgroundColor: 'rgba(249, 115, 22, 0.10)',
  },
});
