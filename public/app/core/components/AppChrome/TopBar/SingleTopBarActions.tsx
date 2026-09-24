import * as stylex from '@stylexjs/stylex';

import { Components } from '@grafana/e2e-selectors';
import { type ScopesContextValue } from '@grafana/runtime';
import { Stack } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { ScopesSelector } from 'app/features/scopes/selector/ScopesSelector';

import { useExtensionSidebarContext } from '../ExtensionSidebar/ExtensionSidebarProvider';
import { NavToolbarSeparator } from '../NavToolbar/NavToolbarSeparator';

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
      {...stylex.props(
        styles.actionsBar,
        styles.height(getChromeHeaderLevelHeight()),
        isExtensionSidebarOpen && styles.constrained(`calc(100% - ${extensionSidebarWidth}px)`)
      )}
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

const styles = stylex.create({
  actionsBar: {
    alignItems: 'center',
    backgroundColor: colors['--gf-colors-background-primary'],
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
    display: 'flex',
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x2'],
  },
  height: (height: number) => ({ height }),
  constrained: (maxWidth: string) => ({ maxWidth }),
});
