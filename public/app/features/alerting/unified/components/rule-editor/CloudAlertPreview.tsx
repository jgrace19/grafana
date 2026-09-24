// eslint-disable-next-line no-restricted-imports -- stylex: pending TagList migration
import { css } from '@emotion/css';
import * as stylex from '@stylexjs/stylex';

import { type DataFrame } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { Icon, TagList, Tooltip } from '@grafana/ui';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { labelsToTags } from '../../utils/labels';
import { AlertStateTag } from '../rules/AlertStateTag';

import { mapDataFrameToAlertPreview } from './preview';

interface CloudAlertPreviewProps {
  preview: DataFrame;
}

export function CloudAlertPreview({ preview }: CloudAlertPreviewProps) {
  const alertPreview = mapDataFrameToAlertPreview(preview);

  return (
    <table {...stylex.props(styles.table)}>
      <caption {...stylex.props(styles.caption)}>
        <div>
          <Trans i18nKey="alerting.cloud-alert-preview.alerts-preview">Alerts preview</Trans>
        </div>
        <span {...stylex.props(styles.captionDescription)}>
          <Trans i18nKey="alerting.cloud-alert-preview.running-query-preview">
            Preview based on the result of running the query for this moment.
          </Trans>
        </span>
      </caption>
      <thead>
        <tr>
          <th {...stylex.props(styles.cell, styles.stateHeader)}>
            <Trans i18nKey="alerting.cloud-alert-preview.state">State</Trans>
          </th>
          <th {...stylex.props(styles.cell, styles.cellAfterFirst, styles.labelsHeader)}>
            <Trans i18nKey="alerting.cloud-alert-preview.labels">Labels</Trans>
          </th>
          <th {...stylex.props(styles.cell, styles.cellAfterFirst, styles.infoHeader)}>
            <Trans i18nKey="alerting.cloud-alert-preview.info">Info</Trans>
          </th>
        </tr>
      </thead>
      <tbody>
        {alertPreview.instances.map(({ state, info, labels }, index) => {
          const instanceTags = labelsToTags(labels);

          return (
            <tr key={index} {...stylex.props(styles.row)}>
              <td {...stylex.props(styles.cell)}>{<AlertStateTag state={state} />}</td>
              <td {...stylex.props(styles.cell, styles.cellAfterFirst)}>
                <TagList tags={instanceTags} className={pendingEmotionStyles.tagList} />
              </td>
              <td {...stylex.props(styles.cell, styles.cellAfterFirst, styles.infoCell)}>
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

// stylex: pending TagList migration
const pendingEmotionStyles = {
  tagList: css({
    justifyContent: 'flex-start',
  }),
};

const styles = stylex.create({
  table: {
    width: '100%',
    marginTop: spacing['--gf-spacing-x2'],
    marginRight: 0,
    marginBottom: spacing['--gf-spacing-x2'],
    marginLeft: 0,
  },
  caption: {
    captionSide: 'top',
    color: colors['--gf-colors-text-primary'],
  },
  captionDescription: {
    fontSize: typography['--gf-typography-body-small-font-size'],
    color: colors['--gf-colors-text-secondary'],
  },
  cell: {
    padding: spacing['--gf-spacing-x1'],
  },
  cellAfterFirst: {
    paddingLeft: spacing['--gf-spacing-x3'],
  },
  stateHeader: {
    width: '80px',
  },
  labelsHeader: {
    width: 'auto',
  },
  infoHeader: {
    width: '40px',
  },
  infoCell: {
    textAlign: 'center',
  },
  row: {
    backgroundColor: {
      default: null,
      ':nth-child(2n + 1)': colors['--gf-colors-background-secondary'],
    },
  },
});
