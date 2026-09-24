import SliderComponent from '@rc-component/slider';
import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import { useState, useCallback, type ChangeEvent, type FocusEvent, useEffect } from 'react';
import { usePrevious } from 'react-use';

import { t } from '@grafana/i18n';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { spacing } from '../../themes/stylex/tokens.stylex';
import { Input } from '../Input/Input';

import { type SliderProps } from './types';

import '@rc-component/slider/assets/index.css';
import './Slider.css';

function stripAndParseNumber(raw: string): number {
  const str = raw.replace(/^0+/, '');
  let decimal = false;
  let numericBody = '';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);

    // take digits
    if (/\d/.test(char)) {
      numericBody += char;
    }
    // take the first period
    if (char === '.' && !decimal) {
      decimal = true;
      numericBody += '.';
    }
    // take only a leading negative sign
    if (char === '-' && numericBody.length === 0) {
      numericBody = '-';
    }

    // anything else is thrown away
  }
  const value = Number(numericBody);
  return value;
}

// gets rid of pesky things like 1.20000000000000002 and such, since this needs to be printed
// nicely for people.
function roundFloatingPointError(n: number) {
  return parseFloat(n.toPrecision(12));
}

function clampToAllowedValue(min: number, max: number, step: number, n: number): number {
  // default to min
  if (Number.isNaN(n)) {
    return min;
  }

  // clamp to max and min
  if (n > max) {
    return max;
  }
  if (n < min) {
    return min;
  }

  // ensure the value is exactly one of the allowed steps
  // find the closest step
  const closestStep = roundFloatingPointError(Math.round((n - min) / step) * step + min);

  // clamp the closest found step to min/max
  // this should never be needed unless the step isn't divisible by max-min, but it's a
  // quick and easy check to include.
  return Math.min(max, Math.max(min, closestStep));
}

/**
 * @public
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/inputs-slider--docs
 */
export const Slider = ({
  min,
  max,
  onChange,
  onAfterChange,
  orientation = 'horizontal',
  reverse,
  step = 1,
  value,
  ariaLabelForHandle,
  marks,
  included,
  inputId,
  showInput = true,
}: SliderProps) => {
  const isHorizontal = orientation === 'horizontal';
  const SliderWithTooltip = SliderComponent;

  const [inputValue, setInputValue] = useState<string>((value ?? min).toString());
  const numericValue = clampToAllowedValue(min, max, step, stripAndParseNumber(inputValue));

  // State synchronization. This is a hack since we have to maintain our own source of truth for the text input
  const previousValue = usePrevious(value);
  const externalValueChanged = value !== previousValue && value !== numericValue;
  useEffect(() => {
    if (externalValueChanged && value !== undefined) {
      // This only causes a re-render if the value is actually different, which should
      // only happen if the value is externally changed
      setInputValue(String(value));
    }
  }, [externalValueChanged, value]);

  const dragHandleAriaLabel =
    ariaLabelForHandle ?? t('grafana-ui.slider.drag-handle-aria-label', 'Use arrow keys to change the value');

  const onSliderChange = useCallback(
    (v: number | number[]) => {
      const num = typeof v === 'number' ? v : v[0];
      setInputValue(num.toString());
      onChange?.(num);
    },
    [onChange]
  );

  const handleChangeComplete = useCallback(
    (v: number | number[]) => {
      const num = typeof v === 'number' ? v : v[0];
      onAfterChange?.(num);
    },
    [onAfterChange]
  );

  const onTextInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;

      // Update the raw input string to show what user typed, except the special case of `0-`, which
      // should result in just `-` as a user convenience.
      setInputValue(raw === '0-' ? '-' : raw);

      // Parse and validate the number
      const parsed = stripAndParseNumber(raw);
      if (onChange && !Number.isNaN(parsed)) {
        // Clamp the output value
        onChange(clampToAllowedValue(min, max, step, parsed));
      }
    },
    [onChange, min, max, step]
  );

  const onTextInputBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      const parsed = clampToAllowedValue(min, max, step, stripAndParseNumber(e.target.value));

      // Update both numeric and string values with the clamped result
      setInputValue(parsed.toString());
      onChange?.(parsed);
      onAfterChange?.(parsed);
    },
    [min, max, step, onChange, onAfterChange]
  );

  return (
    <div
      {...mergeStylexProps(
        stylex.props(
          styles.container,
          isHorizontal ? styles.containerHorizontal : styles.containerVertical,
          isHorizontal && Boolean(marks) && styles.containerHorizontalWithMarks
        ),
        { className: 'gf-slider' }
      )}
    >
      <div
        {...mergeStylexProps(stylex.props(styles.sliderInput, !isHorizontal && styles.sliderInputVertical), {
          className: clsx(!isHorizontal && 'gf-slider-input-vertical'),
        })}
      >
        <SliderWithTooltip
          min={min}
          max={max}
          step={step ?? 0.1}
          value={numericValue}
          onChange={onSliderChange}
          onChangeComplete={handleChangeComplete}
          vertical={!isHorizontal}
          reverse={reverse}
          ariaLabelForHandle={dragHandleAriaLabel}
          marks={marks}
          included={included}
        />

        {showInput && (
          <Input
            type="text"
            width={7.5}
            xstyle={isHorizontal ? styles.inputField : styles.inputFieldVertical}
            inputXstyle={styles.inputFieldInput}
            value={inputValue}
            onChange={onTextInputChange}
            onBlur={onTextInputBlur}
            min={min}
            max={max}
            id={inputId}
          />
        )}
      </div>
    </div>
  );
};

Slider.displayName = 'Slider';

const styles = stylex.create({
  inputField: {
    marginLeft: `calc(${spacing['--gf-spacing-grid-size']} * 3)`,
  },
  inputFieldVertical: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: `calc(${spacing['--gf-spacing-grid-size']} * 3)`,
    marginLeft: 0,
    order: 1,
  },
  inputFieldInput: {
    textAlign: 'center',
  },
  container: {
    width: '100%',
  },
  containerHorizontal: {
    margin: 'inherit',
    paddingBottom: 'inherit',
    height: 'auto',
  },
  containerHorizontalWithMarks: {
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
  },
  containerVertical: {
    marginTop: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    marginRight: `calc(${spacing['--gf-spacing-grid-size']} * 3)`,
    marginBottom: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    marginLeft: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    paddingBottom: 'inherit',
    height: '100%',
  },
  sliderInput: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  sliderInputVertical: {
    flexDirection: 'column',
    height: '100%',
  },
});
