import * as stylex from '@stylexjs/stylex';
import { type ReactNode } from 'react';

import { t } from '@grafana/i18n';
import { IconButton, useTheme2 } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { getQueryEditorColors, SidebarSize } from '../../constants';
import { trackSidebarSizeToggle } from '../../tracking';

interface SidebarHeaderActionsProps {
  sidebarSize: SidebarSize;
  setSidebarSize: (size: SidebarSize) => void;
  children?: ReactNode;
}

export function SidebarHeaderActions({ sidebarSize, setSidebarSize, children }: SidebarHeaderActionsProps) {
  const themeColors = getQueryEditorColors(useTheme2());
  const isMini = sidebarSize === SidebarSize.Mini;

  return (
    <div {...stylex.props(styles.header, styles.background(themeColors.sidebarHeaderBackground))}>
      <div {...stylex.props(styles.inner)}>
        <IconButton
          name={isMini ? 'maximize-left' : 'compress-alt-left'}
          size="sm"
          variant="secondary"
          onClick={() => {
            trackSidebarSizeToggle(isMini ? 'expand' : 'collapse');
            setSidebarSize(isMini ? SidebarSize.Full : SidebarSize.Mini);
          }}
          aria-label={t('query-editor-next.sidebar.toggle-size', 'Toggle sidebar size')}
        />
        {children}
      </div>
    </div>
  );
}

const styles = stylex.create({
  header: {
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x1-5'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x1-5'],
    minHeight: spacing['--gf-spacing-x5'],
    display: 'flex',
    alignItems: 'center',
  },
  background: (backgroundColor: string) => ({ backgroundColor }),
  inner: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
  },
});
