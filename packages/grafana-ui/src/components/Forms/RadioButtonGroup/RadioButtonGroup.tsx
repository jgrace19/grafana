import * as stylex from '@stylexjs/stylex';
import { uniqueId } from 'lodash';
import { type HTMLAttributes, useCallback, useEffect, useRef } from 'react';

import { type SelectableValue, toIconName } from '@grafana/data';

import { mergeStylexProps } from '../../../themes/stylex/mergeStylexProps';
import { colors, components, shape, spacing } from '../../../themes/stylex/tokens.stylex';
import { Icon } from '../../Icon/Icon';

import { type RadioButtonSize, RadioButton } from './RadioButton';
export interface RadioButtonGroupProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'onClick'> {
  value?: T;
  id?: string;
  disabled?: boolean;
  disabledOptions?: T[];
  options: Array<SelectableValue<T>>;
  onChange?: (value: T) => void;
  onClick?: (value: T) => void;
  size?: RadioButtonSize;
  fullWidth?: boolean;
  className?: string;
  autoFocus?: boolean;
  ['aria-label']?: string;
  invalid?: boolean;
}

/**
 * RadioButtonGroup is used to select a single value from multiple mutually exclusive options.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/inputs-radiobuttongroup--docs
 */
export function RadioButtonGroup<T>({
  options,
  value,
  onChange,
  onClick,
  disabled,
  disabledOptions,
  size = 'md',
  id,
  className,
  fullWidth = false,
  autoFocus = false,
  'aria-label': ariaLabel,
  invalid = false,
  ...rest
}: RadioButtonGroupProps<T>) {
  const handleOnChange = useCallback(
    (option: SelectableValue) => {
      return () => {
        if (onChange) {
          onChange(option.value);
        }
      };
    },
    [onChange]
  );
  const handleOnClick = useCallback(
    (option: SelectableValue) => {
      return () => {
        if (onClick) {
          onClick(option.value);
        }
      };
    },
    [onClick]
  );

  const internalId = id ?? uniqueId('radiogroup-');
  const groupName = useRef(internalId);

  const activeButtonRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (autoFocus && activeButtonRef.current) {
      activeButtonRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div
      {...rest}
      role="radiogroup"
      aria-label={ariaLabel}
      {...mergeStylexProps(stylex.props(styles.radioGroup, fullWidth && styles.fullWidth, invalid && styles.invalid), {
        className,
      })}
    >
      {options.map((opt, i) => {
        const isItemDisabled = disabledOptions && opt.value && disabledOptions.includes(opt.value);
        const icon = opt.icon ? toIconName(opt.icon) : undefined;
        const hasNonIconPart = Boolean(opt.imgUrl || opt.label || opt.component);

        return (
          <RadioButton
            size={size}
            disabled={isItemDisabled || disabled}
            active={value === opt.value}
            key={`o.label-${i}`}
            aria-label={opt.ariaLabel}
            onChange={handleOnChange(opt)}
            onClick={handleOnClick(opt)}
            id={`option-${opt.value}-${internalId}`}
            name={groupName.current}
            description={opt.description}
            fullWidth={fullWidth}
            ref={value === opt.value ? activeButtonRef : undefined}
          >
            {icon && <Icon name={icon} xstyle={hasNonIconPart && styles.icon} />}
            {opt.imgUrl && <img src={opt.imgUrl} alt={opt.label} {...stylex.props(styles.img)} />}
            {opt.label} {opt.component ? <opt.component /> : null}
          </RadioButton>
        );
      })}
    </div>
  );
}

RadioButtonGroup.displayName = 'RadioButtonGroup';

const styles = stylex.create({
  radioGroup: {
    backgroundColor: colors['--gf-colors-background-primary'],
    display: 'inline-flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: {
      default: components['--gf-components-input-border-color'],
      ':hover': components['--gf-components-input-border-hover'],
    },
    borderRadius: shape['--gf-shape-radius-default'],
    // RADIO_GROUP_PADDING; stylex.create can't read values imported from other modules.
    padding: 2,
  },
  fullWidth: {
    display: 'flex',
    flexGrow: 1,
  },
  icon: {
    marginRight: '6px',
  },
  img: {
    width: spacing['--gf-spacing-x2'],
    height: spacing['--gf-spacing-x2'],
    marginRight: spacing['--gf-spacing-x1'],
  },
  // Hovering still shows the hover border colour.
  invalid: {
    borderColor: {
      default: colors['--gf-colors-error-border'],
      ':hover': components['--gf-components-input-border-hover'],
    },
  },
});
