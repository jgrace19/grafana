import * as stylex from '@stylexjs/stylex';
import { type HTMLAttributes } from 'react';
import * as React from 'react';

import { Icon, type IconName, useTheme2 } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, shape } from '@grafana/ui/stylex/tokens.stylex';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  onClick: () => void;
  children: React.ReactNode;
}

export const CardButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ icon, children, onClick, style, ...restProps }, ref) => {
    const theme = useTheme2();
    const hoverBackground = theme.colors.emphasize(theme.colors.background.secondary);

    return (
      <button
        {...restProps}
        {...mergeStylexProps(stylex.props(styles.action, styles.hoverBackground(hoverBackground)), { style })}
        onClick={onClick}
      >
        <Icon name={icon} size="xl" />
        {children}
      </button>
    );
  }
);

CardButton.displayName = 'CardButton';

const styles = stylex.create({
  action: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifySelf: 'center',
    cursor: 'pointer',
    borderRadius: shape['--gf-shape-radius-default'],
    color: colors['--gf-colors-text-primary'],
    borderWidth: 'unset',
    borderStyle: 'unset',
    borderColor: 'unset',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  hoverBackground: (hover: string) => ({
    backgroundColor: { default: colors['--gf-colors-background-secondary'], ':hover': hover },
  }),
});
