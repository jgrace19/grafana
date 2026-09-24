import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { IconButton, type IconName, useTheme2 } from '@grafana/ui';
import { colors, shape } from '@grafana/ui/stylex/tokens.stylex';

interface BaseQueryOperationActionProps {
  icon: IconName;
  title: string;
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  dataTestId?: string;
}

function BaseQueryOperationAction(props: QueryOperationActionProps | QueryOperationToggleActionProps) {
  const theme = useTheme2();

  return (
    <div {...stylex.props(styles.icon, 'active' in props && props.active && styles.active)}>
      <IconButton
        name={props.icon}
        tooltip={props.title}
        // IconButton has no `xstyle`; its own display and colour beat a StyleX class passed as `className`.
        // Its disabled colour still wins, as it did over the Emotion override.
        style={{
          display: 'flex',
          position: 'relative',
          color: props.disabled ? undefined : theme.colors.text.secondary,
        }}
        disabled={!!props.disabled}
        onClick={props.onClick}
        type="button"
        data-testid={props.dataTestId ?? selectors.components.QueryEditorRow.actionButton(props.title)}
        {...('active' in props && { 'aria-pressed': props.active })}
      />
    </div>
  );
}

interface QueryOperationActionProps extends BaseQueryOperationActionProps {}
export function QueryOperationAction(props: QueryOperationActionProps) {
  return <BaseQueryOperationAction {...props} />;
}

interface QueryOperationToggleActionProps extends BaseQueryOperationActionProps {
  active: boolean;
}
export const QueryOperationToggleAction = (props: QueryOperationToggleActionProps) => {
  return <BaseQueryOperationAction {...props} />;
};

const styles = stylex.create({
  icon: {
    display: 'flex',
    position: 'relative',
    color: colors['--gf-colors-text-secondary'],
  },
  active: {
    '::before': {
      display: 'block',
      content: '" "',
      position: 'absolute',
      left: -1,
      right: 2,
      height: 3,
      borderRadius: shape['--gf-shape-radius-default'],
      bottom: -8,
      backgroundImage: colors['--gf-colors-gradients-brand-horizontal'],
    },
  },
});
