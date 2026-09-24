import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import type { JSX } from 'react';

import { t } from '@grafana/i18n';

import { useTheme2 } from '../../themes/ThemeContext';
import { colors, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';
import { IconButton, type Props as IconButtonProps } from '../IconButton/IconButton';

import './Select.css';

interface MultiValueContainerProps {
  innerProps: JSX.IntrinsicElements['div'];
}

export const MultiValueContainer = ({ innerProps, children }: React.PropsWithChildren<MultiValueContainerProps>) => {
  const theme = useTheme2();
  const hoverBackground = theme.colors.emphasize(theme.colors.background.secondary);

  return (
    <div {...innerProps} {...stylex.props(styles.multiValueContainer, styles.hoverBackground(hoverBackground))}>
      {children}
    </div>
  );
};

export type MultiValueRemoveProps = {
  innerProps: IconButtonProps;
};

export const MultiValueRemove = ({ children, innerProps }: React.PropsWithChildren<MultiValueRemoveProps>) => {
  return (
    <IconButton
      {...innerProps}
      name="times"
      size="sm"
      className="gf-select-multi-value-remove"
      tooltip={t('grafana-ui.select.multi-value-remove', 'Remove')}
    />
  );
};

const styles = stylex.create({
  multiValueContainer: {
    display: 'flex',
    alignItems: 'center',
    lineHeight: 1,
    borderRadius: shape['--gf-shape-radius-sm'],
    marginTop: spacing['--gf-spacing-x0-25'],
    marginRight: spacing['--gf-spacing-x1'],
    marginBottom: spacing['--gf-spacing-x0-25'],
    marginLeft: 0,
    paddingTop: spacing['--gf-spacing-x0-25'],
    paddingRight: 0,
    paddingBottom: spacing['--gf-spacing-x0-25'],
    paddingLeft: spacing['--gf-spacing-x1'],
    color: colors['--gf-colors-text-primary'],
    fontSize: typography['--gf-typography-size-sm'],
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  hoverBackground: (hover: string) => ({
    backgroundColor: { default: colors['--gf-colors-background-secondary'], ':hover': hover },
  }),
});
