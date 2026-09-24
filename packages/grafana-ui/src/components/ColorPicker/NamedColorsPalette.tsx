import * as stylex from '@stylexjs/stylex';
import type { JSX } from 'react';

import { t } from '@grafana/i18n';

import { useTheme2 } from '../../themes/ThemeContext';
import { spacing } from '../../themes/stylex/tokens.stylex';

import { ColorSwatch } from './ColorSwatch';
import NamedColorsGroup from './NamedColorsGroup';

export interface NamedColorsPaletteProps {
  color?: string;
  onChange: (colorName: string) => void;
}

export const NamedColorsPalette = ({ color, onChange }: NamedColorsPaletteProps) => {
  const theme = useTheme2();

  const swatches: JSX.Element[] = [];
  for (const hue of theme.visualization.hues) {
    swatches.push(<NamedColorsGroup key={hue.name} selectedColor={color} hue={hue} onColorSelect={onChange} />);
  }

  return (
    <>
      <div {...stylex.props(styles.swatches)}>{swatches}</div>
      <div {...stylex.props(styles.extraColors)}>
        <ColorSwatch
          isSelected={color === 'transparent'}
          color={'rgba(0,0,0,0)'}
          label={t('grafana-ui.named-colors-palette.transparent-swatch', 'Transparent')}
          onClick={() => onChange('transparent')}
        />
        <ColorSwatch
          isSelected={color === 'text'}
          color={theme.colors.text.primary}
          label={t('grafana-ui.named-colors-palette.text-color-swatch', 'Text color')}
          onClick={() => onChange('text')}
        />
      </div>
    </>
  );
};

const styles = stylex.create({
  extraColors: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    paddingTop: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    paddingRight: 0,
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    paddingLeft: 0,
  },
  swatches: {
    display: 'grid',
    flexGrow: 1,
  },
});
