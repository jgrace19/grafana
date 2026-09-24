import * as stylex from '@stylexjs/stylex';

import { dateTimeFormat } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { type LibraryPanelBehavior } from '../scene/LibraryPanelBehavior';

interface Props {
  libraryPanel: LibraryPanelBehavior;
}

export const LibraryVizPanelInfo = ({ libraryPanel }: Props) => {
  const libraryPanelState = libraryPanel.useState();
  const tz = libraryPanelState.$timeRange?.getTimeZone();
  const meta = libraryPanelState._loadedPanel?.meta;
  if (!meta) {
    return null;
  }

  return (
    <div {...stylex.props(styles.info)}>
      <div {...stylex.props(styles.libraryPanelInfo)}>
        <Trans i18nKey="dashboard-scene.library-viz-panel-info.usage-count" count={meta.connectedDashboards}>
          Used on {'{{count}}'} dashboards
        </Trans>
      </div>
      <div {...stylex.props(styles.libraryPanelInfo)}>
        <Trans
          i18nKey="dashboard-scene.library-viz-panel-info.last-edited"
          values={{ timeAgo: dateTimeFormat(meta.updated, { format: 'L', timeZone: tz }) }}
          components={{
            person: (
              <>
                {meta.updatedBy.avatarUrl && (
                  <img
                    {...stylex.props(styles.userAvatar)}
                    src={meta.updatedBy.avatarUrl}
                    alt={`Avatar for ${meta.updatedBy.name}`}
                  />
                )}
                {meta.updatedBy.name}
              </>
            ),
          }}
        >
          {'{{timeAgo}}'} by
          {'<person />'}
        </Trans>
      </div>
    </div>
  );
};

const styles = stylex.create({
  info: {
    lineHeight: 1,
  },
  libraryPanelInfo: {
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
  userAvatar: {
    borderRadius: shape['--gf-shape-radius-circle'],
    boxSizing: 'content-box',
    width: '22px',
    height: '22px',
    paddingLeft: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
  },
});
