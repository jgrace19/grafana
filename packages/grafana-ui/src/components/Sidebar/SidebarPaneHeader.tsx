import * as stylex from '@stylexjs/stylex';
import { type ReactNode } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';

import { colors, spacing } from '../../themes/stylex/tokens.stylex';
import { IconButton } from '../IconButton/IconButton';
import { Text } from '../Text/Text';

import { useSidebarContext } from './useSidebar';

export interface Props {
  children?: ReactNode;
  title: string;
}

export function SidebarPaneHeader({ children, title }: Props) {
  const sidebarContext = useSidebarContext();

  if (!sidebarContext) {
    throw new Error('SidebarPaneHeader must be used within a Sidebar');
  }

  return (
    <div {...stylex.props(styles.wrapper)}>
      {sidebarContext.onClosePane && (
        <IconButton
          variant="secondary"
          size="lg"
          name="times"
          onClick={sidebarContext.onClosePane}
          aria-label={t('grafana-ui.sidebar.close', 'Close')}
          tooltip={t('grafana-ui.sidebar.close', 'Close')}
          data-testid={selectors.components.Sidebar.closePane}
        />
      )}
      <Text weight="medium" variant="h6" truncate data-testid="sidebar-pane-header-title">
        {title}
      </Text>
      {children}
    </div>
  );
}

const styles = stylex.create({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: `calc(${spacing['--gf-spacing-grid-size']} * 1.5)`,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 1.5)`,
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 1.5)`,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 1.5)`,
    height: `calc(${spacing['--gf-spacing-grid-size']} * 6)`,
    gap: spacing['--gf-spacing-grid-size'],
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
  },
});
