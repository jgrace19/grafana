
import { type DateTimeInput, type GrafanaTheme2 } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { } from '@grafana/ui';

import { type PanelModelWithLibraryPanel } from '../../types';

interface Props {
  panel: PanelModelWithLibraryPanel;
  formatDate?: (dateString: DateTimeInput, format?: string) => string;
}

export const LibraryPanelInformation = ({ panel, formatDate }: Props) => {
  const styles = (getStyles);

  const meta = panel.libraryPanel?.meta;
  if (!meta) {
    return null;
  }

  return (
    <div {...stylex.props(libraryPanelInfoStyles.info)}>
      <div {...stylex.props(libraryPanelInfoStyles.libraryPanelInfo)}>
        <Trans i18nKey="library-panels.library-panel-info.usage-count" count={meta.connectedDashboards}>
          Used on {'{{count}}'} dashboards
        </Trans>
      </div>
      <div {...stylex.props(libraryPanelInfoStyles.libraryPanelInfo)}>
        <Trans
          i18nKey="library-panels.library-panel-info.last-edited"
          values={{ timeAgo: formatDate?.(meta.updated, 'L') ?? meta.updated }}
          components={{
            person: (
              <>
                {meta.updatedBy.avatarUrl && (
                  <img
                    width="22"
                    height="22"
                    {...stylex.props(libraryPanelInfoStyles.userAvatar)}
                    src={meta.updatedBy.avatarUrl}
                    alt={`Avatar for ${meta.updatedBy.name}`}
                  />
                )}
                {meta.updatedBy.name}
              </>
            ),
          }}
        >
          Last edited on {'{{timeAgo}}'} by
          {'<person />'}
        </Trans>
      </div>
    </div>
  );
};

;
