
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { quickFeedbackStyles } from './QuickFeedback.stylex';
import { Button, useStyles2 } from '@grafana/ui';

import { QuickFeedbackType } from './utils';

interface QuickActionsProps {
  onSuggestionClick: (suggestion: string) => void;
  isGenerating: boolean;
}

export const QuickFeedback = ({ onSuggestionClick, isGenerating }: QuickActionsProps) => {

  return (
    <div {...stylex.props(quickFeedbackStyles.quickSuggestionsWrapper)}>
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

