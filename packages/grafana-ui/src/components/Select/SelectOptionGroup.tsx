import * as stylex from '@stylexjs/stylex';
import { type GroupProps } from 'react-select';

import { colors } from '../../themes/stylex/tokens.stylex';

export const SelectOptionGroup = ({
  children,
  cx,
  getClassNames,
  getStyles,
  Heading,
  headingProps,
  label,
  selectProps,
  theme,
}: GroupProps) => {
  return (
    <div {...stylex.props(styles.group)}>
      <Heading
        cx={cx}
        getClassNames={getClassNames}
        getStyles={getStyles}
        selectProps={selectProps}
        theme={theme}
        {...headingProps}
      >
        {label}
      </Heading>
      {children}
    </div>
  );
};

const styles = stylex.create({
  group: {
    borderTopWidth: { default: null, ':not(:first-child)': '1px' },
    borderTopStyle: { default: null, ':not(:first-child)': 'solid' },
    borderTopColor: { default: null, ':not(:first-child)': colors['--gf-colors-border-weak'] },
    // ensure there's a bottom border if there are options following the group
    borderBottomWidth: { default: null, ':has(+ [role="option"])': '1px' },
    borderBottomStyle: { default: null, ':has(+ [role="option"])': 'solid' },
    borderBottomColor: { default: null, ':has(+ [role="option"])': colors['--gf-colors-border-weak'] },
  },
});
