import { mergeStylexClassName } from '@grafana/ui/unstable';
import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';

import { Components } from '@grafana/e2e-selectors';
import { type ScopesContextValue } from '@grafana/runtime';
import { Stack } from '@grafana/ui';
import { ScopesSelector } from 'app/features/scopes/selector/ScopesSelector';

import { useExtensionSidebarContext } from '../ExtensionSidebar/ExtensionSidebarProvider';
import { NavToolbarSeparator } from '../NavToolbar/NavToolbarSeparator';

import { singleTopBarActionsStyles } from './SingleTopBarActions.stylex';

import { getChromeHeaderLevelHeight } from './useChromeHeaderHeight';

export interface Props {
  actions?: React.ReactNode;
  breadcrumbActions?: React.ReactNode;
  scopes?: ScopesContextValue | undefined;
}

export function SingleTopBarActions({ actions, breadcrumbActions, scopes }: Props) {
  const { isOpen: isExtensionSidebarOpen, extensionSidebarWidth } = useExtensionSidebarContext();

  return (
    <div
      data-testid={Components.NavToolbar.container}
      {...stylex.props(singleTopBarActionsStyles.actionsBar)}
      style={{
        height: getChromeHeaderLevelHeight(),
        maxWidth: isExtensionSidebarOpen ? `calc(100% - ${extensionSidebarWidth}px)` : undefined,
      }}
    >
      <Stack alignItems="center" justifyContent="flex-start" flex={1} wrap="nowrap" minWidth={0}>
        {scopes?.state.enabled ? <ScopesSelector /> : undefined}
        <Stack alignItems="center" justifyContent={'flex-end'} flex={1} wrap="nowrap" minWidth={0}>
          {breadcrumbActions}
          {breadcrumbActions && actions && <NavToolbarSeparator />}
          {actions}
        </Stack>
      </Stack>
    </div>
  );
}

