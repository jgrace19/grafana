import * as stylex from '@stylexjs/stylex';
import { useMemo } from 'react';

import {
  type GrafanaTheme2,
  classicColors,
  type Field,
  getColorByStringHash,
  FALLBACK_COLOR,
  fieldColorModeRegistry,
  formattedValueToString,
} from '@grafana/data';
import { FieldColorModeId } from '@grafana/schema';

import { spacing, shape, typography } from '../../../../themes/stylex/tokens.stylex';
import { rdgCellMarker, rdgSelectableMarker } from '../../markers.stylex';
import { type PillCellProps, type TableCellStyles, type TableCellValue } from '../types';
import { IS_SAFARI_26 } from '../utils';

export function PillCell({ rowIdx, field, theme, getTextColorForBackground }: PillCellProps) {
  const value = field.values[rowIdx];
  const pills: Pill[] = useMemo(() => {
    const pillValues = inferPills(value);
    return pillValues.length > 0
      ? pillValues.map((pill, index) => {
          const renderedValue = formattedValueToString(field.display!(pill));
          const bgColor = getPillColor(renderedValue, field, theme);
          const textColor = getTextColorForBackground(bgColor);
          return {
            value: renderedValue,
            key: `${pill}-${index}`,
            bgColor,
            color: textColor,
          };
        })
      : [];
  }, [value, field, theme, getTextColorForBackground]);

  if (pills.length === 0) {
    return null;
  }

  return pills.map((pill) => (
    <span
      key={pill.key}
      {...stylex.props(styles.pill)}
      style={{
        backgroundColor: pill.bgColor,
        color: pill.color,
        border: pill.bgColor === TRANSPARENT ? `1px solid ${theme.colors.border.strong}` : undefined,
      }}
    >
      {pill.value}
    </span>
  ));
}

interface Pill {
  value: string;
  key: string;
  bgColor: string;
  color: string;
}

const SPLIT_RE = /\s*,\s*/;
const TRANSPARENT = 'rgba(0,0,0,0)';

export function inferPills(rawValue: TableCellValue): unknown[] {
  if (rawValue === '' || rawValue == null) {
    return [];
  }

  if (Array.isArray(rawValue)) {
    return rawValue.filter((v) => v != null).map((v) => String(v).trim());
  }

  const value = String(rawValue);

  if (value[0] === '[') {
    try {
      return JSON.parse(value);
    } catch {
      return value.trim().split(SPLIT_RE);
    }
  }

  return value.trim().split(SPLIT_RE);
}

// FIXME: this does not yet support "shades of a color"
function getPillColor(value: unknown, field: Field, theme: GrafanaTheme2): string {
  const cfg = field.config;

  if (cfg.mappings?.length ?? 0 > 0) {
    return field.display!(value).color ?? FALLBACK_COLOR;
  }

  if (cfg.color?.mode === FieldColorModeId.Fixed) {
    return theme.visualization.getColorByName(cfg.color?.fixedColor ?? FALLBACK_COLOR);
  }

  let colors = classicColors;
  const configuredColor = cfg.color;
  if (configuredColor) {
    const mode = fieldColorModeRegistry.get(configuredColor.mode);
    if (typeof mode?.getColors === 'function') {
      colors = mode.getColors(theme);
    }
  }

  return getColorByStringHash(colors, String(value));
}

export const getStyles: TableCellStyles = (_theme, { textWrap, shouldOverflow, maxHeight }) => ({
  xstyle: [
    styles.pills,
    textWrap
      ? styles.wrap
      : shouldOverflow
        ? Boolean(maxHeight)
          ? IS_SAFARI_26
            ? styles.wrapWhenNestedSelected
            : styles.wrapWhenNestedActive
          : IS_SAFARI_26
            ? styles.wrapWhenSelected
            : styles.wrapWhenActive
        : styles.noWrap,
  ],
});

const selected = ':is([aria-selected="true"])';

const styles = stylex.create({
  pills: {
    display: 'inline-flex',
    gap: spacing['--gf-spacing-x0-5'],
  },
  wrap: {
    flexWrap: 'wrap',
  },
  noWrap: {
    flexWrap: 'nowrap',
  },
  wrapWhenActive: {
    flexWrap: { default: 'nowrap', [selected]: 'wrap', ':hover': 'wrap' },
  },
  wrapWhenSelected: {
    flexWrap: { default: 'nowrap', [selected]: 'wrap' },
  },
  wrapWhenNestedActive: {
    flexWrap: {
      default: 'nowrap',
      [stylex.when.ancestor('[aria-selected="true"]', rdgSelectableMarker)]: 'wrap',
      [stylex.when.ancestor(':hover', rdgCellMarker)]: 'wrap',
    },
  },
  wrapWhenNestedSelected: {
    flexWrap: {
      default: 'nowrap',
      [stylex.when.ancestor('[aria-selected="true"]', rdgSelectableMarker)]: 'wrap',
    },
  },
  pill: {
    display: 'flex',
    paddingTop: spacing['--gf-spacing-x0-25'],
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    paddingBottom: spacing['--gf-spacing-x0-25'],
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    borderRadius: shape['--gf-shape-radius-default'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    lineHeight: typography['--gf-typography-body-small-line-height'],
    whiteSpace: 'nowrap',
  },
});
