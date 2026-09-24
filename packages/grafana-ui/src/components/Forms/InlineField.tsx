import * as stylex from '@stylexjs/stylex';
import { cloneElement, type ReactNode, useId } from 'react';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { spacing } from '../../themes/stylex/tokens.stylex';
import { getChildId } from '../../utils/reactUtils';
import { type PopoverContent } from '../Tooltip/types';

import { type FieldProps } from './Field';
import { FieldValidationMessage } from './FieldValidationMessage';
import { InlineLabel } from './InlineLabel';
import { RadioButtonGroup } from './RadioButtonGroup/RadioButtonGroup';

export interface Props extends Omit<FieldProps, 'css' | 'horizontal' | 'description' | 'error'> {
  /** Content for the label's tooltip */
  tooltip?: PopoverContent;
  /** Custom width for the label as a multiple of 8px */
  labelWidth?: number | 'auto';
  /** Make the field's child to fill the width of the row. Equivalent to setting `flex-grow:1` on the field */
  grow?: boolean;
  /** Make the field's child shrink with width of the row. Equivalent to setting `flex-shrink:1` on the field */
  shrink?: boolean;
  /** Make field's background transparent */
  transparent?: boolean;
  /** Error message to display */
  error?: ReactNode;
  htmlFor?: string;
  /** Make tooltip interactive */
  interactive?: boolean;
  /** @internal first-party StyleX overrides for the InlineLabel rendered from a string `label`, applied last */
  labelXstyle?: stylex.StyleXStyles;
}

/**
 * A basic component for rendering form elements, like `Input`, `Checkbox`, `Combobox`, etc, inline together with `InlineLabel`. If the child element has `id` specified, the label's `htmlFor` attribute, pointing to the id, will be added.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/forms-inlinefield--docs
 */
export const InlineField = ({
  children,
  label,
  tooltip,
  labelWidth = 'auto',
  invalid,
  loading,
  disabled,
  required,
  className,
  htmlFor,
  grow,
  shrink,
  error,
  transparent,
  interactive,
  validationMessageHorizontalOverflow,
  xstyle,
  labelXstyle,
  ...htmlProps
}: Props) => {
  const inputId = htmlFor ?? getChildId(children);
  const useFieldset = children.type === RadioButtonGroup;
  const labelId = useId();

  const labelElement =
    typeof label === 'string' ? (
      <InlineLabel
        interactive={interactive}
        width={labelWidth}
        tooltip={tooltip}
        htmlFor={inputId}
        transparent={transparent}
        id={labelId}
        as={useFieldset ? 'span' : 'label'}
        xstyle={labelXstyle}
      >
        {`${label}${required ? ' *' : ''}`}
      </InlineLabel>
    ) : (
      label
    );

  const Wrapper = useFieldset ? 'fieldset' : 'div';

  return (
    <Wrapper
      {...mergeStylexProps(stylex.props(styles.container, grow && styles.grow, shrink && styles.shrink, xstyle), {
        className,
      })}
      {...htmlProps}
    >
      {labelElement}
      <div {...stylex.props(styles.childContainer, grow && styles.grow, shrink && styles.shrink)}>
        {cloneElement(children, { invalid, disabled, loading, 'aria-labelledby': useFieldset ? labelId : undefined })}
        {invalid && error && (
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
    </Wrapper>
  );
};

InlineField.displayName = 'InlineField';

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    textAlign: 'left',
    position: 'relative',
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    marginTop: 0,
    marginRight: spacing['--gf-spacing-x0-5'],
    marginBottom: spacing['--gf-spacing-x0-5'],
    marginLeft: 0,
  },
  childContainer: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
  },
  grow: {
    flexGrow: 1,
  },
  shrink: {
    flexShrink: 1,
  },
  fieldValidationWrapper: {
    marginTop: spacing['--gf-spacing-x0-5'],
  },
  validationMessageHorizontalOverflow: {
    width: 0,
    overflowX: 'visible',
    // white-space inherits, so this reaches the validation message the Emotion `& > *` rule targeted.
    whiteSpace: 'nowrap',
  },
});
