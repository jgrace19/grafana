import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import tinycolor from 'tinycolor2';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';

import { useTheme2 } from '../../themes/ThemeContext';
import { durations, easings, motion } from '../../themes/stylex/constants.stylex';
import { colors, shape, spacing } from '../../themes/stylex/tokens.stylex';

/** @internal */
export enum ColorSwatchVariant {
  Small = 'small',
  Large = 'large',
}

/** @internal */
export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  color: string;
  label?: string;
  variant?: ColorSwatchVariant;
  isSelected?: boolean;
}

/** @internal */
export const ColorSwatch = React.forwardRef<HTMLDivElement, Props>(
  ({ color, label, variant = ColorSwatchVariant.Small, isSelected, 'aria-label': ariaLabel, ...otherProps }, ref) => {
    const theme = useTheme2();
    const isSmall = variant === ColorSwatchVariant.Small;
    const hasLabel = !!label;
    const colorLabel = ariaLabel || label;
    return (
      <div
        ref={ref}
        {...stylex.props(styles.wrapper)}
        data-testid={selectors.components.ColorSwatch.name}
        {...otherProps}
      >
        {hasLabel && <span {...stylex.props(styles.label)}>{label}</span>}
        <button
          {...stylex.props(
            styles.swatch,
            isSmall ? styles.swatchSmall : styles.swatchLarge,
            color !== '' && styles.background(color),
            tinycolor(color).getAlpha() < 0.1 && styles.transparentBorder,
            isSelected &&
              styles.selected(`inset 0 0 0 2px ${color}, inset 0 0 0 4px ${theme.colors.getContrastText(color)}`)
          )}
          aria-label={
            colorLabel
              ? t('grafana-ui.color-swatch.aria-label-selected-color', '{{colorLabel}} color', { colorLabel })
              : t('grafana-ui.color-swatch.aria-label-default', 'Pick a color')
          }
          type="button"
        />
      </div>
    );
  }
);

ColorSwatch.displayName = 'ColorSwatch';

const styles = stylex.create({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  label: {
    marginRight: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
  },
  swatch: {
    borderStyle: 'none',
    borderRadius: shape['--gf-shape-radius-circle'],
    // The global `button:focus-visible` ring and `button:focus` outline reset out-specified the Emotion
    // swatch styles on main, so the swatch leaves outline alone and yields box-shadow to the ring.
    boxShadow: { default: null, ':not(:focus-visible)': 'none' },
    transitionProperty: { default: null, [motion.noPreference]: 'transform' },
    transitionDuration: { default: null, [motion.noPreference]: durations.short },
    transitionTimingFunction: { default: null, [motion.noPreference]: easings.easeInOut },
    transitionDelay: { default: null, [motion.noPreference]: '0ms' },
    transform: { default: null, ':hover': 'scale(1.1)' },
    forcedColorAdjust: { default: null, '@media (forced-colors: active)': 'none' },
  },
  swatchSmall: {
    width: '16px',
    height: '16px',
  },
  swatchLarge: {
    width: '32px',
    height: '32px',
  },
  // Not applied for an empty colour: Emotion emitted an invalid declaration there, leaving the UA background.
  background: (color: string) => ({
    backgroundColor: color,
  }),
  // Nearly transparent colours get a border so the swatch stays visible.
  transparentBorder: {
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-medium'],
  },
  selected: (boxShadow: string) => ({
    boxShadow: { default: null, ':not(:focus-visible)': boxShadow },
  }),
});
