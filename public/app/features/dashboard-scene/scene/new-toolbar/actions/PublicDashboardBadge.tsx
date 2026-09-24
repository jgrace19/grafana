import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { Badge } from '@grafana/ui';
import { useGetPublicDashboardQuery } from 'app/features/dashboard/api/publicDashboardApi';

import { type ToolbarActionProps } from '../types';

import './PublicDashboardBadge.css';

export const PublicDashboardBadge = ({ dashboard }: ToolbarActionProps) => {
  if (!dashboard.state.uid || !config.publicDashboardsEnabled) {
    return null;
  }

  return (
    <PublicDashboardBadgeInternal
      uid={dashboard.state.uid}
      hasPublicDashboard={dashboard.state.meta.publicDashboardEnabled}
    />
  );
};

// Used in old architecture
export const PublicDashboardBadgeLegacy = PublicDashboardBadgeInternal;

function PublicDashboardBadgeInternal({ uid, hasPublicDashboard }: { uid: string; hasPublicDashboard?: boolean }) {
  const { data: publicDashboard } = useGetPublicDashboardQuery(uid, {
    skip: hasPublicDashboard !== undefined && !hasPublicDashboard,
  });

  const showBadge = hasPublicDashboard !== undefined ? hasPublicDashboard : !!publicDashboard;

  if (!showBadge) {
    return null;
  }

  return (
    <Badge
      color="blue"
      text={t('dashboard.toolbar.new.public-dashboard', 'Public')}
      className="gf-public-dashboard-badge"
      data-testid={selectors.pages.Dashboard.DashNav.publicDashboardTag}
    />
  );
}
