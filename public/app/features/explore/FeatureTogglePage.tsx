import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { featureTogglePageStyles } from './FeatureTogglePage.stylex';

import { type GrafanaTheme2 } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { Page } from 'app/core/components/Page/Page';


export default function FeatureTogglePage() {

  return (
    <Page {...stylex.props(featureTogglePageStyles.root)}>
      <Page.Contents>
        <h1>
          <Trans i18nKey="explore.feature-toggle-page.title-explore-disabled">Explore is disabled</Trans>
        </h1>
        <Trans i18nKey="explore.feature-toggle-page.description-explore-disabled">
          To enable Explore, enable it in the Grafana config:
        </Trans>
        <div>
          <pre>
            {`[explore]
enable = true
`}
          </pre>
        </div>
      </Page.Contents>
    </Page>
  );
}
