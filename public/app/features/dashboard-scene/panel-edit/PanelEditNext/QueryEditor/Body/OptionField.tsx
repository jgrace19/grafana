import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { optionFieldStyles } from './OptionField.stylex';
import { type FocusEvent, type ReactNode } from 'react';

import {Icon, Input, Tooltip} from '@grafana/ui';

import { CONTENT_SIDE_BAR, QUERY_OPTION_FIELD_CONFIG } from '../../constants';
import { type QueryOptionField } from '../types';

export interface OptionFieldProps {
  field: QueryOptionField;
  onBlur?: (event: FocusEvent<HTMLInputElement>, field: QueryOptionField) => void;
  focusedField?: QueryOptionField | null;
  defaultValue?: string | number;
  placeholder?: string;
  hint?: string;
  disabled?: boolean;
  children?: ReactNode;
}

export function OptionField({
  field,
  onBlur,
  focusedField,
  defaultValue = '',
  placeholder,
  hint,
  disabled,
  children,
}: OptionFieldProps) {

  const config = QUERY_OPTION_FIELD_CONFIG[field];
  const tooltip = config.getTooltip();
  const label = config.getLabel();

  return (
    <div {...stylex.props(optionFieldStyles.field)}>
      <Tooltip content={tooltip}>
        <Icon name="info-circle" size="md" {...stylex.props(optionFieldStyles.infoIcon)} />
      </Tooltip>
      <span {...stylex.props(optionFieldStyles.fieldLabel)}>{label}</span>
      <div {...stylex.props(optionFieldStyles.fieldContent)}>
        {children ?? (
          <Input
            type={config.inputType ?? 'text'}
            value={disabled ? defaultValue : undefined}
            defaultValue={disabled ? undefined : defaultValue}
            placeholder={placeholder ?? config.placeholder}
            onBlur={onBlur ? (e) => onBlur(e, field) : undefined}
            autoFocus={!disabled && focusedField === field}
            disabled={disabled}
            aria-label={label}
            {...stylex.props(optionFieldStyles.fieldInput)}
          />
        )}
        {hint && <span {...stylex.props(optionFieldStyles.hint)}>{`= ${hint}`}</span>}
      </div>
    </div>
  );
}


