import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';
import { Button, Stack, Text } from '@grafana/ui';
import { colors } from '@grafana/ui/stylex/tokens.stylex';

interface SuggestionsBadgeProps {
  suggestions: string[];
  handleOpenDrawer: () => void;
}

export const SuggestionsDrawerButton = ({ suggestions, handleOpenDrawer }: SuggestionsBadgeProps) => {
  return (
    <div {...stylex.props(styles.buttonWrapper)} data-testid="suggestions-badge">
      <Button variant="secondary" fill="outline" size="sm" onClick={handleOpenDrawer} icon="list-ol">
        <Stack direction="row" gap={1} alignItems="center">
          <Trans i18nKey="sql-expressions.suggestions">Suggestions</Trans>
          <span {...stylex.props(styles.countBadge)}>
            <Text variant="bodySmall" weight="bold">
              {suggestions.length}
            </Text>
          </span>
        </Stack>
      </Button>
    </div>
  );
};

const styles = stylex.create({
  countBadge: {
    color: colors['--gf-colors-primary-text'],
    fontWeight: 'bold',
  },

  buttonWrapper: {
    position: 'relative',
    display: 'inline-block',
  },
});
