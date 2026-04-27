import { css, cx } from '@emotion/css';

import {
  AlertState,
  type DataLink,
  type GrafanaTheme2,
  type LinkModel,
  type PanelData,
  type PanelModel,
} from '@grafana/data';
import { Icon, PanelChrome, TimePickerTooltip, Tooltip, useStyles2 } from '@grafana/ui';

import { selectCommentCountForPanel } from 'app/features/dashboard/api/commentsApi';
import { useSelector } from 'app/types/store';

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
  commentsEnabled?: boolean;
  dashboardUid?: string;
  onOpenComments?: () => void;
}

export function PanelHeaderTitleItems(props: Props) {
  const { alertState, data, panelId, onShowPanelLinks, panelLinks, commentsEnabled, dashboardUid, onOpenComments } =
    props;
  const styles = useStyles2(getStyles);

  const commentCount = useSelector((state) =>
    commentsEnabled && dashboardUid ? selectCommentCountForPanel(state, dashboardUid, panelId) : 0
  );

  // panel health
  const alertStateItem = (
    <Tooltip content={alertState ?? 'unknown'}>
      <PanelChrome.TitleItem
        className={cx({
          [styles.ok]: alertState === AlertState.OK,
          [styles.pending]: alertState === AlertState.Pending || alertState === AlertState.Recovering,
          [styles.alerting]: alertState === AlertState.Alerting,
        })}
      >
        <Icon name={alertState === 'alerting' ? 'heart-break' : 'heart'} size="md" />
      </PanelChrome.TitleItem>
    </Tooltip>
  );

  const commentsItem =
    commentsEnabled && onOpenComments ? (
      <Tooltip content="Panel comments">
        <PanelChrome.TitleItem className={styles.comments} onClick={onOpenComments}>
          <Icon name="comment-alt" size="md" />
          {commentCount > 0 && <span className={styles.commentCount}>{commentCount}</span>}
        </PanelChrome.TitleItem>
      </Tooltip>
    ) : null;

  const timeshift = (
    <>
      {data.request && data.request.timeInfo && (
        <Tooltip content={<TimePickerTooltip timeRange={data.request?.range} timeZone={data.request?.timezone} />}>
          <PanelChrome.TitleItem className={styles.timeshift}>
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
      {commentsItem}
      {timeshift}
      {alertState && alertStateItem}
    </>
  );
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    ok: css({
      color: theme.colors.success.text,
      '&:hover': {
        color: theme.colors.emphasize(theme.colors.success.text, 0.03),
      },
    }),
    pending: css({
      color: theme.colors.warning.text,
      '&:hover': {
        color: theme.colors.emphasize(theme.colors.warning.text, 0.03),
      },
    }),
    alerting: css({
      color: theme.colors.error.text,
      '&:hover': {
        color: theme.colors.emphasize(theme.colors.error.text, 0.03),
      },
    }),
    timeshift: css({
      color: theme.colors.text.link,
      gap: theme.spacing(0.5),
      whiteSpace: 'nowrap',

      '&:hover': {
        color: theme.colors.emphasize(theme.colors.text.link, 0.03),
      },
    }),
    comments: css({
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme.spacing(0.5),
      cursor: 'pointer',
      color: theme.colors.text.secondary,
      '&:hover': {
        color: theme.colors.text.primary,
      },
    }),
    commentCount: css({
      fontSize: theme.typography.bodySmall.fontSize,
      fontWeight: theme.typography.fontWeightMedium,
    }),
    angularNotice: css({
      color: theme.colors.warning.text,
    }),
  };
};
