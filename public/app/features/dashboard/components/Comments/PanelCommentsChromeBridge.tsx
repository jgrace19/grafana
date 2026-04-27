import { useState, type ReactNode } from 'react';

import { config } from '@grafana/runtime';

import { dashboardCommentsApi } from '../../api/commentsApi';
import { useSelector } from 'app/types/store';

import { CommentDrawer } from './CommentDrawer';

interface Props {
  dashboardUid: string | undefined;
  panelId: number;
  children: (opts: { onOpenComments?: () => void }) => ReactNode;
}

/**
 * Subscribes to cached dashboard comments (list query must be active via DashboardCommentsPoller)
 * and renders CommentDrawer for this panel.
 */
export function PanelCommentsChromeBridge({ dashboardUid, panelId, children }: Props) {
  const [open, setOpen] = useState(false);
  const uid = dashboardUid ?? '';

  const comments = useSelector((state) => {
    if (!config.featureToggles.dashboardComments || !uid) {
      return [];
    }
    return dashboardCommentsApi.endpoints.listComments.select({ dashboardUID: uid })(state).data ?? [];
  });

  if (!config.featureToggles.dashboardComments || !uid) {
    return <>{children({ onOpenComments: undefined })}</>;
  }

  return (
    <>
      {children({ onOpenComments: () => setOpen(true) })}
      <CommentDrawer
        dashboardUid={uid}
        panelId={panelId}
        isOpen={open}
        onClose={() => setOpen(false)}
        comments={comments}
      />
    </>
  );
}
