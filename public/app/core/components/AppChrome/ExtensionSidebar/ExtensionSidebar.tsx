import * as stylex from '@stylexjs/stylex';
import { useEffect } from 'react';

import { PluginExtensionPoints } from '@grafana/data';
import { usePluginComponents } from '@grafana/runtime';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { getComponentMetaFromComponentId, useExtensionSidebarContext } from './ExtensionSidebarProvider';

import './ExtensionSidebar.css';

export const DEFAULT_EXTENSION_SIDEBAR_WIDTH = 300;
export const MIN_EXTENSION_SIDEBAR_WIDTH = 100;
export const MAX_EXTENSION_SIDEBAR_WIDTH = Math.floor(window.innerWidth * (2 / 3));

type ExtensionSidebarComponentProps = {
  props?: Record<string, unknown>;
};

export function ExtensionSidebar() {
  const { dockedComponentId, props = {} } = useExtensionSidebarContext();
  const { components, isLoading } = usePluginComponents<ExtensionSidebarComponentProps>({
    extensionPointId: PluginExtensionPoints.ExtensionSidebar,
  });

  if (isLoading || !dockedComponentId) {
    return null;
  }

  const dockedMeta = getComponentMetaFromComponentId(dockedComponentId);
  if (!dockedMeta) {
    return null;
  }

  const ExtensionComponent = components.find(
    (c) => c.meta.pluginId === dockedMeta.pluginId && c.meta.title === dockedMeta.componentTitle
  );

  if (!ExtensionComponent) {
    return null;
  }

  return (
    <div className={`gf-extension-sidebar ${stylex.props(styles.sidebarWrapper).className}`}>
      <div {...stylex.props(styles.content)}>
        {/* When the sidebar is open, we don't want the body to scroll */}
        <BodyOverflowUnset />
        <ExtensionComponent {...props} />
      </div>
    </div>
  );
}

function BodyOverflowUnset() {
  useEffect(() => {
    document.body.classList.add('gf-extension-sidebar-open');
    return () => document.body.classList.remove('gf-extension-sidebar-open');
  }, []);
  return null;
}

const styles = stylex.create({
  sidebarWrapper: {
    backgroundColor: colors['--gf-colors-background-primary'],
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderLeftColor: colors['--gf-colors-border-weak'],
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['--gf-spacing-x1'],
    width: '100%',
    height: '100%',
    overflow: 'auto',
  },
  content: {
    flex: '1',
    minHeight: 0,
  },
});
