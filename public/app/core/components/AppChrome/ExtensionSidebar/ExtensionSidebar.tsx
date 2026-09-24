import * as stylex from '@stylexjs/stylex';

import { usePluginComponents } from '@grafana/runtime';
import { useTheme2 } from '@grafana/ui';

import { getComponentMetaFromComponentId, useExtensionSidebarContext } from './ExtensionSidebarProvider';

export const DEFAULT_EXTENSION_SIDEBAR_WIDTH = 300;
export const MIN_EXTENSION_SIDEBAR_WIDTH = 100;
export const MAX_EXTENSION_SIDEBAR_WIDTH = Math.floor(window.innerWidth * (2 / 3));

type ExtensionSidebarComponentProps = {
  props?: Record<string, unknown>;
};

export function ExtensionSidebar() {
  const styles = getStyles(useTheme2());
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
    <div {...stylex.props(extensionSidebarStyles.sidebarWrapper)}>
      <div {...stylex.props(extensionSidebarStyles.content)}>
        {/* When the sidebar is open, we don't want the body to scroll */}
        {/* Need type assertion here due to the use of !important */}
        {/* see https://github.com/frenic/csstype/issues/114#issuecomment-697201978 */}
        {/* eslint-disable-next-line @typescript-eslint/consistent-type-assertions */}
        <Global styles={[cssReact({ body: { overflowY: 'unset !important' as 'unset' } })]} />
        <ExtensionComponent {...props} />
      </div>
    </div>
  );
}

