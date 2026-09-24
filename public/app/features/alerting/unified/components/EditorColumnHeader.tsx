import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import { type MergeExclusive } from 'type-fest';

import { Label, Stack } from '@grafana/ui';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';
import './EditorColumnHeader.css';

interface BaseProps {
  id?: string;
}

interface ChildrenProps extends BaseProps {
  children: React.ReactNode;
}

interface LabelActionsProps extends BaseProps {
  label: string;
  actions?: React.ReactNode;
}

type Props = MergeExclusive<ChildrenProps, LabelActionsProps>;

export function EditorColumnHeader({ label, actions, id, children }: Props) {
  if (children) {
    return <div {...stylex.props(styles.container)}>{children}</div>;
  }

  return (
    <div {...stylex.props(styles.container)}>
      <Label className="gf-alerting-editor-column-label" id={id}>
        {label}
      </Label>
      {actions && (
        <Stack direction="row" gap={1}>
          {actions}
        </Stack>
      )}
    </div>
  );
}

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x2'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-medium'],
    borderTopLeftRadius: shape['--gf-shape-radius-default'],
    borderTopRightRadius: shape['--gf-shape-radius-default'],
  },
});
