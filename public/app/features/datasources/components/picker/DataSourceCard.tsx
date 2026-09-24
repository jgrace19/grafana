// eslint-disable-next-line no-restricted-imports -- stylex: pending Card xstyle
import { css, cx } from '@emotion/css';
import * as stylex from '@stylexjs/stylex';

import { type DataSourceInstanceSettings } from '@grafana/data';
import { Card, Icon, TagList, useTheme2 } from '@grafana/ui';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

interface DataSourceCardProps {
  ds: DataSourceInstanceSettings;
  onClick: () => void;
  selected: boolean;
  description?: string;
  isFavorite?: boolean;
  onToggleFavorite?: (ds: DataSourceInstanceSettings) => void;
}

export function DataSourceCard({
  ds,
  onClick,
  selected,
  description,
  isFavorite = false,
  onToggleFavorite,
  ...htmlProps
}: DataSourceCardProps) {
  const theme = useTheme2();

  return (
    <Card
      key={ds.uid}
      noMargin
      onClick={onClick}
      className={cx(cardStyles.card, selected ? cardStyles.selected : undefined)}
      {...htmlProps}
    >
      <Card.Heading className={cardStyles.heading}>
        <div {...stylex.props(styles.headingContent)}>
          <span {...stylex.props(styles.name)}>
            {ds.name} {ds.isDefault ? <TagList tags={['default']} /> : null}
          </span>
          <div {...stylex.props(styles.rightSection)}>
            <small {...stylex.props(styles.type)}>{description || ds.meta.name}</small>
            {onToggleFavorite && !ds.meta.builtIn && (
              <Icon
                key={(isFavorite ? 'favorite' : 'star') + '-' + ds.uid}
                name={isFavorite ? 'favorite' : 'star'}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(ds);
                }}
                xstyle={styles.favoriteButton}
              />
            )}
          </div>
        </div>
      </Card.Heading>
      <Card.Figure className={cardStyles.logo}>
        <img
          src={ds.meta.info.logos.small || undefined}
          alt={`${ds.meta.name} Logo`}
          {...stylex.props(styles.logoImage, ds.meta.builtIn && theme.isLight ? styles.inverted : styles.notInverted)}
        />
      </Card.Figure>
    </Card>
  );
}

const styles = stylex.create({
  headingContent: {
    color: colors['--gf-colors-text-secondary'],
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: { default: 'flex', [bp.smDown]: 'grid' },
    justifyContent: 'space-between',
    columnGap: spacing['--gf-spacing-x1'],
    alignItems: 'center',
    gridTemplateColumns: { default: null, [bp.smDown]: '1fr' },
    gridTemplateRows: { default: null, [bp.smDown]: 'repeat(2, 1fr)' },
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    minWidth: 0,
    flex: '1',
    justifyContent: { default: 'flex-end', [bp.smDown]: 'flex-start' },
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  logoImage: {
    maxHeight: '100%',
    minWidth: '24px',
  },
  inverted: {
    filter: 'invert(1)',
  },
  notInverted: {
    filter: 'invert(0)',
  },
  name: {
    color: colors['--gf-colors-text-primary'],
    display: 'flex',
    gap: spacing['--gf-spacing-x2'],
  },
  type: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
  },
  favoriteButton: {
    flexShrink: 0,
    pointerEvents: 'auto',
    zIndex: 1,
  },
});

// stylex: pending Card xstyle. Card is StyleX but only takes className, and only an (unlayered) Emotion class
// reliably overrides Card's padding, background, transition, heading button and figure size.
const cardStyles = {
  card: css({
    cursor: 'pointer',
    backgroundColor: 'transparent',
    padding: spacing['--gf-spacing-x1'],
    '@media (prefers-reduced-motion: no-preference),(prefers-reduced-motion: reduce)': {
      // eslint-disable-next-line @grafana/no-unreduced-motion -- removes Card's transition, it adds no motion
      transition: 'none',
    },

    '&:hover': {
      backgroundColor: colors['--gf-colors-action-hover'],
    },
  }),
  heading: css({
    width: '100%',
    overflow: 'hidden',
    // This is needed to enable ellipsis when text overflows
    '> button': {
      width: '100%',
    },
  }),
  logo: css({
    width: '32px',
    height: '32px',
    padding: `0 ${spacing['--gf-spacing-x1']}`,
    display: 'flex',
    alignItems: 'center',
  }),
  selected: css({
    background: colors['--gf-colors-action-selected'],

    '&::before': {
      backgroundImage: colors['--gf-colors-gradients-brand-vertical'],
      borderRadius: shape['--gf-shape-radius-default'],
      content: '" "',
      display: 'block',
      height: '100%',
      position: 'absolute',
      width: spacing['--gf-spacing-x0-5'],
      left: 0,
    },
  }),
};
