import { useId, useMemo, useState } from 'react';
import { RgbaStringColorPicker } from 'react-colorful';
import { useThrottleFn } from 'react-use';
import tinycolor from 'tinycolor2';

import { colorManipulator } from '@grafana/data';
import { t } from '@grafana/i18n';

import { useTheme2 } from '../../themes/ThemeContext';
import { Field } from '../Forms/Field';
import { Stack } from '../Layout/Stack/Stack';

import ColorInput from './ColorInput';

import './SpectrumPalette.css';

export interface SpectrumPaletteProps {
  color: string;
  onChange: (color: string) => void;
}

const SpectrumPalette = ({ color, onChange }: SpectrumPaletteProps) => {
  const [currentColor, setColor] = useState(color);
  const colorInputId = useId();

  useThrottleFn(
    (c) => {
      onChange(colorManipulator.asHexString(theme.visualization.getColorByName(c)));
    },
    500,
    [currentColor]
  );

  const theme = useTheme2();

  const rgbaString = useMemo(() => {
    return currentColor.startsWith('rgba')
      ? currentColor
      : tinycolor(theme.visualization.getColorByName(color)).toRgbString();
  }, [currentColor, theme, color]);

  return (
    <Stack direction="column" grow={1} gap={2}>
      <RgbaStringColorPicker className="gf-spectrum-palette" color={rgbaString} onChange={setColor} />
      <Field noMargin label={t('grafana-ui.color-picker.input-label', 'RGBA value')}>
        <ColorInput id={colorInputId} color={rgbaString} onChange={setColor} />
      </Field>
    </Stack>
  );
};

export default SpectrumPalette;
