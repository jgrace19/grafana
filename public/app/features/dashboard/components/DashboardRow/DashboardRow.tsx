import * as stylex from '@stylexjs/stylex';
import { indexOf } from 'lodash';
import { Component } from 'react';
import { type Unsubscribable } from 'rxjs';

import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { getTemplateSrv, RefreshEvent } from '@grafana/runtime';
import { Icon, TextLink, type Themeable2, useTheme2 } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { motion } from '@grafana/ui/stylex/constants.stylex';
import { colors, components, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
import { appEvents } from 'app/core/app_events';
import { DashboardInteractions } from 'app/features/dashboard-scene/utils/interactions';
import { SHARED_DASHBOARD_QUERY } from 'app/plugins/datasource/dashboard/constants';
import grabDarkSvg from 'img/grab_dark.svg';
import grabLightSvg from 'img/grab_light.svg';

import { ShowConfirmModalEvent } from '../../../../types/events';
import { type DashboardModel } from '../../state/DashboardModel';
import { type PanelModel } from '../../state/PanelModel';
import { RowOptionsButton } from '../RowOptions/RowOptionsButton';

import { dashboardRowMarker } from './markers.stylex';

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
    const dragHandle = this.props.theme.name === 'dark' ? grabDarkSvg : grabLightSvg;

    return (
      <div
        {...stylex.props(styles.dashboardRow, collapsed && styles.dashboardRowCollapsed, dashboardRowMarker)}
        data-testid="dashboard-row-container"
      >
        <button
          aria-expanded={!collapsed}
          {...mergeStylexProps(stylex.props(styles.title), { className: 'pointer' })}
          type="button"
          data-testid={selectors.components.DashboardRow.title(title)}
          onClick={this.onToggle}
        >
          <Icon name={collapsed ? 'angle-right' : 'angle-down'} />
          {title}
          <span {...stylex.props(styles.count, collapsed && styles.countCollapsed)}>
            ({count} {panels})
          </span>
        </button>
        {canEdit && (
          <div {...stylex.props(styles.actions)}>
            <RowOptionsButton
              title={this.props.panel.title}
              repeat={this.props.panel.repeat}
              onUpdate={this.onUpdate}
              warning={this.getWarning()}
              xstyle={styles.actionButton}
            />
            <button
              type="button"
              {...mergeStylexProps(stylex.props(styles.actionButton), { className: 'pointer' })}
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
          <div {...stylex.props(collapsed && styles.toggleTargetCollapsed)} onClick={this.onToggle}>
            &nbsp;
          </div>
        )}
        {canEdit && (
          <div
            data-testid="dashboard-row-drag"
            {...mergeStylexProps(
              stylex.props(
                styles.dragHandle,
                styles.dragHandleImage(`url("${dragHandle}")`),
                collapsed && styles.dragHandleCollapsed
              ),
              { className: 'grid-drag-handle' }
            )}
          />
        )}
      </div>
    );
  }
}

export const DashboardRow = (props: Omit<DashboardRowProps, 'theme'>) => {
  const theme = useTheme2();
  return <UnthemedDashboardRow {...props} theme={theme} />;
};

const styles = stylex.create({
  dashboardRow: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },
  dashboardRowCollapsed: {
    backgroundColor: components['--gf-components-panel-background'],
  },
  toggleTargetCollapsed: {
    flex: '1',
    cursor: 'pointer',
    marginRight: '15px',
  },
  title: {
    flexGrow: 0,
    fontSize: typography['--gf-typography-h5-font-size'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    color: colors['--gf-colors-text-primary'],
    backgroundColor: 'transparent',
    borderStyle: 'none',
  },
  actions: {
    color: colors['--gf-colors-text-secondary'],
    opacity: {
      default: 0,
      [stylex.when.ancestor(':hover', dashboardRowMarker)]: 1,
      [stylex.when.ancestor(':focus-within', dashboardRowMarker)]: 1,
    },
    transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'opacity' },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: '200ms' },
    transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: 'ease-in' },
    transitionDelay: { default: null, [motion.noPreferenceOrReduce]: '200ms' },
  },
  actionButton: {
    color: { default: colors['--gf-colors-text-secondary'], ':hover': colors['--gf-colors-text-max-contrast'] },
    paddingLeft: spacing['--gf-spacing-x2'],
    backgroundColor: 'transparent',
    borderStyle: 'none',
  },
  count: {
    paddingLeft: spacing['--gf-spacing-x2'],
    color: colors['--gf-colors-text-secondary'],
    fontStyle: 'italic',
    fontSize: typography['--gf-typography-size-sm'],
    fontWeight: 'normal',
    display: 'none',
  },
  countCollapsed: {
    display: 'inline-block',
  },
  dragHandle: {
    cursor: 'move',
    width: '16px',
    height: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50% 50%',
    backgroundSize: '8px',
    visibility: 'hidden',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  dragHandleImage: (backgroundImage: string) => ({
    backgroundImage,
  }),
  dragHandleCollapsed: {
    visibility: 'visible',
    opacity: 1,
  },
});
