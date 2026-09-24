import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import * as React from 'react';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';
import { Icon } from '../Icon/Icon';

import './FieldValidationMessage.css';

export interface FieldValidationMessageProps {
  /** Override component style */
  className?: string;
  horizontal?: boolean;
}

/**
 * Component for displaying a validation error message under an element.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/forms-fieldvalidationmessage--docs
 */
export const FieldValidationMessage = ({
  children,
  horizontal,
  className,
}: React.PropsWithChildren<FieldValidationMessageProps>) => {
  return (
    <div
      role="alert"
      {...mergeStylexProps(stylex.props(styles.base, horizontal ? styles.horizontal : styles.vertical), {
        className: clsx('gf-field-validation-message', className),
      })}
    >
      <Icon xstyle={styles.fieldValidationMessageIcon} name="exclamation-circle" />
      {children}
    </div>
  );
};

const styles = stylex.create({
  base: {
    fontSize: typography['--gf-typography-size-sm'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x1'],
    color: colors['--gf-colors-error-contrast-text'],
    backgroundColor: colors['--gf-colors-error-main'],
    borderRadius: shape['--gf-shape-radius-default'],
    position: 'relative',
    display: 'inline-block',
    alignSelf: 'flex-start',
    '::before': {
      content: '""',
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    },
  },
  vertical: {
    marginTop: spacing['--gf-spacing-x0-5'],
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    '::before': {
      left: '9px',
      top: '-5px',
      borderTopWidth: 0,
      borderRightWidth: '4px',
      borderBottomWidth: '5px',
      borderLeftWidth: '4px',
      borderTopColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: colors['--gf-colors-error-main'],
      borderLeftColor: 'transparent',
    },
  },
  horizontal: {
    marginLeft: '10px',
    '::before': {
      left: '-5px',
      top: '9px',
      borderTopWidth: '4px',
      borderRightWidth: '5px',
      borderBottomWidth: '4px',
      borderLeftWidth: 0,
      borderTopColor: 'transparent',
      borderRightColor: '#e02f44',
      borderBottomColor: 'transparent',
      borderLeftColor: 'transparent',
    },
  },
  fieldValidationMessageIcon: {
    marginRight: spacing['--gf-spacing-x1'],
  },
});
