import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import { Page } from 'app/core/components/Page/Page';

export default function FeatureTogglePage() {
  return (
    <Page className={stylex.props(styles.page).className}>
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

const styles = stylex.create({
  page: {
    marginTop: spacing['--gf-spacing-x2'],
  },
});
