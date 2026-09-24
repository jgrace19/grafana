import * as stylex from '@stylexjs/stylex';
import { memo, type JSX } from 'react';

import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

export interface MetaItemProps {
  label?: string;
  value: string | JSX.Element;
}

const MetaInfoItem = memo(function MetaInfoItem(props: MetaItemProps) {
  const { label, value } = props;

  return (
    <div data-testid="meta-info-text-item" {...stylex.props(styles.metaItem)}>
      {label && <span {...stylex.props(styles.metaLabel)}>{label}:</span>}
      <span {...stylex.props(styles.metaValue)}>{value}</span>
    </div>
  );
});

interface MetaInfoTextProps {
  metaItems: MetaItemProps[];
}

export const MetaInfoText = memo(function MetaInfoText(props: MetaInfoTextProps) {
  const { metaItems } = props;

  return (
    <div {...stylex.props(styles.metaContainer)} data-testid="meta-info-text">
      {metaItems.map((item, index) => (
        <MetaInfoItem key={`${index}-${item.label}`} label={item.label} value={item.value} />
      ))}
    </div>
  );
});

const styles = stylex.create({
  metaContainer: {
    flex: '1',
    color: colors['--gf-colors-text-secondary'],
    marginBottom: spacing['--gf-spacing-x2'],
    minWidth: '30%',
    display: 'flex',
    flexWrap: 'wrap',
  },
  metaItem: {
    marginRight: spacing['--gf-spacing-x2'],
    marginTop: spacing['--gf-spacing-x0-5'],
    display: 'flex',
    alignItems: 'center',
  },
  metaLabel: {
    marginRight: `calc(${spacing['--gf-spacing-x2']} / 2)`,
    fontSize: typography['--gf-typography-body-small-font-size'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    whiteSpace: 'nowrap',
  },
  metaValue: {
    fontFamily: typography['--gf-typography-font-family-monospace'],
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
});
