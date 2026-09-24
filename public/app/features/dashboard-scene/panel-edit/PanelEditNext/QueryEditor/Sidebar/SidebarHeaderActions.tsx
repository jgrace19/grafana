import * as stylex from '@stylexjs/stylex';
import { type ReactNode } from 'react';

import { t } from '@grafana/i18n';
import { IconButton, useTheme2 } from '@grafana/ui';

import { getQueryEditorColors, SidebarSize } from '../../constants';
import { trackSidebarSizeToggle } from '../../tracking';

import { sidebarHeaderActionsStyles } from './SidebarHeaderActions.stylex';

interface SidebarHeaderActionsProps {
  sidebarSize: SidebarSize;
  setSidebarSize: (size: SidebarSize) => void;
  children?: ReactNode;
}

export function SidebarHeaderActions({ sidebarSize, setSidebarSize, children }: SidebarHeaderActionsProps) {
  const theme = useTheme2();
  const themeColors = getQueryEditorColors(theme);
  const isMini = sidebarSize === SidebarSize.Mini;

  return (
    <div
      {...stylex.props(sidebarHeaderActionsStyles.header)}
      style={{ background: themeColors.sidebarHeaderBackground }}
    >
      <div {...stylex.props(sidebarHeaderActionsStyles.inner)}>
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
