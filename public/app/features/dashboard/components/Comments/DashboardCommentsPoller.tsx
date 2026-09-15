import { config } from '@grafana/runtime';

import { useListCommentsQuery } from '../../api/commentsApi';

/** Subscribes to dashboard-level comment polling (single request per dashboard). */
export function DashboardCommentsPoller(props: { dashboardUID: string | null | undefined }) {
  const uid = props.dashboardUID ?? '';
  useListCommentsQuery(
    { dashboardUID: uid },
    { skip: !config.featureToggles.dashboardComments || !uid, pollingInterval: 15_000 }
  );
  return null;
}
