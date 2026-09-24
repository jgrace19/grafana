import * as stylex from '@stylexjs/stylex';
import { debounce } from 'lodash';
import { forwardRef, useState, useEffect, useMemo } from 'react';
import * as React from 'react';
import tinycolor from 'tinycolor2';

import { colors, shape, spacing } from '../../themes/stylex/tokens.stylex';
import { Input, type Props as InputProps } from '../Input/Input';

import { type ColorPickerProps } from './ColorPickerPopover';

interface ColorInputProps extends ColorPickerProps, Omit<InputProps, 'color' | 'onChange'> {
  isClearable?: boolean;
  buttonAriaLabel?: string;
}

const ColorInput = forwardRef<HTMLInputElement, ColorInputProps>(
  ({ color, onChange, isClearable = false, onClick, onBlur, disabled, buttonAriaLabel, ...inputProps }, ref) => {
    const [value, setValue] = useState(color);
    const [previousColor, setPreviousColor] = useState(color);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const updateColor = useMemo(() => debounce(onChange, 100), []);

    useEffect(() => {
      const newColor = tinycolor(color);
      if (newColor.isValid() && color !== previousColor) {
        setValue(newColor.toString());
        setPreviousColor(color);
      }
    }, [color, previousColor]);

    const onChangeColor = (event: React.SyntheticEvent<HTMLInputElement>) => {
      const { value: colorValue } = event.currentTarget;

      setValue(colorValue);
      if (colorValue === '' && isClearable) {
        updateColor(colorValue);
        return;
      }
      const newColor = tinycolor(colorValue);

      if (newColor.isValid()) {
        updateColor(newColor.toString());
      }
    };

    const onBlurInput = (event: React.FocusEvent<HTMLInputElement>) => {
      const newColor = tinycolor(value);

      if (!newColor.isValid()) {
        setValue(color);
      }

      onBlur?.(event);
    };

    return (
      <Input
        {...inputProps}
        value={value}
        onChange={onChangeColor}
        disabled={disabled}
        onClick={onClick}
        onBlur={onBlurInput}
        addonBefore={<ColorPreview onClick={onClick} ariaLabel={buttonAriaLabel} disabled={disabled} color={color} />}
        ref={ref}
      />
    );
  }
);

ColorInput.displayName = 'ColorInput';

export default ColorInput;

interface ColorPreviewProps {
  color: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  ariaLabel?: string;
}

const ColorPreview = ({ color, onClick, disabled, ariaLabel }: ColorPreviewProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled || !onClick}
      {...stylex.props(styles.preview, color !== '' && styles.background(color))}
    />
  );
};

const styles = stylex.create({
  preview: {
    height: '100%',
    width: `calc(${spacing['--gf-spacing-grid-size']} * 4)`,
    borderTopLeftRadius: shape['--gf-shape-radius-default'],
    borderTopRightRadius: 'unset',
    borderBottomRightRadius: 'unset',
    borderBottomLeftRadius: shape['--gf-shape-radius-default'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-medium'],
  },
  // Not applied for an empty colour: Emotion emitted an invalid declaration there, leaving the UA background.
  background: (color: string) => ({
    backgroundColor: color,
  }),
});
