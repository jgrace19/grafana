import * as stylex from '@stylexjs/stylex';
import { useCallback } from 'react';
import * as React from 'react';

import { formattedValueToString } from '@grafana/data';
import { Trans } from '@grafana/i18n';

import { useTheme2 } from '../../themes/ThemeContext';
import { hoverColor } from '../../themes/mixins';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, spacing, typography } from '../../themes/stylex/tokens.stylex';

import { VizLegendSeriesIcon } from './VizLegendSeriesIcon';
import { type VizLegendItem } from './types';

export interface Props {
  key?: React.Key;
  item: VizLegendItem;
  className?: string;
  onLabelClick?: (item: VizLegendItem, event: React.MouseEvent<HTMLButtonElement>) => void;
  onLabelMouseOver?: (
    item: VizLegendItem,
    event: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement>
  ) => void;
  onLabelMouseOut?: (
    item: VizLegendItem,
    event: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement>
  ) => void;
  readonly?: boolean;
}

/**
 * @internal
 */
export const LegendTableItem = ({
  item,
  onLabelClick,
  onLabelMouseOver,
  onLabelMouseOut,
  className,
  readonly,
}: Props) => {
  const theme = useTheme2();

  const onMouseOver = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FocusEvent<HTMLButtonElement>) => {
      if (onLabelMouseOver) {
        onLabelMouseOver(item, event);
      }
    },
    [item, onLabelMouseOver]
  );

  const onMouseOut = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FocusEvent<HTMLButtonElement>) => {
      if (onLabelMouseOut) {
        onLabelMouseOut(item, event);
      }
    },
    [item, onLabelMouseOut]
  );

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (onLabelClick) {
        onLabelClick(item, event);
      }
    },
    [item, onLabelClick]
  );

  return (
    <tr
      {...mergeStylexProps(
        stylex.props(styles.row, styles.rowHover(hoverColor(theme.colors.background.primary, theme))),
        { className }
      )}
    >
      <td {...stylex.props(styles.cell)}>
        <span {...stylex.props(styles.itemWrapper)}>
          <VizLegendSeriesIcon
            color={item.color}
            seriesName={item.fieldName ?? item.label}
            readonly={readonly}
            lineStyle={item.lineStyle}
          />
          <button
            disabled={readonly}
            type="button"
            title={item.label}
            onBlur={onMouseOut}
            onFocus={onMouseOver}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onClick={!readonly ? onClick : undefined}
            {...stylex.props(styles.label, item.disabled && styles.labelDisabled)}
          >
            {item.label}{' '}
            {item.yAxis === 2 && (
              <span {...stylex.props(styles.yAxisLabel)}>
                <Trans i18nKey="grafana-ui.viz-legend.right-axis-indicator">(right y-axis)</Trans>
              </span>
            )}
          </button>
        </span>
      </td>
      {item.getDisplayValues &&
        item.getDisplayValues().map((stat, index) => {
          return (
            <td {...stylex.props(styles.cell, styles.value)} key={`${stat.title}-${index}`}>
              {formattedValueToString(stat)}
            </td>
          );
        })}
    </tr>
  );
};

LegendTableItem.displayName = 'LegendTableItem';

const styles = stylex.create({
  row: {
    fontSize: typography['--gf-typography-size-sm'],
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
  },
  rowHover: (hoverBackground: string) => ({
    backgroundColor: { default: null, ':hover': hoverBackground },
  }),
  cell: {
    paddingTop: `calc(${spacing['--gf-spacing-grid-size']} * 0.25)`,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 0.25)`,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    whiteSpace: 'nowrap',
  },
  label: {
    whiteSpace: 'nowrap',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    borderStyle: 'none',
    fontSize: 'inherit',
    padding: 0,
    maxWidth: '600px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    userSelect: 'text',
  },
  labelDisabled: {
    color: colors['--gf-colors-text-disabled'],
  },
  itemWrapper: {
    display: 'flex',
    whiteSpace: 'nowrap',
    alignItems: 'center',
    gap: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
  },
  value: {
    textAlign: 'right',
  },
  yAxisLabel: {
    color: colors['--gf-colors-text-secondary'],
  },
});
