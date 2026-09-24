import * as stylex from '@stylexjs/stylex';
import { useRef } from 'react';

import { type SceneComponentProps } from '@grafana/scenes';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { type PanelEditor } from '../PanelEditor';
import { QueryEditorBanner } from '../QueryEditorBanner';

import { PanelDataPaneNext } from './PanelDataPaneNext';
import { QueryEditorContextWrapper } from './QueryEditor/QueryEditorContextWrapper';
import { Sidebar } from './QueryEditor/Sidebar/Sidebar';
import { SidebarSize } from './constants';
import { useQueryEditorBanner, useVizAndDataPaneLayout } from './hooks';

export function VizAndDataPaneNext({ model }: SceneComponentProps<PanelEditor>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { showBanner, dismissBanner } = useQueryEditorBanner();
  const { scene, layout } = useVizAndDataPaneLayout(model, containerRef, showBanner);
  const isMini = layout.sidebarSize === SidebarSize.Mini;

  const nextDataPane = scene.dataPane instanceof PanelDataPaneNext ? scene.dataPane : null;

  return (
    <div ref={containerRef} {...stylex.props(styles.pageContainer)} style={layout.gridStyles}>
      {scene.controls && (
        <div {...stylex.props(styles.controlsWrapper, isMini && styles.miniSidebarIndent)}>
          <scene.controls.Component model={scene.controls} />
        </div>
      )}
      <div
        {...stylex.props(
          styles.viz,
          isMini && styles.miniSidebarIndent,
          layout.isScrollingLayout && styles.fixedSizeViz
        )}
      >
        <scene.panelToShow.Component model={scene.panelToShow} />
        {nextDataPane && (
          <div {...stylex.props(styles.vizResizeHandle)}>
            <div
              ref={layout.vizResizeHandle.ref}
              className={layout.vizResizeHandle.className}
              data-testid="viz-resizer"
            />
          </div>
        )}
      </div>
      {nextDataPane && (
        <QueryEditorContextWrapper
          dataPane={nextDataPane}
          onSwitchToClassic={model.onToggleQueryEditorVersion}
          showVersionBanner={showBanner}
        >
          {showBanner && (
            <QueryEditorBanner
              useQueryExperienceNext={model.state.useQueryExperienceNext ?? false}
              onToggle={model.onToggleQueryEditorVersion}
              onDismiss={dismissBanner}
              className={stylex.props(styles.versionToggle, isMini && styles.versionToggleMini).className}
            />
          )}
          <div {...stylex.props(styles.sidebar)}>
            <div {...stylex.props(styles.sidebarContent)}>
              <Sidebar sidebarSize={layout.sidebarSize} setSidebarSize={layout.setSidebarSize} />
            </div>
            <div {...stylex.props(styles.sidebarResizeHandle)}>
              <div
                ref={layout.sidebarResizeHandle.ref}
                className={layout.sidebarResizeHandle.className}
                data-testid="sidebar-resizer"
              />
            </div>
          </div>
          <div {...stylex.props(styles.dataPane)}>
            <nextDataPane.Component model={nextDataPane} />
          </div>
        </QueryEditorContextWrapper>
      )}
    </div>
  );
}

const styles = stylex.create({
  pageContainer: {
    display: 'grid',
    gap: spacing['--gf-spacing-x2'],
    overflow: 'hidden',
    paddingBottom: spacing['--gf-spacing-x2'],
  },
  versionToggle: {
    gridColumnEnd: 'version-toggle',
    gridColumnStart: 'version-toggle',
    gridRowEnd: 'version-toggle',
    gridRowStart: 'version-toggle',
    minWidth: 0,
    overflow: 'hidden',
  },
  versionToggleMini: {
    marginLeft: spacing['--gf-spacing-x2'],
  },
  miniSidebarIndent: {
    paddingLeft: spacing['--gf-spacing-x2'],
  },
  sidebar: {
    gridColumnEnd: 'sidebar',
    gridColumnStart: 'sidebar',
    gridRowEnd: 'sidebar',
    gridRowStart: 'sidebar',
    position: 'relative',
    paddingLeft: spacing['--gf-spacing-x2'],
    minWidth: 0,
    minHeight: 0,
    overflow: 'hidden',
  },
  sidebarContent: {
    height: '100%',
  },
  viz: {
    gridColumnEnd: 'viz',
    gridColumnStart: 'viz',
    gridRowEnd: 'viz',
    gridRowStart: 'viz',
    overflow: 'visible',
    position: 'relative',
    minHeight: 0,
  },
  dataPane: {
    gridColumnEnd: 'data-pane',
    gridColumnStart: 'data-pane',
    gridRowEnd: 'data-pane',
    gridRowStart: 'data-pane',
    overflow: 'hidden',
    minHeight: 0,
  },
  controlsWrapper: {
    gridColumnEnd: 'controls',
    gridColumnStart: 'controls',
    gridRowEnd: 'controls',
    gridRowStart: 'controls',
    display: 'flex',
    flexDirection: 'column',
  },
  fixedSizeViz: {
    height: '100vh',
  },
  vizResizeHandle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  sidebarResizeHandle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
  },
});
