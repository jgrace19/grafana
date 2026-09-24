import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';
import { Text } from '@grafana/ui';

// @TODO I don't like applying the margins to this component here, ideally the parent component should be layouting this.
export const NoRulesFound = () => {

  return (
    <div {...stylex.props(noRulesFoundStyles.noRules)}>
      <Text color="secondary">
        <Trans i18nKey="alerting.rule-list.empty-data-source">No rules found</Trans>
      </Text>
    </div>
  );
};

