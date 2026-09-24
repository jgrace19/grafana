import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { connectionsRedirectNoticeStyles } from './ConnectionsRedirectNotice.stylex';
import { useState } from 'react';

import { Trans } from '@grafana/i18n';
import { Alert, TextLink } from '@grafana/ui';
import { contextSrv } from 'app/core/services/context_srv';
import { AccessControlAction } from 'app/types/accessControl';

import { ROUTES } from '../../constants';


export function ConnectionsRedirectNotice() {
  const canAccessDataSources =
    contextSrv.hasPermission(AccessControlAction.DataSourcesCreate) ||
    contextSrv.hasPermission(AccessControlAction.DataSourcesWrite);
  const [showNotice, setShowNotice] = useState(canAccessDataSources);

  return showNotice ? (
    <Alert severity="info" title="" onRemove={() => setShowNotice(false)}>
      <p {...stylex.props(connectionsRedirectNoticeStyles.alertParagraph)}>
        <Trans
          i18nKey="connections.connections-redirect-notice.body"
          defaults="Data sources have a new home! You can discover new data sources or manage existing ones in the <0>Connections page</0>, accessible from the main menu."
          components={[
            <TextLink key="0" href={ROUTES.DataSources}>
              {''}
            </TextLink>,
          ]}
        />
      </p>
    </Alert>
  ) : (
    <></>
  );
}
