import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { vizAndDataPaneNextStyles } from './VizAndDataPaneNext.stylex';
import { useRef } from 'react';

import { type SceneComponentProps } from '@grafana/scenes';

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


  const nextDataPane = scene.dataPane instanceof PanelDataPaneNext ? scene.dataPane : null;
  const isMiniSidebar = layout.sidebarSize === SidebarSize.Mini;

  return (
    <div ref={containerRef} {...stylex.props(vizAndDataPaneNextStyles.pageContainer)} style={layout.gridStyles}>
      {scene.controls && (
        <div
          {...stylex.props(
            vizAndDataPaneNextStyles.controlsWrapper,
            isMiniSidebar && vizAndDataPaneNextStyles.controlsWrapperMini
          )}
        >
          <scene.controls.Component model={scene.controls} />
        </div>
      )}
      <div
        {...stylex.props(
          vizAndDataPaneNextStyles.viz,
          isMiniSidebar && vizAndDataPaneNextStyles.vizMini,
          layout.isScrollingLayout && vizAndDataPaneNextStyles.fixedSizeViz
        )}
      >
        <scene.panelToShow.Component model={scene.panelToShow} />
        {nextDataPane && (
          <div {...stylex.props(vizAndDataPaneNextStyles.vizResizeHandle)}>
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
              className={
                mergeStylexClassName(
                  stylex.props(
                    vizAndDataPaneNextStyles.versionToggle,
                    isMiniSidebar && vizAndDataPaneNextStyles.versionToggleMini
                  ),
                  undefined
                ).className
              }
            />
          )}
          <div {...stylex.props(vizAndDataPaneNextStyles.sidebar)}>
            <div {...stylex.props(vizAndDataPaneNextStyles.sidebarContent)}>
              <Sidebar sidebarSize={layout.sidebarSize} setSidebarSize={layout.setSidebarSize} />
            </div>
            <div {...stylex.props(vizAndDataPaneNextStyles.sidebarResizeHandle)}>
              <div
                ref={layout.sidebarResizeHandle.ref}
                {...mergeStylexClassName(stylex.props(vizAndDataPaneNextStyles.resizeHandlePill), clsx(layout.sidebarResizeHandle.className))}
                data-testid="sidebar-resizer"
              />
            </div>
          </div>
          <div {...stylex.props(vizAndDataPaneNextStyles.dataPane)}>
            <nextDataPane.Component model={nextDataPane} />
          </div>
        </QueryEditorContextWrapper>
      )}
    </div>
  );
}


