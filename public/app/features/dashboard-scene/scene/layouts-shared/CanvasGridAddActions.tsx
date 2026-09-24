import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { canvasGridAddActionsStyles } from './CanvasGridAddActions.stylex';
import { useMemo, useState } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { Button, Dropdown, Menu } from '@grafana/ui';

import { DashboardInteractions } from '../../utils/interactions';
import { getDefaultVizPanel } from '../../utils/utils';
import { TabsLayoutManager } from '../layout-tabs/TabsLayoutManager';
import { type DashboardLayoutManager, isDashboardLayoutManager } from '../types/DashboardLayoutManager';

import { addNewRowTo, addNewTabTo } from './addNew';
import { layoutControlsStyles } from './styles';
import { useClipboardState } from './useClipboardState';

export interface Props {
  layoutManager: DashboardLayoutManager;
}

export function CanvasGridAddActions({ layoutManager }: Props) {
  const { hasCopiedPanel } = useClipboardState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { disableGrouping, disableTabs } = useNestingRestrictions(layoutManager);

  return (
    <div
      {...mergeStylexClassName(
        stylex.props(
          layoutControlsStyles.controls,
          canvasGridAddActionsStyles.addAction,
          isMenuOpen && canvasGridAddActionsStyles.menuOpen
        ),
        'dashboard-canvas-controls'
      )}
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
              className={
                disableTabs
                  ? mergeStylexClassName(stylex.props(canvasGridAddActionsStyles.disabledMenuItem), undefined).className
                  : undefined
              }
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
