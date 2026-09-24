import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { addLibraryPanelWidgetStyles } from './AddLibraryPanelWidget.stylex';
import * as React from 'react';
import tinycolor from 'tinycolor2';

import { Trans, t } from '@grafana/i18n';
import { type LibraryPanel } from '@grafana/schema';
import { IconButton, useStyles2 } from '@grafana/ui';

import {
  LibraryPanelsSearch,
  LibraryPanelsSearchVariant,
} from '../../../library-panels/components/LibraryPanelsSearch/LibraryPanelsSearch';
import { type DashboardModel } from '../../state/DashboardModel';
import { type PanelModel } from '../../state/PanelModel';

interface Props {
  panel: PanelModel;
  dashboard: DashboardModel;
}

export const AddLibraryPanelWidget = ({ panel, dashboard }: Props) => {
  const onCancelAddPanel = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    dashboard.removePanel(panel);
  };

  const onAddLibraryPanel = (panelInfo: LibraryPanel) => {
    const { gridPos } = panel;

    const newPanel = {
      ...panelInfo.model,
      gridPos,
      libraryPanel: panelInfo,
    };

    dashboard.addPanel(newPanel);
    dashboard.removePanel(panel);
  };

  return (
    <div {...stylex.props(addLibraryPanelWidgetStyles.wrapper)}>
      <div {...stylex.props(addLibraryPanelWidgetStyles.callToAction)}>
        <div {...mergeStylexClassName(stylex.props(addLibraryPanelWidgetStyles.headerRow, , 'grid-drag-handle'), undefined)}>
          <span>
            <Trans i18nKey="library-panel.add-widget.title">Add panel from panel library</Trans>
          </span>
          <div className="flex-grow-1" />
          <IconButton
            aria-label={t(
              'dashboard.add-library-panel-widget.aria-label-close-add-panel-widget',
              "Close 'Add Panel' widget"
            )}
            name="times"
            onClick={onCancelAddPanel}
            tooltip={t('dashboard.add-library-panel-widget.tooltip-close-widget', 'Close widget')}
          />
        </div>
        <LibraryPanelsSearch onClick={onAddLibraryPanel} variant={LibraryPanelsSearchVariant.Tight} showPanelFilter />
      </div>
    </div>
  );
};

