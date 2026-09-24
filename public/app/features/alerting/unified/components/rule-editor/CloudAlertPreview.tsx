import * as stylex from '@stylexjs/stylex';

import { type DataFrame, type GrafanaTheme2 } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { Icon, TagList, Tooltip } from '@grafana/ui';

import { labelsToTags } from '../../utils/labels';
import { AlertStateTag } from '../rules/AlertStateTag';

import { mapDataFrameToAlertPreview } from './preview';

interface CloudAlertPreviewProps {
  preview: DataFrame;
}

export function CloudAlertPreview({ preview }: CloudAlertPreviewProps) {
  const alertPreview = mapDataFrameToAlertPreview(preview);

  return (
    <table {...stylex.props(cloudAlertPreviewStyles.table)}>
      <caption>
        <div>
          <Trans i18nKey="alerting.cloud-alert-preview.alerts-preview">Alerts preview</Trans>
        </div>
        <span>
          <Trans i18nKey="alerting.cloud-alert-preview.running-query-preview">
            Preview based on the result of running the query for this moment.
          </Trans>
        </span>
      </caption>
      <thead>
        <tr>
          <th>
            <Trans i18nKey="alerting.cloud-alert-preview.state">State</Trans>
          </th>
          <th>
            <Trans i18nKey="alerting.cloud-alert-preview.labels">Labels</Trans>
          </th>
          <th>
            <Trans i18nKey="alerting.cloud-alert-preview.info">Info</Trans>
          </th>
        </tr>
      </thead>
      <tbody>
        {alertPreview.instances.map(({ state, info, labels }, index) => {
          const instanceTags = labelsToTags(labels);

          return (
            <tr key={index}>
              <td>{<AlertStateTag state={state} />}</td>
              <td>
                <TagList tags={instanceTags} {...stylex.props(cloudAlertPreviewStyles.tagList)} />
              </td>
              <td>
                {info && (
                  <Tooltip content={info}>
                    <Icon name="info-circle" />
                  </Tooltip>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

