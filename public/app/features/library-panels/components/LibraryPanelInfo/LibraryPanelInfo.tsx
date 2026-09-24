import * as stylex from '@stylexjs/stylex';

import { type DateTimeInput } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { type PanelModelWithLibraryPanel } from '../../types';

interface Props {
  panel: PanelModelWithLibraryPanel;
  formatDate?: (dateString: DateTimeInput, format?: string) => string;
}

export const LibraryPanelInformation = ({ panel, formatDate }: Props) => {
  const meta = panel.libraryPanel?.meta;
  if (!meta) {
    return null;
  }

  return (
    <div {...stylex.props(styles.info)}>
      <div {...stylex.props(styles.libraryPanelInfo)}>
        <Trans i18nKey="library-panels.library-panel-info.usage-count" count={meta.connectedDashboards}>
          Used on {'{{count}}'} dashboards
        </Trans>
      </div>
      <div {...stylex.props(styles.libraryPanelInfo)}>
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
          Last edited on {'{{timeAgo}}'} by
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
