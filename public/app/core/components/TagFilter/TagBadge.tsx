import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { getTagColorsFromName, Icon } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { shape, spacing, typography, v1 } from '@grafana/ui/stylex/tokens.stylex';

export interface Props {
  label: string;
  removeIcon: boolean;
  count: number;
  onClick?: React.MouseEventHandler<SVGElement>;
  className?: string;
}

export const TagBadge = ({ count, label, onClick, removeIcon, className }: Props) => {
  const { color } = getTagColorsFromName(label);

  const countLabel = count !== 0 && <span style={{ marginLeft: '3px' }}>{`(${count})`}</span>;

  return (
    <span {...mergeStylexProps(stylex.props(styles.badge), { className, style: { backgroundColor: color } })}>
      {removeIcon && <Icon onClick={onClick} name="times" />}
      {label} {countLabel}
    </span>
  );
};

const styles = stylex.create({
  badge: {
    fontFamily: typography['--gf-typography-body-small-font-family'],
    fontWeight: typography['--gf-typography-body-small-font-weight'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    letterSpacing: typography['--gf-typography-body-small-letter-spacing'],
    backgroundColor: v1['--gf-v1-palette-gray1'],
    borderRadius: shape['--gf-shape-radius-sm'],
    color: v1['--gf-v1-palette-white'],
    display: 'inline-block',
    height: '20px',
    lineHeight: '20px',
    paddingTop: 0,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    paddingBottom: 0,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    verticalAlign: 'baseline',
    whiteSpace: 'nowrap',
    opacity: { default: null, ':hover': 0.85 },
  },
});
