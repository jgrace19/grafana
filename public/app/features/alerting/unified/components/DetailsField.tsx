import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import * as React from 'react';

import { mergeStylexProps } from '@grafana/ui/internal';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

interface Props {
  label: React.ReactNode;
  className?: string;
  /** first-party StyleX overrides */
  xstyle?: StyleXStyles;
  horizontal?: boolean;
  childrenWrapperClassName?: string;
}

export const DetailsField = ({
  className,
  xstyle,
  label,
  horizontal,
  children,
  childrenWrapperClassName,
}: React.PropsWithChildren<Props>) => {
  return (
    <div
      {...mergeStylexProps(
        stylex.props(styles.field, horizontal ? styles.fieldHorizontal : styles.fieldVertical, xstyle),
        { className }
      )}
    >
      <div {...stylex.props(styles.label)}>{label}</div>
      <div {...mergeStylexProps(stylex.props(styles.value), { className: childrenWrapperClassName })}>{children}</div>
    </div>
  );
};

const styles = stylex.create({
  fieldHorizontal: {
    flexDirection: {
      default: 'row',
      [bp.mdDown]: 'column',
    },
  },
  fieldVertical: {
    flexDirection: 'column',
  },
  field: {
    display: 'flex',
    marginTop: spacing['--gf-spacing-x2'],
    marginRight: 0,
    marginBottom: spacing['--gf-spacing-x2'],
    marginLeft: 0,
  },
  label: {
    width: '110px',
    paddingRight: spacing['--gf-spacing-x1'],
    fontSize: typography['--gf-typography-size-sm'],
    fontWeight: typography['--gf-typography-font-weight-bold'],
    lineHeight: 1.8,
  },
  value: {
    flex: '1',
    color: colors['--gf-colors-text-secondary'],
  },
});
