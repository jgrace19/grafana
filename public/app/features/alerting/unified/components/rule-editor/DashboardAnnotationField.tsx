import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';
import { Icon, Text } from '@grafana/ui';

import { makeDashboardLink, makePanelLink } from '../../utils/misc';

import { type PanelDTO, getDashboardTitle, getDashboardUid } from './DashboardPicker';
import { type DashboardResponse } from './useDashboardQuery';

const DashboardAnnotationField = ({
  dashboard,
  panel,
  dashboardUid,
  panelId,
  onEditClick,
  onDeleteClick,
}: {
  dashboard?: DashboardResponse;
  panel?: PanelDTO;
  dashboardUid: string; //fallback
  panelId: string; //fallback
  onEditClick: () => void;
  onDeleteClick: () => void;
}) => {

  const dashboardLink = makeDashboardLink(getDashboardUid(dashboard) || dashboardUid);
  const panelLink = makePanelLink(getDashboardUid(dashboard) || dashboardUid, panel?.id?.toString() || panelId);
  return (
    <div {...stylex.props(dashboardAnnotationFieldStyles.container)}>
      {dashboard && (
        <a
          href={dashboardLink}
          {...stylex.props(dashboardAnnotationFieldStyles.link)}
          target="_blank"
          rel="noreferrer"
          data-testid="dashboard-annotation"
        >
          {getDashboardTitle(dashboard)} <Icon name={'external-link-alt'} />
        </a>
      )}

      {!dashboard && (
        <Text color="secondary">
          <Trans i18nKey="alerting.annotations.dashboard-annotation-field.dashboard" values={{ dashboardUid }}>
            Dashboard {{ dashboardUid }}
          </Trans>
        </Text>
      )}

      {panel && (
        <a href={panelLink} {...stylex.props(dashboardAnnotationFieldStyles.link)} target="_blank" rel="noreferrer" data-testid="panel-annotation">
          {panel.title || '<No title>'} <Icon name={'external-link-alt'} />
        </a>
      )}

      {!panel && (
        <>
          <span> - </span>
          <Text color="secondary">
            <Trans i18nKey="alerting.annotations.dashboard-annotation-field.panel" values={{ panelId }}>
              Panel {{ panelId }}
            </Trans>
          </Text>
        </>
      )}

      {(dashboard || panel) && (
        <>
          <Icon name={'pen'} onClick={onEditClick} {...stylex.props(dashboardAnnotationFieldStyles.icon)} />
          <Icon name={'trash-alt'} onClick={onDeleteClick} {...stylex.props(dashboardAnnotationFieldStyles.icon)} />
        </>
      )}
    </div>
  );
};


export default DashboardAnnotationField;
