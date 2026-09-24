import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { jsonEditorSettingsStyles } from './JsonEditorSettings.stylex';
import { useState } from 'react';

import { Trans } from '@grafana/i18n';
import { Button, CodeEditor, useStyles2 } from '@grafana/ui';
import { Page } from 'app/core/components/Page/Page';
import { dashboardWatcher } from 'app/features/live/dashboard/dashboardWatcher';

import { getDashboardSrv } from '../../services/DashboardSrv';

import { type SettingsPageProps } from './types';

export function JsonEditorSettings({ dashboard, sectionNav }: SettingsPageProps) {
  const dashboardSaveModel = dashboard.getSaveModelClone();
  const [dashboardJson, setDashboardJson] = useState<string>(JSON.stringify(dashboardSaveModel, null, 2));
  const pageNav = sectionNav.node.parentItem;

  const onClick = async () => {
    await getDashboardSrv().saveJSONDashboard(dashboardJson);
    dashboardWatcher.reloadPage();
  };

  return (
    <Page navModel={sectionNav} pageNav={pageNav}>
      <div {...stylex.props(jsonEditorSettingsStyles.wrapper)}>
        <Trans i18nKey="dashboard-settings.json-editor.subtitle">
          The JSON model below is the data structure that defines the dashboard. This includes dashboard settings, panel
          settings, layout, queries, and so on.
        </Trans>
        <CodeEditor
          value={dashboardJson}
          language="json"
          showMiniMap={true}
          showLineNumbers={true}
          onBlur={setDashboardJson}
          containerStyles={mergeStylexClassName(stylex.props(jsonEditorSettingsStyles.codeEditor), undefined).className}
        />
        {dashboard.meta.canSave && (
          <div>
            <Button type="submit" onClick={onClick}>
              <Trans i18nKey="dashboard-settings.json-editor.save-button">Save changes</Trans>
            </Button>
          </div>
        )}
      </div>
    </Page>
  );
}

