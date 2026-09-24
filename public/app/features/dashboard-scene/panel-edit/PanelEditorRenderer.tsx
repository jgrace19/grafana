import { css, cx } from '@emotion/css';
import * as stylex from '@stylexjs/stylex';
import { useEffect, useMemo } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { type SceneComponentProps, type VizPanel } from '@grafana/scenes';
import { Button, Spinner, ToolbarButton, useTheme2 } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { MIN_SUGGESTIONS_PANE_WIDTH } from 'app/features/panel/suggestions/constants';

import { useEditPaneCollapsed } from '../edit-pane/shared';
import { NavToolbarActions } from '../scene/NavToolbarActions';
import { UnlinkModal } from '../scene/UnlinkModal';
import { getDashboardSceneFor, getLibraryPanelBehavior } from '../utils/utils';

import { type PanelEditor } from './PanelEditor';
import { SaveLibraryVizPanelModal } from './SaveLibraryVizPanelModal';
import { useSnappingSplitter } from './splitter/useSnappingSplitter';
import { useScrollReflowLimit } from './useScrollReflowLimit';

import './PanelEditorRenderer.css';

export function PanelEditorRenderer({ model }: SceneComponentProps<PanelEditor>) {
  const dashboard = getDashboardSceneFor(model);
  const { optionsPane } = model.useState();
  const [isInitiallyCollapsed, setIsCollapsed] = useEditPaneCollapsed();

  const isScrollingLayout = useScrollReflowLimit();

  const theme = useTheme2();
  const panePadding = useMemo(() => +theme.spacing(2).replace(/px$/, ''), [theme]);
  const { containerProps, primaryProps, secondaryProps, splitterProps, splitterState, onToggleCollapse } =
    useSnappingSplitter({
      direction: 'row',
      dragPosition: 'end',
      initialSize: 330,
      usePixels: true,
      collapsed: isInitiallyCollapsed,
      collapseBelowPixels: MIN_SUGGESTIONS_PANE_WIDTH + panePadding,
      disabled: isScrollingLayout,
    });

  useEffect(() => {
    setIsCollapsed(splitterState.collapsed);
  }, [splitterState.collapsed, setIsCollapsed]);

  return (
    <>
      <NavToolbarActions dashboard={dashboard} />
      <div
        {...containerProps}
        className={cx(containerProps.className, splitterOverrides.content)}
        data-testid={selectors.components.PanelEditor.General.content}
      >
        <div {...primaryProps} className={mergeClassNames(primaryProps.className, styles.body)}>
          <VizAndDataPane model={model} />
        </div>
        <div {...splitterProps} />
        <div {...secondaryProps} className={mergeClassNames(secondaryProps.className, styles.optionsPane)}>
          {splitterState.collapsed && (
            <div {...stylex.props(styles.expandOptionsWrapper)}>
              <ToolbarButton
                tooltip={t('dashboard-scene.panel-editor-renderer.tooltip-open-options-pane', 'Open options pane')}
                icon={'arrow-to-right'}
                onClick={onToggleCollapse}
                variant="canvas"
                className={stylex.props(styles.rotate180).className}
                aria-label={t(
                  'dashboard-scene.panel-editor-renderer.aria-label-open-options-pane',
                  'Open options pane'
                )}
              />
            </div>
          )}
          {!splitterState.collapsed && optionsPane && <optionsPane.Component model={optionsPane} />}
          {!splitterState.collapsed && !optionsPane && <Spinner />}
        </div>
      </div>
    </>
  );
}

function VizAndDataPane({ model }: SceneComponentProps<PanelEditor>) {
  const dashboard = getDashboardSceneFor(model);
  const { dataPane, showLibraryPanelSaveModal, showLibraryPanelUnlinkModal, tableView } = model.useState();
  const panel = model.getPanel();
  const libraryPanel = getLibraryPanelBehavior(panel);
  const { controls } = dashboard.useState();

  const isScrollingLayout = useScrollReflowLimit();

  const { containerProps, primaryProps, secondaryProps, splitterProps, splitterState, onToggleCollapse } =
    useSnappingSplitter({
      direction: 'column',
      dragPosition: 'start',
      initialSize: 0.5,
      collapseBelowPixels: 150,
      disabled: isScrollingLayout,
    });

  containerProps.className = mergeClassNames(containerProps.className, styles.container);

  if (!dataPane && !isScrollingLayout) {
    primaryProps.style.flexGrow = 1;
  }

  return (
    <div {...stylex.props(styles.pageContainer, controls && styles.pageContainerWithControls)}>
      {controls && (
        <div {...stylex.props(styles.controlsWrapper)}>
          <controls.Component model={controls} />
        </div>
      )}
      <div {...containerProps}>
        <div
          {...primaryProps}
          className={mergeClassNames(primaryProps.className, isScrollingLayout && styles.fixedSizeViz)}
        >
          <VizWrapper panel={panel} tableView={tableView} />
        </div>
        {showLibraryPanelSaveModal && libraryPanel && (
          <SaveLibraryVizPanelModal
            libraryPanel={libraryPanel}
            onDismiss={model.onDismissLibraryPanelSaveModal}
            onConfirm={model.onConfirmSaveLibraryPanel}
            onDiscard={model.onDiscard}
          ></SaveLibraryVizPanelModal>
        )}
        {showLibraryPanelUnlinkModal && libraryPanel && (
          <UnlinkModal
            onDismiss={model.onDismissUnlinkLibraryPanelModal}
            onConfirm={model.onConfirmUnlinkLibraryPanel}
            isOpen
          />
        )}
        {dataPane && (
          <>
            <div {...splitterProps} />
            <div
              {...secondaryProps}
              className={mergeClassNames(secondaryProps.className, isScrollingLayout && styles.fullSizeEditor)}
            >
              {splitterState.collapsed && (
                <div {...stylex.props(styles.expandDataPane)}>
                  <Button
                    tooltip={t('dashboard-scene.viz-and-data-pane.tooltip-open-query-pane', 'Open query pane')}
                    icon={'arrow-to-right'}
                    onClick={onToggleCollapse}
                    variant="secondary"
                    size="sm"
                    className="gf-panel-editor-open-data-pane-button"
                    aria-label={t('dashboard-scene.viz-and-data-pane.aria-label-open-query-pane', 'Open query pane')}
                  />
                </div>
              )}
              {/* @ts-expect-error - dataPane is a union type of PanelDataPane and PanelDataPaneNext */}
              {!splitterState.collapsed && <dataPane.Component model={dataPane} />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface VizWrapperProps {
  panel: VizPanel;
  tableView?: VizPanel;
}

function VizWrapper({ panel, tableView }: VizWrapperProps) {
  const panelToShow = tableView ?? panel;

  return (
    <div {...stylex.props(styles.vizWrapper)}>
      <panelToShow.Component model={panelToShow} />
    </div>
  );
}

/** Adds a StyleX style to a class name from useSnappingSplitter (Emotion today). */
function mergeClassNames(className: string | undefined, style: stylex.StyleXStyles | false): string {
  return mergeStylexProps(stylex.props(style), { className }).className ?? '';
}

// Must match scrollReflowMediaCondition in useScrollReflowLimit.ts.
const scrollReflowMediaQuery = '@media (max-height: 540px)';

// stylex: pending Splitter migration. `content` overrides the useSplitter container's overflow (and display, when
// the splitter isn't disabled), which is unlayered Emotion and would beat a StyleX class. Emotion's cx merges it
// after the splitter class.
const splitterOverrides = {
  content: css({
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'unset',
    [scrollReflowMediaQuery]: {
      height: 'auto',
      display: 'grid',
      gridTemplateColumns: 'minmax(470px, 1fr) 330px',
      gridTemplateRows: '1fr',
      gap: 'var(--gf-spacing-x1)',
      position: 'static',
      width: '100%',
    },
  }),
};

const styles = stylex.create({
  pageContainer: {
    display: 'grid',
    gridTemplateAreas: `
        "panels"`,
    gridTemplateColumns: { default: '1fr', [scrollReflowMediaQuery]: '100%' },
    gridTemplateRows: '1fr',
    height: '100%',
  },
  pageContainerWithControls: {
    gridTemplateAreas: `
        "controls"
        "panels"`,
    gridTemplateRows: 'auto 1fr',
  },
  container: {
    gridColumnEnd: 'panels',
    gridColumnStart: 'panels',
    gridRowEnd: 'panels',
    gridRowStart: 'panels',
    height: '100%',
  },
  body: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  },
  optionsPane: {
    flexDirection: 'column',
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderLeftColor: colors['--gf-colors-border-weak'],
    backgroundColor: colors['--gf-colors-background-primary'],
    marginTop: spacing['--gf-spacing-x2'],
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors['--gf-colors-border-weak'],
    borderTopLeftRadius: shape['--gf-shape-radius-default'],
  },
  expandOptionsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: spacing['--gf-spacing-x2'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x2'],
    paddingLeft: spacing['--gf-spacing-x1'],
  },
  expandDataPane: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors['--gf-colors-border-weak'],
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: colors['--gf-colors-border-weak'],
    backgroundColor: colors['--gf-colors-background-primary'],
    flexGrow: 1,
    justifyContent: 'space-around',
  },
  rotate180: {
    rotate: '180deg',
  },
  controlsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 0,
    gridColumnEnd: 'controls',
    gridColumnStart: 'controls',
    gridRowEnd: 'controls',
    gridRowStart: 'controls',
  },
  vizWrapper: {
    height: '100%',
    width: '100%',
    paddingLeft: spacing['--gf-spacing-x2'],
  },
  fixedSizeViz: {
    height: '100vh',
  },
  fullSizeEditor: {
    height: 'max-content',
  },
});
