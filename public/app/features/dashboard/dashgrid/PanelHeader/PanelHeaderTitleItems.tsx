import * as stylex from '@stylexjs/stylex';

import { AlertState, type DataLink, type LinkModel, type PanelData, type PanelModel } from '@grafana/data';
import { Icon, PanelChrome, TimePickerTooltip, Tooltip, useTheme2 } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

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
  const theme = useTheme2();
  const stateColor = (color: string) => styles.color(color, theme.colors.emphasize(color, 0.03));
  const alertColor =
    alertState === AlertState.OK
      ? theme.colors.success.text
      : alertState === AlertState.Pending || alertState === AlertState.Recovering
        ? theme.colors.warning.text
        : alertState === AlertState.Alerting
          ? theme.colors.error.text
          : undefined;

  // panel health
  const alertStateItem = (
    <Tooltip content={alertState ?? 'unknown'}>
      <PanelChrome.TitleItem xstyle={alertColor !== undefined && stateColor(alertColor)}>
        <Icon name={alertState === 'alerting' ? 'heart-break' : 'heart'} size="md" />
      </PanelChrome.TitleItem>
    </Tooltip>
  );

  const timeshift = (
    <>
      {data.request && data.request.timeInfo && (
        <Tooltip content={<TimePickerTooltip timeRange={data.request?.range} timeZone={data.request?.timezone} />}>
          <PanelChrome.TitleItem xstyle={[styles.timeshift, stateColor(theme.colors.text.link)]}>
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

// The :hover colours replace TitleItem's own.
const styles = stylex.create({
  color: (color: string, hoverColor: string) => ({
    color: { default: color, ':hover': hoverColor },
  }),
  timeshift: {
    gap: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
    whiteSpace: 'nowrap',
  },
});
