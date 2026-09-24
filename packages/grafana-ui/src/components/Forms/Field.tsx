import * as stylex from '@stylexjs/stylex';
import { type HTMLAttributes } from 'react';
import * as React from 'react';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { spacing } from '../../themes/stylex/tokens.stylex';
import { getChildId } from '../../utils/reactUtils';

import { FieldValidationMessage } from './FieldValidationMessage';
import { Label, labelStyles } from './Label';
import { RadioButtonGroup } from './RadioButtonGroup/RadioButtonGroup';

export interface FieldProps extends HTMLAttributes<HTMLElement> {
  /** Form input element, i.e Input or Switch */
  children: React.ReactElement<Record<string, unknown>>;
  /** Label for the field */
  label?: React.ReactNode;
  /** Description of the field */
  description?: React.ReactNode;
  /** Indicates if field is in invalid state */
  invalid?: boolean;
  /** Indicates if field is in loading state */
  loading?: boolean;
  /** Indicates if field is disabled */
  disabled?: boolean;
  /** Indicates if field is required */
  required?: boolean;
  /** Error message to display */
  error?: React.ReactNode;
  /** Indicates horizontal layout of the field */
  horizontal?: boolean;
  /** make validation message overflow horizontally. Prevents pushing out adjacent inline components */
  validationMessageHorizontalOverflow?: boolean;

  className?: string;
  /**
   *  A unique id that associates the label of the Field component with the control with the unique id.
   *  If the `htmlFor` property is missing the `htmlFor` will be inferred from the `id` or `inputId` property of the first child.
   *  https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label#attr-for
   */
  htmlFor?: string;
  /** Remove the bottom margin */
  noMargin?: boolean;
}

/**
 * Field is the basic component for rendering form elements together with labels and description.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/forms-field--docs
 */
export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      label: labelProp,
      description,
      horizontal,
      invalid,
      loading,
      disabled,
      required,
      error,
      children,
      className,
      validationMessageHorizontalOverflow,
      htmlFor,
      noMargin,
      ...otherProps
    }: FieldProps,
    ref
  ) => {
    const useFieldset = children.type === RadioButtonGroup;
    const label = typeof labelProp === 'string' ? `${labelProp}${required ? ' *' : ''}` : labelProp;
    const inputId = htmlFor ?? getChildId(children);

    let labelElement = label;

    if (typeof label === 'string') {
      if (useFieldset) {
        labelElement = (
          <legend {...stylex.props(labelStyles.label)}>
            <div {...stylex.props(labelStyles.labelContent)}>{label}</div>
            {description && <span {...stylex.props(labelStyles.description)}>{description}</span>}
          </legend>
        );
      } else {
        labelElement = (
          <Label htmlFor={inputId} description={description}>
            {label}
          </Label>
        );
      }
    }

    const childProps = deleteUndefinedProps({ invalid, disabled, loading });
    const Wrapper = useFieldset ? 'fieldset' : 'div';
    return (
      <Wrapper
        {...mergeStylexProps(
          stylex.props(styles.field, noMargin && styles.noMargin, horizontal && styles.fieldHorizontal),
          {
            className,
          }
        )}
        {...otherProps}
      >
        {labelElement}
        <div>
          <div ref={ref}>{React.cloneElement(children, children.type !== React.Fragment ? childProps : undefined)}</div>
          {invalid && error && !horizontal && (
            <div
              {...stylex.props(
                styles.fieldValidationWrapper,
                validationMessageHorizontalOverflow && styles.validationMessageHorizontalOverflow
              )}
            >
              <FieldValidationMessage>{error}</FieldValidationMessage>
            </div>
          )}
        </div>

        {invalid && error && horizontal && (
          <div
            {...stylex.props(
              styles.fieldValidationWrapper,
              styles.fieldValidationWrapperHorizontal,
              validationMessageHorizontalOverflow && styles.validationMessageHorizontalOverflow
            )}
          >
            <FieldValidationMessage>{error}</FieldValidationMessage>
          </div>
        )}
      </Wrapper>
    );
  }
);

Field.displayName = 'Field';

function deleteUndefinedProps<T extends Object>(obj: T): Partial<T> {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  }

  return obj;
}

const styles = stylex.create({
  field: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: spacing['--gf-spacing-x2'],
  },
  noMargin: {
    marginBottom: 0,
  },
  fieldHorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  fieldValidationWrapper: {
    marginTop: spacing['--gf-spacing-x0-5'],
  },
  fieldValidationWrapperHorizontal: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '100%',
  },
  validationMessageHorizontalOverflow: {
    width: 0,
    overflowX: 'visible',
    // white-space inherits, so this reaches the validation message the Emotion `& > *` rule targeted.
    whiteSpace: 'nowrap',
  },
});
