import { css } from '@emotion/css';
import * as stylex from '@stylexjs/stylex';
import { type FocusEvent, type ReactNode } from 'react';

import { Icon, Input, Tooltip } from '@grafana/ui';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { QUERY_OPTION_FIELD_CONFIG } from '../../constants';
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
    <div {...stylex.props(styles.field)}>
      <Tooltip content={tooltip}>
        <Icon name="info-circle" size="md" xstyle={styles.infoIcon} />
      </Tooltip>
      <span {...stylex.props(styles.fieldLabel)}>{label}</span>
      <div {...stylex.props(styles.fieldContent)}>
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
            className={inputOverrides.fieldInput}
          />
        )}
        {hint && <span {...stylex.props(styles.hint)}>{`= ${hint}`}</span>}
      </div>
    </div>
  );
}

// stylex: pending Input migration. Overrides the Input wrapper's own width, which is unlayered Emotion and would
// beat a StyleX class. Input merges it with Emotion's cx. 80px is CONTENT_SIDE_BAR.labelWidth in ../../constants.ts.
const inputOverrides = {
  fieldInput: css({
    width: 80,
    flexShrink: 0,
  }),
};

const styles = stylex.create({
  field: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x0'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x0'],
  },
  fieldLabel: {
    // CONTENT_SIDE_BAR.fieldLabelWidth in ../../constants.ts
    width: 130,
    flexShrink: 0,
    color: colors['--gf-colors-text-primary'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    fontFamily: typography['--gf-typography-font-family-monospace'],
    whiteSpace: 'nowrap',
  },
  fieldContent: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0%',
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    minWidth: 0,
  },
  infoIcon: {
    color: colors['--gf-colors-text-secondary'],
    flexShrink: 0,
  },
  hint: {
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    fontFamily: typography['--gf-typography-font-family-monospace'],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: 0,
  },
});
