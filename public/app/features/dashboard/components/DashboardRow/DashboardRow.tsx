import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { dashboardRowStyles } from './DashboardRow.stylex';
import { indexOf } from 'lodash';
import { Component } from 'react';
import { type Unsubscribable } from 'rxjs';

import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { getTemplateSrv, RefreshEvent } from '@grafana/runtime';
import { Icon, TextLink, type Themeable2, withTheme2 } from '@grafana/ui';
import { appEvents } from 'app/core/app_events';
import { DashboardInteractions } from 'app/features/dashboard-scene/utils/interactions';
import { SHARED_DASHBOARD_QUERY } from 'app/plugins/datasource/dashboard/constants';
import grabDarkSvg from 'img/grab_dark.svg';
import grabLightSvg from 'img/grab_light.svg';

import { ShowConfirmModalEvent } from '../../../../types/events';
import { type DashboardModel } from '../../state/DashboardModel';
import { type PanelModel } from '../../state/PanelModel';
import { RowOptionsButton } from '../RowOptions/RowOptionsButton';

export interface DashboardRowProps extends Themeable2 {
  panel: PanelModel;
  dashboard: DashboardModel;
}

export class UnthemedDashboardRow extends Component<DashboardRowProps> {
  sub?: Unsubscribable;

  componentDidMount() {
    this.sub = this.props.dashboard.events.subscribe(RefreshEvent, this.onVariableUpdated);
  }

  componentWillUnmount() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  onVariableUpdated = () => {
    this.forceUpdate();
  };

  onToggle = () => {
    this.props.dashboard.toggleRow(this.props.panel);
  };

  getWarning = () => {
    const panels = !!this.props.panel.panels?.length
      ? this.props.panel.panels
      : this.props.dashboard.getRowPanels(indexOf(this.props.dashboard.panels, this.props.panel));
    const isAnyPanelUsingDashboardDS = panels.some((p) => p.datasource?.uid === SHARED_DASHBOARD_QUERY);
    if (isAnyPanelUsingDashboardDS) {
      return (
        <div>
          <p>
            <Trans i18nKey="dashboard.untheme-dashboard-row.dashboard-datasource">
              Panels in this row use the {{ SHARED_DASHBOARD_QUERY }} data source. These panels will reference the panel
              in the original row, not the ones in the repeated rows.
            </Trans>
          </p>
          <TextLink
            external
            href={
              'https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/create-dashboard/#configure-repeating-rows'
            }
          >
            <Trans i18nKey="dashboard.unthemed-dashboard-row.learn-more">Learn more</Trans>
          </TextLink>
        </div>
      );
    }

    return undefined;
  };

  onUpdate = (title: string, repeat?: string | null) => {
    this.props.panel.setProperty('title', title);
    this.props.panel.setProperty('repeat', repeat ?? undefined);
    this.props.panel.render();
    this.props.dashboard.processRepeats();
    this.forceUpdate();
  };

  onDelete = () => {
    appEvents.publish(
      new ShowConfirmModalEvent({
        title: t('dashboard.unthemed-dashboard-row.title.delete-row', 'Delete row'),
        text: 'Are you sure you want to remove this row and all its panels?',
        altActionText: 'Delete row only',
        onConfirm: () => {
          this.props.dashboard.removeRow(this.props.panel, true);
        },
        onAltAction: () => {
          this.props.dashboard.removeRow(this.props.panel, false);
        },
      })
    );
  };

  render() {
    const title = getTemplateSrv().replace(this.props.panel.title, this.props.panel.scopedVars, 'text');
    const count = this.props.panel.panels ? this.props.panel.panels.length : 0;
    const panels = count === 1 ? 'panel' : 'panels';
    const canEdit = this.props.dashboard.meta.canEdit === true;
    const collapsed = this.props.panel.collapsed;

    return (
      <div
        {...mergeStylexClassName(stylex.props(dashboardRowStyles.dashboardRow, , {
          [mergeStylexClassName(stylex.props(dashboardRowStyles.dashboardRowCollapsed), undefined).className]: collapsed,
        }), undefined)}
        data-testid="dashboard-row-container"
      >
        <button
          aria-expanded={!collapsed}
          {...mergeStylexClassName(stylex.props(dashboardRowStyles.title, , 'pointer'), undefined)}
          type="button"
          data-testid={selectors.components.DashboardRow.title(title)}
          onClick={this.onToggle}
        >
          <Icon name={collapsed ? 'angle-right' : 'angle-down'} />
          {title}
          <span
            {...mergeStylexClassName(stylex.props(dashboardRowStyles.count, , {
              [mergeStylexClassName(stylex.props(dashboardRowStyles.countCollapsed), undefined).className]: collapsed,
            }), undefined)}
          >
            ({count} {panels})
          </span>
        </button>
        {canEdit && (
          <div className={styles.actions}>
            <RowOptionsButton
              title={this.props.panel.title}
              repeat={this.props.panel.repeat}
              onUpdate={this.onUpdate}
              warning={this.getWarning()}
            />
            <button
              type="button"
              className="pointer"
              onClick={() => {
                DashboardInteractions.trackDeleteDashboardElement('row');
                this.onDelete();
              }}
              aria-label={t('dashboard.unthemed-dashboard-row.aria-label-delete-row', 'Delete row')}
            >
              <Icon name="trash-alt" />
            </button>
          </div>
        )}
        {collapsed === true && (
          /* disabling the a11y rules here as the button handles keyboard interactions */
          /* this is just to provide a better experience for mouse users */
          /* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
          <div
            {...mergeStylexClassName(stylex.props(dashboardRowStyles.toggleTargetCollapsed, {
              []: collapsed,
            }), undefined)}
            onClick={this.onToggle}
          >
            &nbsp;
          </div>
        )}
        {canEdit && (
          <div
            data-testid="dashboard-row-drag"
            {...mergeStylexClassName(stylex.props(dashboardRowStyles.dragHandle, , 'grid-drag-handle', {
              [mergeStylexClassName(stylex.props(dashboardRowStyles.dragHandleCollapsed), undefined).className]: collapsed,
            }), undefined)}
          />
        )}
      </div>
    );
  }
}

export const DashboardRow = withTheme2(UnthemedDashboardRow);

