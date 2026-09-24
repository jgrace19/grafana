import * as stylex from '@stylexjs/stylex';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { type SceneComponentProps } from '@grafana/scenes';
import { Spinner, ToolbarButton } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { NavToolbarActions } from '../../scene/NavToolbarActions';
import { type PanelEditor } from '../PanelEditor';

import { VizAndDataPaneNext } from './VizAndDataPaneNext';
import { usePanelEditorShell } from './hooks';

export function PanelEditorRendererNext({ model }: SceneComponentProps<PanelEditor>) {
  const { dashboard, optionsPane, splitter } = usePanelEditorShell(model);
  const { containerProps, primaryProps, secondaryProps, splitterProps, splitterState, onToggleCollapse } = splitter;

  return (
    <div {...stylex.props(styles.container)}>
      <NavToolbarActions dashboard={dashboard} />
      <div {...containerProps} data-testid={selectors.components.PanelEditor.General.content}>
        <div {...primaryProps} className={mergeClassNames(primaryProps.className, styles.body)}>
          <VizAndDataPaneNext model={model} />
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
    </div>
  );
}

/** Adds a StyleX style to a class name from useSnappingSplitter (Emotion today). */
function mergeClassNames(className: string | undefined, style: stylex.StyleXStyles): string {
  return mergeStylexProps(stylex.props(style), { className }).className ?? '';
}

const styles = stylex.create({
  container: {
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
  rotate180: {
    rotate: '180deg',
  },
});
