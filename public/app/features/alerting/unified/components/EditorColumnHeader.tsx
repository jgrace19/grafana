import * as stylex from '@stylexjs/stylex';
import { editorColumnHeaderStyles } from './EditorColumnHeader.stylex';
import * as React from 'react';
import { type MergeExclusive } from 'type-fest';

import { Label, Stack } from '@grafana/ui';

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
    return <div {...stylex.props(formStyles.container)}>{children}</div>;
  }

  return (
    <div {...stylex.props(formStyles.container)}>
      <Label {...stylex.props(formStyles.label)} id={id}>
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

