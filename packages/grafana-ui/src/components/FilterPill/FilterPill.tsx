import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { colors, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';
import { type IconName } from '../../types/icon';
import { Icon } from '../Icon/Icon';

export interface FilterPillProps {
  selected: boolean;
  label: string;
  onClick: React.MouseEventHandler<HTMLElement>;
  icon?: IconName;
}

/**
 * A component used for quick toggling on/off filters. Mostly used in inline form components and transformation/query editors.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/inputs-filterpill--docs
 */
export const FilterPill = ({ label, selected, onClick, icon = 'check' }: FilterPillProps) => {
  return (
    <button type="button" {...stylex.props(styles.wrapper, selected && styles.selected)} onClick={onClick}>
      <span>{label}</span>
      {selected && <Icon name={icon} xstyle={styles.icon} data-testid="filter-pill-icon" />}
    </button>
  );
};

const styles = stylex.create({
  wrapper: {
    backgroundColor: {
      default: colors['--gf-colors-background-secondary'],
      ':hover': colors['--gf-colors-action-hover'],
    },
    borderRadius: shape['--gf-shape-radius-pill'],
    paddingTop: 0,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 2)`,
    paddingBottom: 0,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 2)`,
    fontSize: typography['--gf-typography-body-small-font-size'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    lineHeight: typography['--gf-typography-body-small-line-height'],
    color: { default: colors['--gf-colors-text-secondary'], ':hover': colors['--gf-colors-text-primary'] },
    display: 'flex',
    alignItems: 'center',
    height: '32px',
    position: 'relative',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-background-secondary'],
    whiteSpace: 'nowrap',
  },
  selected: {
    color: colors['--gf-colors-text-primary'],
    backgroundColor: {
      default: colors['--gf-colors-action-selected'],
      ':hover': colors['--gf-colors-action-focus'],
    },
    borderColor: colors['--gf-colors-action-selected-border'],
  },
  icon: {
    marginLeft: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
  },
});
