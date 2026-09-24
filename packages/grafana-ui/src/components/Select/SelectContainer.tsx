import * as stylex from '@stylexjs/stylex';
import { components, type ContainerProps as BaseContainerProps, type GroupBase } from 'react-select';

import { motion } from '../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, components as componentTokens, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';

import { type CustomComponentProps } from './types';

// prettier-ignore
export type SelectContainerProps<Option, isMulti extends boolean, Group extends GroupBase<Option>> =
  BaseContainerProps<Option, isMulti, Group> & CustomComponentProps<Option, isMulti, Group>;

export const SelectContainer = <Option, isMulti extends boolean, Group extends GroupBase<Option>>(
  props: SelectContainerProps<Option, isMulti, Group>
) => {
  const {
    isDisabled,
    isFocused,
    children,
    selectProps: { invalid = false, xstyle },
  } = props;

  const { className } = mergeStylexProps(
    stylex.props(
      styles.wrapper,
      invalid && styles.invalid,
      isFocused && styles.focused,
      isDisabled && (invalid ? styles.inputDisabledInvalid : styles.inputDisabled),
      xstyle
    ),
    { className: props.className }
  );

  return (
    <components.SelectContainer {...props} className={className}>
      {children}
    </components.SelectContainer>
  );
};

// The input look (getInputStyles wrapper + sharedInputStyle) that Select used to compose. The display and width
// come from the react-select `container` style in SelectBase, which wins over these classes.
const styles = stylex.create({
  wrapper: {
    borderRadius: shape['--gf-shape-radius-default'],
    backgroundColor: componentTokens['--gf-components-input-background'],
    lineHeight: typography['--gf-typography-body-line-height'],
    fontSize: typography['--gf-typography-size-md'],
    color: componentTokens['--gf-components-input-text'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: {
      default: componentTokens['--gf-components-input-border-color'],
      ':hover': componentTokens['--gf-components-input-border-hover'],
    },
    position: 'relative',
    boxSizing: 'border-box',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    minHeight: `calc(${spacing['--gf-spacing-grid-size']} * ${componentTokens['--gf-components-height-md']})`,
    height: 'auto',
    maxWidth: '100%',
    // Input padding is applied to the InputControl so the menu is aligned correctly
    padding: 0,
    cursor: 'pointer',
  },
  invalid: {
    borderColor: {
      default: colors['--gf-colors-error-border'],
      ':hover': colors['--gf-colors-error-shade'],
    },
  },
  focused: {
    outlineStyle: 'dotted',
    outlineWidth: '2px',
    outlineColor: 'transparent',
    outlineOffset: '2px',
    boxShadow: `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`,
    transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: 'cubic-bezier(0.19, 1, 0.22, 1)' },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: '0.2s' },
    transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'outline, outline-offset, box-shadow' },
  },
  // Disabled keeps the hover border colour, like the Emotion rule it replaces.
  inputDisabled: {
    backgroundColor: colors['--gf-colors-action-disabled-background'],
    color: colors['--gf-colors-action-disabled-text'],
    borderColor: {
      default: colors['--gf-colors-action-disabled-background'],
      ':hover': componentTokens['--gf-components-input-border-hover'],
    },
    cursor: 'not-allowed',
  },
  inputDisabledInvalid: {
    backgroundColor: colors['--gf-colors-action-disabled-background'],
    color: colors['--gf-colors-action-disabled-text'],
    borderColor: {
      default: colors['--gf-colors-action-disabled-background'],
      ':hover': colors['--gf-colors-error-shade'],
    },
    cursor: 'not-allowed',
  },
});
