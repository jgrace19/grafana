import * as stylex from '@stylexjs/stylex';
import { useState, forwardRef, type FocusEvent } from 'react';
import { RgbaStringColorPicker } from 'react-colorful';
import { useThrottleFn } from 'react-use';

import { colorManipulator } from '@grafana/data';

import { useTheme2 } from '../../themes/ThemeContext';
import { ClickOutsideWrapper } from '../ClickOutsideWrapper/ClickOutsideWrapper';
import { type Props as InputProps } from '../Input/Input';

import ColorInput from './ColorInput';

import './SpectrumPalette.css';

export interface ColorPickerInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  value?: string;
  onChange: (color: string) => void;
  /** Format for returning the color in onChange callback, defaults to 'rgb' */
  returnColorAs?: 'rgb' | 'hex';
}

/**
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/pickers-colorpickerinput--docs
 */
export const ColorPickerInput = forwardRef<HTMLInputElement, ColorPickerInputProps>(
  ({ value = '', onChange, returnColorAs = 'rgb', ...inputProps }, ref) => {
    const [currentColor, setColor] = useState(value);
    const [isOpen, setIsOpen] = useState(false);
    const theme = useTheme2();

    useThrottleFn(
      (c) => {
        if (c === value) {
          return;
        }
        // Default to an empty string if no color value is available
        if (!c) {
          onChange('');
          return;
        }
        const color = theme.visualization.getColorByName(c);
        if (returnColorAs === 'rgb') {
          onChange(colorManipulator.asRgbString(color));
        } else {
          onChange(colorManipulator.asHexString(color));
        }
      },
      500,
      [currentColor]
    );

    const handleBlur = (evt: FocusEvent<HTMLInputElement>) => {
      // Unless the user clicked inside the color picker, close it on blur
      const isClickInPopover = document.querySelector('[data-testid="color-popover"]')?.contains(evt.relatedTarget);
      if (!isClickInPopover) {
        setIsOpen(false);
      }
    };

    return (
      <ClickOutsideWrapper onClick={() => setIsOpen(false)}>
        <div {...stylex.props(styles.wrapper)}>
          {isOpen && !inputProps.disabled && (
            <RgbaStringColorPicker
              data-testid={'color-popover'}
              color={currentColor}
              onChange={setColor}
              className="gf-spectrum-palette gf-color-picker-input-popover"
            />
          )}
          <ColorInput
            {...inputProps}
            color={currentColor}
            onChange={setColor}
            buttonAriaLabel="Open color picker"
            onClick={() => setIsOpen(true)}
            onBlur={(e) => handleBlur(e)}
            ref={ref}
            isClearable
          />
        </div>
      </ClickOutsideWrapper>
    );
  }
);

ColorPickerInput.displayName = 'ColorPickerInput';

const styles = stylex.create({
  wrapper: {
    position: 'relative',
  },
});
