import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';
import { Text } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

// @TODO I don't like applying the margins to this component here, ideally the parent component should be layouting this.
export const NoRulesFound = () => {
  return (
    <div {...stylex.props(styles.noRules)}>
      <Text color="secondary">
        <Trans i18nKey="alerting.rule-list.empty-data-source">No rules found</Trans>
      </Text>
    </div>
  );
};

const styles = stylex.create({
  noRules: {
    marginTop: spacing['--gf-spacing-x1-5'],
    marginRight: 0,
    marginBottom: spacing['--gf-spacing-x0-5'],
    marginLeft: spacing['--gf-spacing-x4'],
  },
});
