import * as stylex from '@stylexjs/stylex';

import { Button } from '@grafana/ui';

import { QuickFeedbackType } from './utils';

interface QuickActionsProps {
  onSuggestionClick: (suggestion: string) => void;
  isGenerating: boolean;
}

export const QuickFeedback = ({ onSuggestionClick, isGenerating }: QuickActionsProps) => {
  return (
    <div {...stylex.props(styles.quickSuggestionsWrapper)}>
      <Button
        onClick={() => onSuggestionClick(QuickFeedbackType.Shorter)}
        size="sm"
        variant="secondary"
        icon="paragraph"
        disabled={isGenerating}
      >
        {QuickFeedbackType.Shorter}
      </Button>
      <Button
        onClick={() => onSuggestionClick(QuickFeedbackType.MoreDescriptive)}
        size="sm"
        variant="secondary"
        icon="document-layout-left"
        disabled={isGenerating}
      >
        {QuickFeedbackType.MoreDescriptive}
      </Button>
      <Button
        onClick={() => onSuggestionClick(QuickFeedbackType.Regenerate)}
        icon="sync"
        size="sm"
        variant="secondary"
        disabled={isGenerating}
      >
        {'Regenerate'}
      </Button>
    </div>
  );
};

const styles = stylex.create({
  quickSuggestionsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
  },
});
