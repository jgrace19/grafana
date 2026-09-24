import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import { useMemo, useState } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { Button, Dropdown, Menu } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { DashboardInteractions } from '../../utils/interactions';
import { getDefaultVizPanel } from '../../utils/utils';
import { TabsLayoutManager } from '../layout-tabs/TabsLayoutManager';
import { type DashboardLayoutManager, isDashboardLayoutManager } from '../types/DashboardLayoutManager';

import { addNewRowTo, addNewTabTo } from './addNew';
import { layoutControlsStyles } from './styles';
import { useClipboardState } from './useClipboardState';

import './CanvasGridAddActions.css';
import './canvasControls.global.css';

export interface Props {
  layoutManager: DashboardLayoutManager;
}

export function CanvasGridAddActions({ layoutManager }: Props) {
  const { hasCopiedPanel } = useClipboardState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { disableGrouping, disableTabs } = useNestingRestrictions(layoutManager);

  return (
    <div
      {...mergeStylexProps(stylex.props(layoutControlsStyles.controls, styles.addAction), {
        className: clsx(
          'gf-canvas-add-actions',
          'dashboard-canvas-controls',
          isMenuOpen && 'gf-canvas-add-actions--menu-open'
        ),
      })}
      onPointerUp={(evt) => evt.stopPropagation()}
      onPointerDown={(evt) => evt.stopPropagation()}
    >
      <Button
        variant="secondary"
        icon="plus"
        size="sm"
        data-testid={selectors.components.CanvasGridAddActions.addPanel}
        onClick={() => {
          layoutManager.addPanel(getDefaultVizPanel());
          DashboardInteractions.trackAddPanelClick();
        }}
      >
        <Trans i18nKey="dashboard.canvas-actions.add-panel">Add panel</Trans>
      </Button>
      <Dropdown
        placement="bottom-start"
        onVisibleChange={setIsMenuOpen}
        overlay={
          <Menu>
            <Menu.Item
              icon="list-ul"
              label={t('dashboard.canvas-actions.group-into-row', 'Group into row')}
              testId={selectors.components.CanvasGridAddActions.addRow}
              onClick={() => {
                addNewRowTo(layoutManager);
                DashboardInteractions.trackGroupRowClick();
              }}
            ></Menu.Item>
            <Menu.Item
              icon="layers"
              testId={selectors.components.CanvasGridAddActions.addTab}
              label={t('dashboard.canvas-actions.group-into-tab', 'Group into tab')}
              disabled={disableTabs}
              className={disableTabs ? 'gf-canvas-add-actions-disabled-item' : undefined}
              description={
                disableTabs
                  ? t('dashboard.canvas-actions.disabled-nested-tabs', 'Tabs cannot be nested inside other tabs')
                  : undefined
              }
              onClick={() => {
                addNewTabTo(layoutManager);
                DashboardInteractions.trackGroupTabClick();
              }}
            ></Menu.Item>
          </Menu>
        }
      >
        <Button
          variant="secondary"
          icon="layers"
          size="sm"
          data-testid={selectors.components.CanvasGridAddActions.groupPanels}
          disabled={disableGrouping}
          tooltip={
            disableGrouping
              ? t('dashboard.canvas-actions.disabled-nested-grouping', 'Grouping is limited to 3 levels')
              : undefined
          }
        >
          <Trans i18nKey="dashboard.canvas-actions.group-panels">Group panels</Trans>
        </Button>
      </Dropdown>
      {hasCopiedPanel && layoutManager.pastePanel && (
        <Button
          data-testid={selectors.components.CanvasGridAddActions.pastePanel}
          variant="secondary"
          icon="clipboard-alt"
          size="sm"
          onClick={() => {
            layoutManager.pastePanel?.();
            DashboardInteractions.trackPastePanelClick();
          }}
        >
          <Trans i18nKey="dashboard.canvas-actions.paste-panel">Paste panel</Trans>
        </Button>
      )}
    </div>
  );
}

const MAX_NESTING_DEPTH = 3;

export function useNestingRestrictions(layoutManager: DashboardLayoutManager) {
  return useMemo(() => {
    if (config.featureToggles.unlimitedLayoutsNesting) {
      return { disableGrouping: false, disableTabs: false };
    }

    const layouts: string[] = [];
    let parent = layoutManager.parent;

    while (parent) {
      if (isDashboardLayoutManager(parent)) {
        layouts.push(parent.descriptor.id);
      }

      if (layouts.length === MAX_NESTING_DEPTH) {
        break;
      }

      parent = parent.parent;
    }

    const disableGrouping = layouts.length >= MAX_NESTING_DEPTH;
    const disableTabs = disableGrouping || layouts.includes(TabsLayoutManager.descriptor.id);

    return { disableGrouping, disableTabs };
  }, [layoutManager]);
}

// Opacity (hidden until hovered, or while the menu is open) is in canvasControls.global.css.
const styles = stylex.create({
  addAction: {
    position: 'absolute',
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: 0,
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: 0,
    height: spacing['--gf-spacing-x5'],
    bottom: 0,
    left: 0,
  },
});
