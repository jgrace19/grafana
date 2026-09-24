import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { panelEditorRendererNextStyles } from './PanelEditorRendererNext.stylex';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { type SceneComponentProps } from '@grafana/scenes';
import {Spinner, ToolbarButton} from '@grafana/ui';

import { NavToolbarActions } from '../../scene/NavToolbarActions';
import { type PanelEditor } from '../PanelEditor';
import { scrollReflowMediaCondition } from '../useScrollReflowLimit';

import { VizAndDataPaneNext } from './VizAndDataPaneNext';
import { usePanelEditorShell } from './hooks';

export function PanelEditorRendererNext({ model }: SceneComponentProps<PanelEditor>) {
  const { dashboard, optionsPane, splitter } = usePanelEditorShell(model);
  const { containerProps, primaryProps, secondaryProps, splitterProps, splitterState, onToggleCollapse } = splitter;

  return (
    <div {...stylex.props(panelEditorRendererNextStyles.container)}>
      <NavToolbarActions dashboard={dashboard} />
      <div
        {...containerProps}
        className={cx(containerProps.className, panelEditorRendererNextStyles.content)}
        data-testid={selectors.components.PanelEditor.General.content}
      >
        <div {...primaryProps} className={cx(primaryProps.className, panelEditorRendererNextStyles.body)}>
          <VizAndDataPaneNext model={model} />
        </div>
        <div {...splitterProps} />
        <div {...secondaryProps} className={cx(secondaryProps.className, panelEditorRendererNextStyles.optionsPane)}>
          {splitterState.collapsed && (
            <div {...stylex.props(panelEditorRendererNextStyles.expandOptionsWrapper)}>
              <ToolbarButton
                tooltip={t('dashboard-scene.panel-editor-renderer.tooltip-open-options-pane', 'Open options pane')}
                icon={'arrow-to-right'}
                onClick={onToggleCollapse}
                variant="canvas"
                {...stylex.props(panelEditorRendererNextStyles.rotate180)}
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
    </div>
  );
}


