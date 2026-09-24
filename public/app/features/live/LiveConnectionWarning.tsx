import * as stylex from '@stylexjs/stylex';
import { memo, useEffect, useRef, useState } from 'react';
import { type Unsubscribable } from 'rxjs';

import { OrgRole } from '@grafana/data';
import { t } from '@grafana/i18n';
import { config, getGrafanaLiveSrv } from '@grafana/runtime';
import { Alert } from '@grafana/ui';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { contextSrv } from 'app/core/services/context_srv';

import { liveConnectionWarningStyles } from './LiveConnectionWarning.stylex';

export interface Props {}

export const LiveConnectionWarning = memo(function LiveConnectionWarning() {
  const [show, setShow] = useState<boolean | undefined>(undefined);
  const subscriptionRef = useRef<Unsubscribable | undefined>(undefined);

  useEffect(() => {
    // Only show the error in development mode
    if (process.env.NODE_ENV === 'development') {
      // Wait a second to listen for server errors
      const timer = setTimeout(() => {
        const live = getGrafanaLiveSrv();
        if (live) {
          subscriptionRef.current = live.getConnectionState().subscribe({
            next: (v) => {
              setShow(!v);
            },
          });
        }
      }, 1500);

      return () => {
        clearTimeout(timer);
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }
      };
    }

    return undefined;
  }, []);

  if (show) {
    if (!contextSrv.isSignedIn || !config.liveEnabled || contextSrv.user.orgRole === OrgRole.None) {
      return null; // do not show the warning for anonymous users or ones with no org (and /login page etc)
    }

    return (
      <Alert
        severity={'warning'}
        {...mergeStylexClassName(stylex.props(liveConnectionWarningStyles.warn), undefined)}
        title={t('live.live-connection-warning.title-connection-to-server-is-lost', 'Connection to server is lost...')}
      />
    );
  }
  return null;
});
