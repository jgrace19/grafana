import * as stylex from '@stylexjs/stylex';
import { textPanelEditorStyles } from './TextPanelEditor.stylex';

import { useMemo } from 'react';

import {
  CodeEditor,
  type CodeEditorSuggestionItem,
  variableSuggestionToCodeEditorSuggestion,
} from '@grafana/ui';

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
    <div className={clsx(styles.editorBox)}>
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

