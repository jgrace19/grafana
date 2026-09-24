import * as stylex from '@stylexjs/stylex';
import { useState, useEffect, useMemo } from 'react';

import { t } from '@grafana/i18n';
import { getDataSourceSrv } from '@grafana/runtime';
import { Modal } from '@grafana/ui';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import { type DashboardInput, type DataSourceInput, type DashboardJson } from 'app/features/manage-dashboards/types';
import { type PluginDashboard } from 'app/types/plugins';

import { CommunityDashboardMappingForm } from './CommunityDashboardMappingForm';
import { SuggestedDashboardsList } from './SuggestedDashboardsList/SuggestedDashboardsList';
import { type ContentKind } from './constants';
import { type GnetDashboard } from './types';
import { type InputMapping } from './utils/autoMapDatasources';

interface SuggestedDashboardsModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  datasourceUid?: string;
  initialMappingContext?: MappingContext | null;
  provisionedDashboards: PluginDashboard[];
  communityDashboards: GnetDashboard[];
  communityTotalPages: number;
  lastPageItemCount?: number;
  onLastPageItemCount?: (count: number) => void;
  isDashboardsLoading: boolean;
}

type ModalView = 'list' | 'mapping';

export interface MappingContext {
  dashboardName: string;
  dashboardJson: DashboardJson;
  unmappedDsInputs: DataSourceInput[];
  constantInputs: DashboardInput[];
  existingMappings: InputMapping[];
  onInterpolateAndNavigate: (mappings: InputMapping[]) => void;
  // Tracking context for analytics
  contentKind: ContentKind;
}

export const SuggestedDashboardsModal = ({
  isOpen,
  onDismiss,
  datasourceUid,
  initialMappingContext,
  provisionedDashboards,
  communityDashboards,
  communityTotalPages,
  lastPageItemCount,
  onLastPageItemCount,
  isDashboardsLoading,
}: SuggestedDashboardsModalProps) => {
  const [activeView, setActiveView] = useState<ModalView>('list');
  const [mappingContext, setMappingContext] = useState<MappingContext | null>(initialMappingContext || null);
  // Get datasource info for modal title
  const datasourceInfo = useMemo(() => {
    if (!datasourceUid) {
      return { type: '' };
    }
    const ds = getDataSourceSrv().getInstanceSettings(datasourceUid);
    return {
      type: ds?.type || '',
    };
  }, [datasourceUid]);

  // Update state when initialMappingContext changes or modal opens/closes
  useEffect(() => {
    if (initialMappingContext) {
      setMappingContext(initialMappingContext);
      setActiveView('mapping');
      return;
    }

    if (isOpen) {
      setActiveView('list');
    } else {
      // Reset when modal closes
      setMappingContext(null);
      setActiveView('list');
    }
  }, [initialMappingContext, isOpen]);

  const handleShowMapping = (context: MappingContext) => {
    setMappingContext(context);
    setActiveView('mapping');
  };

  const handleBackToDashboards = () => {
    setMappingContext(null);
    setActiveView('list');
  };

  return (
    <Modal
      title={
        activeView === 'mapping' && mappingContext
          ? t('dashboard-library.modal.title-mapping-with-name', 'Configure datasources for {{dashboardName}}', {
              dashboardName: mappingContext.dashboardName,
            })
          : datasourceInfo.type
            ? t(
                'dashboard-library.modal.title-with-datasource',
                'Suggested dashboards for your {{datasourceType}} datasource',
                { datasourceType: datasourceInfo.type }
              )
            : t('dashboard-library.modal.title', 'Suggested dashboards')
      }
      isOpen={isOpen}
      onDismiss={onDismiss}
      xstyle={styles.modal}
      contentXstyle={styles.modalContent}
    >
      {activeView === 'list' && (
        <div {...stylex.props(styles.listContent)}>
          <SuggestedDashboardsList
            provisionedDashboards={provisionedDashboards}
            communityDashboards={communityDashboards}
            communityTotalPages={communityTotalPages}
            lastPageItemCount={lastPageItemCount}
            onLastPageItemCount={onLastPageItemCount}
            datasourceUid={datasourceUid}
            datasourceType={datasourceInfo.type}
            isDashboardsLoading={isDashboardsLoading}
            onShowMapping={handleShowMapping}
            onDismiss={onDismiss}
          />
        </div>
      )}
      {activeView === 'mapping' && mappingContext && (
        <div {...stylex.props(styles.listContent)}>
          <CommunityDashboardMappingForm
            unmappedDsInputs={mappingContext.unmappedDsInputs}
            constantInputs={mappingContext.constantInputs}
            existingMappings={mappingContext.existingMappings}
            onBack={handleBackToDashboards}
            onPreview={(allMappings) => {
              mappingContext.onInterpolateAndNavigate(allMappings);
            }}
            dashboardName={mappingContext.dashboardName}
            libraryItemId={String(mappingContext.dashboardJson.gnetId || '')}
            contentKind={mappingContext.contentKind}
            datasourceTypes={[datasourceInfo.type]}
          />
        </div>
      )}
    </Modal>
  );
};

// ModalBase's small-height media query.
const smallHeight = '@media (max-height: 750px)';

const styles = stylex.create({
  // Modal's own small-screen max height, padding and margin still win.
  modal: {
    width: '90%',
    maxWidth: '1200px',
    maxHeight: { default: '80vh', [smallHeight]: '100%' },
    display: 'flex',
    flexDirection: 'column',
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    paddingTop: { default: spacing['--gf-spacing-x2'], [bp.smDown]: spacing['--gf-spacing-x1'] },
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x2'],
    paddingLeft: spacing['--gf-spacing-x2'],
    marginBottom: { default: 0, [bp.smDown]: spacing['--gf-spacing-x2'] },
    height: '100%',
  },
  listContent: {
    flex: '1',
    overflow: 'auto',
    paddingLeft: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
  },
});
