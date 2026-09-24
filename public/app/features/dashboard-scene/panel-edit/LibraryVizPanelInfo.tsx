import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { libraryVizPanelInfoStyles } from './LibraryVizPanelInfo.stylex';

import { Trans } from '@grafana/i18n';

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
    <div {...stylex.props(libraryVizPanelInfoStyles.info)}>
      <div {...stylex.props(libraryVizPanelInfoStyles.libraryPanelInfo)}>
        <Trans i18nKey="dashboard-scene.library-viz-panel-info.usage-count" count={meta.connectedDashboards}>
          Used on {'{{count}}'} dashboards
        </Trans>
      </div>
      <div {...stylex.props(libraryVizPanelInfoStyles.libraryPanelInfo)}>
        <Trans
          i18nKey="dashboard-scene.library-viz-panel-info.last-edited"
          values={{ timeAgo: dateTimeFormat(meta.updated, { format: 'L', timeZone: tz }) }}
          components={{
            person: (
              <>
                {meta.updatedBy.avatarUrl && (
                  <img
                    {...stylex.props(libraryVizPanelInfoStyles.userAvatar)}
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


