import * as stylex from '@stylexjs/stylex';

import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { Stack, EmptyState, LinkButton } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

export interface Props {
  /**
   * Defaults to Page
   */
  entity?: string;
}

export function EntityNotFound({ entity = 'Page' }: Props) {
  const lowerCaseEntity = entity.toLowerCase();

  return (
    <div {...stylex.props(styles.container)} data-testid={selectors.components.EntityNotFound.container}>
      <EmptyState
        message={t('entity-not-found.title', '{{entity}} not found', { entity })}
        variant="not-found"
        button={
          <Stack direction="row" gap={2}>
            <LinkButton icon="arrow-left" href="/">
              <Trans i18nKey="entity-not-found.home-link">Back to Home</Trans>
            </LinkButton>

            <LinkButton
              icon="question-circle"
              href="https://community.grafana.com"
              target="_blank"
              rel="noreferrer"
              variant="secondary"
            >
              <Trans i18nKey="entity-not-found.community-link">Community Help</Trans>
            </LinkButton>
          </Stack>
        }
      >
        <Trans i18nKey="entity-not-found.description">
          We&apos;re looking but can&apos;t seem to find this {{ lowerCaseEntity }}. Please check the URL and try again.
        </Trans>
      </EmptyState>
    </div>
  );
}

const styles = stylex.create({
  container: {
    paddingTop: spacing['--gf-spacing-x8'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x2'],
    paddingLeft: spacing['--gf-spacing-x2'],
  },
});
