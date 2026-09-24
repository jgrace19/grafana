import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { libraryPanelCardStyles } from './LibraryPanelCard.stylex';
import { type ReactElement, useState, type JSX } from 'react';
import Skeleton from 'react-loading-skeleton';

import { Trans } from '@grafana/i18n';
import { usePanelPluginMeta } from '@grafana/runtime/internal';
import { Icon, Link } from '@grafana/ui';
import { type SkeletonComponent, attachSkeleton } from '@grafana/ui/unstable';
import { getPanelPluginNotFound } from 'app/features/panel/components/PanelPluginError';
import { PanelTypeCard } from 'app/features/panel/components/VizTypePicker/PanelTypeCard';

import { type LibraryElementDTO } from '../../types';
import { DeleteLibraryPanelModal } from '../DeleteLibraryPanelModal/DeleteLibraryPanelModal';

export interface LibraryPanelCardProps {
  libraryPanel: LibraryElementDTO;
  onClick: (panel: LibraryElementDTO) => void;
  onDelete?: (panel: LibraryElementDTO) => void;
  showSecondaryActions?: boolean;
}

type Props = LibraryPanelCardProps & { children?: JSX.Element | JSX.Element[] };

const LibraryPanelCardComponent = ({ libraryPanel, onClick, onDelete, showSecondaryActions }: Props) => {
  const [showDeletionModal, setShowDeletionModal] = useState(false);

  const onDeletePanel = () => {
    onDelete?.(libraryPanel);
    setShowDeletionModal(false);
  };

  const { value: panelPluginMeta } = usePanelPluginMeta(libraryPanel.model.type);
  const panelPlugin = panelPluginMeta ?? getPanelPluginNotFound(libraryPanel.model.type).meta;

  return (
    <>
      <PanelTypeCard
        isCurrent={false}
        title={libraryPanel.name}
        description={libraryPanel.description}
        plugin={panelPlugin}
        onSelect={() => onClick?.(libraryPanel)}
        onDelete={showSecondaryActions ? () => setShowDeletionModal(true) : undefined}
      >
        <FolderLink libraryPanel={libraryPanel} />
      </PanelTypeCard>
      {showDeletionModal && (
        <DeleteLibraryPanelModal
          libraryPanel={libraryPanel}
          onConfirm={onDeletePanel}
          onDismiss={() => setShowDeletionModal(false)}
        />
      )}
    </>
  );
};

const LibraryPanelCardSkeleton: SkeletonComponent<Pick<Props, 'showSecondaryActions'>> = ({
  showSecondaryActions,
  rootProps,
}) => {

  return (
    <PanelTypeCard.Skeleton hasDelete={showSecondaryActions} {...rootProps}>
      <Skeleton containerClassName={mergeStylexClassName(stylex.props(libraryPanelCardStyles.metaContainer), undefined).className} width={80} />
    </PanelTypeCard.Skeleton>
  );
};

export const LibraryPanelCard = attachSkeleton(LibraryPanelCardComponent, LibraryPanelCardSkeleton);

interface FolderLinkProps {
  libraryPanel: LibraryElementDTO;
}

function FolderLink({ libraryPanel }: FolderLinkProps): ReactElement | null {

  if (!libraryPanel.meta?.folderUid && !libraryPanel.meta?.folderName) {
    return null;
  }

  // LibraryPanels API returns folder-less library panels with an empty string folder UID
  if (!libraryPanel.meta.folderUid) {
    return (
      <span {...stylex.props(libraryPanelCardStyles.metaContainer)}>
        <Icon name={'folder'} size="sm" />
        <span>
          <Trans i18nKey="library-panels.folder-link.dashboards">Dashboards</Trans>
        </span>
      </span>
    );
  }

  return (
    <span {...stylex.props(libraryPanelCardStyles.metaContainer)}>
      <Link href={`/dashboards/f/${libraryPanel.meta.folderUid}`}>
        <Icon name={'folder-upload'} size="sm" />
        <span>{libraryPanel.meta.folderName}</span>
      </Link>
    </span>
  );
}

