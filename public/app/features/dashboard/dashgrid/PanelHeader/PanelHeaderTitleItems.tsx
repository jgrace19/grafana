import clsx from 'clsx';

import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { panelHeaderTitleItemsStyles } from './PanelHeaderTitleItems.stylex';
import {
  AlertState,
  type DataLink,
  type GrafanaTheme2,
  type LinkModel,
  type PanelData,
  type PanelModel,
} from '@grafana/data';
import { Icon, PanelChrome, TimePickerTooltip, Tooltip, useStyles2 } from '@grafana/ui';

import { PanelLinks } from '../PanelLinks';

import { PanelHeaderNotices } from './PanelHeaderNotices';

export interface AngularNotice {
  show: boolean;
  isAngularPanel: boolean;
  isAngularDatasource: boolean;
}

export interface Props {
  alertState?: string;
  data: PanelData;
  panelId: number;
  onShowPanelLinks?: () => Array<LinkModel<PanelModel>>;
  panelLinks?: DataLink[];
}

export function PanelHeaderTitleItems(props: Props) {
  const { alertState, data, panelId, onShowPanelLinks, panelLinks } = props;

  // panel health
  const alertStateItem = (
    <Tooltip content={alertState ?? 'unknown'}>
      <PanelChrome.TitleItem
        {...mergeStylexClassName(stylex.props(panelHeaderTitleItemsStyles.ok, {
          []: alertState === AlertState.OK,
          [mergeStylexClassName(stylex.props(panelHeaderTitleItemsStyles.pending), undefined).className]: alertState === AlertState.Pending || alertState === AlertState.Recovering,
          [mergeStylexClassName(stylex.props(panelHeaderTitleItemsStyles.alerting), undefined).className]: alertState === AlertState.Alerting,
        }), undefined)}
      >
        <Icon name={alertState === 'alerting' ? 'heart-break' : 'heart'} size="md" />
      </PanelChrome.TitleItem>
    </Tooltip>
  );

  const timeshift = (
    <>
      {data.request && data.request.timeInfo && (
        <Tooltip content={<TimePickerTooltip timeRange={data.request?.range} timeZone={data.request?.timezone} />}>
          <PanelChrome.TitleItem {...stylex.props(panelHeaderTitleItemsStyles.timeshift)}>
            <Icon name="clock-nine" size="md" /> {data.request?.timeInfo}
          </PanelChrome.TitleItem>
        </Tooltip>
      )}
    </>
  );

  return (
    <>
      {panelLinks && panelLinks.length > 0 && onShowPanelLinks && (
        <PanelLinks onShowPanelLinks={onShowPanelLinks} panelLinks={panelLinks} />
      )}

      {<PanelHeaderNotices panelId={panelId} frames={data.series} />}
      {timeshift}
      {alertState && alertStateItem}
    </>
  );
}

;
