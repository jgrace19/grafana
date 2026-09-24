import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { colors, typography } from '../../../themes/stylex/tokens.stylex';

interface Props {
  label: string | undefined;
  children?: React.ReactNode;
}

export const TimeZoneGroup = (props: Props) => {
  const { children, label } = props;

  if (!label) {
    return <div>{children}</div>;
  }

  return (
    <div>
      <div {...stylex.props(styles.header)}>
        <span {...stylex.props(styles.label)}>{label}</span>
      </div>
      {children}
    </div>
  );
};

const styles = stylex.create({
  header: {
    paddingTop: '7px',
    paddingBottom: '7px',
    paddingLeft: '10px',
    paddingRight: '10px',
    width: '100%',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors['--gf-colors-border-weak'],
    textTransform: 'capitalize',
  },
  label: {
    fontSize: typography['--gf-typography-size-sm'],
    color: colors['--gf-colors-text-secondary'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
  },
});
