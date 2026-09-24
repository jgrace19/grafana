import * as stylex from '@stylexjs/stylex';
import { useMemo } from 'react';

import { type StandardEditorProps } from '@grafana/data';
import { CodeEditor, type CodeEditorSuggestionItem, variableSuggestionToCodeEditorSuggestion } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { type Options, TextMode } from './panelcfg.gen';

export const TextPanelEditor = ({ value, onChange, context }: StandardEditorProps<string, {}, Options>) => {
  const language = useMemo(() => context.options?.mode ?? TextMode.Markdown, [context]);

  const getSuggestions = (): CodeEditorSuggestionItem[] => {
    if (!context.getSuggestions) {
      return [];
    }
    return context.getSuggestions().map((v) => variableSuggestionToCodeEditorSuggestion(v));
  };

  return (
    <div {...stylex.props(styles.editorBox)}>
      <CodeEditor
        value={value}
        onBlur={onChange}
        onSave={onChange}
        language={language}
        width="100%"
        showMiniMap={false}
        showLineNumbers={false}
        height="500px"
        getSuggestions={getSuggestions}
      />
    </div>
  );
};

const styles = stylex.create({
  editorBox: {
    marginTop: spacing['--gf-spacing-x0-5'],
    marginRight: spacing['--gf-spacing-x0'],
    marginBottom: spacing['--gf-spacing-x0-5'],
    marginLeft: spacing['--gf-spacing-x0'],
    width: '100%',
  },
});
