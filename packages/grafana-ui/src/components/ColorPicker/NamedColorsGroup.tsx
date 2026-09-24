import * as stylex from '@stylexjs/stylex';
import { type Property } from 'csstype';
import { upperFirst } from 'lodash';
import { useMemo } from 'react';

import { type ThemeVizHue } from '@grafana/data';

import { colors, spacing } from '../../themes/stylex/tokens.stylex';

import { ColorSwatch, ColorSwatchVariant } from './ColorSwatch';

interface NamedColorsGroupProps {
  hue: ThemeVizHue;
  selectedColor?: Property.Color;
  onColorSelect: (colorName: string) => void;
  key?: string;
}

const NamedColorsGroup = ({ hue, selectedColor, onColorSelect, ...otherProps }: NamedColorsGroupProps) => {
  const label = upperFirst(hue.name);
  const reversedShades = useMemo(() => {
    return [...hue.shades].reverse();
  }, [hue.shades]);

  return (
    <div {...stylex.props(styles.colorRow)}>
      <div {...stylex.props(styles.colorLabel)}>{label}</div>
      <div {...otherProps} {...stylex.props(styles.swatchRow)}>
        {reversedShades.map((shade) => (
          <ColorSwatch
            key={shade.name}
            aria-label={shade.name}
            variant={shade.primary ? ColorSwatchVariant.Large : ColorSwatchVariant.Small}
            isSelected={shade.name === selectedColor}
            color={shade.color}
            onClick={() => onColorSelect(shade.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default NamedColorsGroup;

const styles = stylex.create({
  colorRow: {
    display: 'grid',
    gridTemplateColumns: '25% 1fr',
    columnGap: `calc(${spacing['--gf-spacing-grid-size']} * 2)`,
    paddingTop: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
    paddingRight: 0,
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
    paddingLeft: 0,
    backgroundColor: { default: null, ':hover': colors['--gf-colors-background-secondary'] },
  },
  colorLabel: {
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    display: 'flex',
    alignItems: 'center',
  },
  swatchRow: {
    display: 'flex',
    gap: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
});
