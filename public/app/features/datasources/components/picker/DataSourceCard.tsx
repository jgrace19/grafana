import * as stylex from '@stylexjs/stylex';

import { type DataSourceInstanceSettings } from '@grafana/data';
import { Card, Icon, TagList, useTheme2 } from '@grafana/ui';
import { bp, motion } from '@grafana/ui/stylex/constants.stylex';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

import './DataSourceCard.css';

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
      xstyle={[cardStyles.card, selected && cardStyles.selected]}
      {...htmlProps}
    >
      <Card.Heading className="gf-data-source-card-heading" xstyle={cardStyles.heading}>
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
      <Card.Figure xstyle={cardStyles.logo}>
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

const focusTransitionProperty = 'outline, outline-offset, box-shadow';

// Over Card's look. Card's :focus transition still wins over `transition: none`, and these :hover backgrounds
// replace Card's own.
const cardStyles = stylex.create({
  card: {
    cursor: 'pointer',
    backgroundColor: { default: 'transparent', ':hover': colors['--gf-colors-action-hover'] },
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
    transitionProperty: {
      default: null,
      ':focus': focusTransitionProperty,
      [motion.noPreferenceOrReduce]: { default: 'none', ':focus': focusTransitionProperty },
    },
  },
  heading: {
    width: '100%',
    overflow: 'hidden',
  },
  logo: {
    width: '32px',
    height: '32px',
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x1'],
    display: { default: 'flex', ':empty': 'none' },
    alignItems: 'center',
  },
  selected: {
    backgroundColor: { default: colors['--gf-colors-action-selected'], ':hover': colors['--gf-colors-action-hover'] },
    '::before': {
      backgroundImage: colors['--gf-colors-gradients-brand-vertical'],
      borderRadius: shape['--gf-shape-radius-default'],
      content: '" "',
      display: 'block',
      height: '100%',
      position: 'absolute',
      width: spacing['--gf-spacing-x0-5'],
      left: 0,
    },
  },
});
