import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { queryOperationActionStyles } from './QueryOperationAction.stylex';
import * as React from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { IconButton, type IconName } from '@grafana/ui';

interface BaseQueryOperationActionProps {
  icon: IconName;
  title: string;
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  dataTestId?: string;
}

function BaseQueryOperationAction(props: QueryOperationActionProps | QueryOperationToggleActionProps) {

  return (
    <div {...mergeStylexClassName(stylex.props(queryOperationActionStyles.icon, 'active' in props && props.active && queryOperationActionStyles.active), undefined)}>
      <IconButton
        name={props.icon}
        tooltip={props.title}
        {...stylex.props(queryOperationActionStyles.icon)}
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

