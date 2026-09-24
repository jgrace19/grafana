
import { Trans } from '@grafana/i18n';
import { Button, Stack, Text, } from '@grafana/ui';

interface SuggestionsBadgeProps {
  suggestions: string[];
  handleOpenDrawer: () => void;
}

export const SuggestionsDrawerButton = ({ suggestions, handleOpenDrawer }: SuggestionsBadgeProps) => {
  const styles = (getStyles);

  return (
    <div {...stylex.props(suggestionsDrawerButtonStyles.buttonWrapper)} data-testid="suggestions-badge">
      <Button variant="secondary" fill="outline" size="sm" onClick={handleOpenDrawer} icon="list-ol">
        <Stack direction="row" gap={1} alignItems="center">
          <Trans i18nKey="sql-expressions.suggestions">Suggestions</Trans>
          <span {...stylex.props(suggestionsDrawerButtonStyles.countBadge)}>
            <Text variant="bodySmall" weight="bold">
              {suggestions.length}
            </Text>
          </span>
        </Stack>
      </Button>
    </div>
  );
};

