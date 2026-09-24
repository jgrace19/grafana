import * as stylex from '@stylexjs/stylex';
import type * as monacoType from 'monaco-editor/esm/vs/editor/editor.api';
import { useCallback, useRef } from 'react';

import { CodeEditor, type Monaco } from '@grafana/ui';
import { colors, components, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { DynamicLabelsCompletionItemProvider } from '../../../language/dynamic-labels/CompletionItemProvider';
import language from '../../../language/dynamic-labels/definition';
import { TRIGGER_SUGGEST } from '../../../language/monarch/commands';
import { registerLanguage } from '../../../language/monarch/register';

const dynamicLabelsCompletionItemProvider = new DynamicLabelsCompletionItemProvider();

export interface Props {
  onChange: (query: string) => void;
  label: string;
  width: number;
}

export function DynamicLabelsField({ label, width, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onEditorMount = useCallback(
    (editor: monacoType.editor.IStandaloneCodeEditor, monaco: Monaco) => {
      editor.onDidFocusEditorText(() => editor.trigger(TRIGGER_SUGGEST.id, TRIGGER_SUGGEST.id, {}));
      editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
        const text = editor.getValue();
        onChange(text);
      });

      const containerDiv = containerRef.current;
      containerDiv !== null && editor.layout({ width: containerDiv.clientWidth, height: containerDiv.clientHeight });
    },
    [onChange]
  );

  return (
    <div ref={containerRef} {...stylex.props(styles.wrapper, width ? styles.width(width) : styles.fullWidth)}>
      <CodeEditor
        containerXstyle={styles.codeEditor}
        monacoOptions={{
          // without this setting, the auto-resize functionality causes an infinite loop, don't remove it!
          scrollBeyondLastLine: false,

          // These additional options are style focused and are a subset of those in the query editor in Prometheus
          fontSize: 14,
          lineNumbers: 'off',
          renderLineHighlight: 'none',
          overviewRulerLanes: 0,
          scrollbar: {
            vertical: 'hidden',
            horizontal: 'hidden',
          },
          suggestFontSize: 12,
          padding: {
            top: 6,
          },
        }}
        language={language.id}
        value={label}
        onBlur={(value) => {
          if (value !== label) {
            onChange(value);
          }
        }}
        onBeforeEditorMount={(monaco: Monaco) =>
          registerLanguage(monaco, language, dynamicLabelsCompletionItemProvider)
        }
        onEditorDidMount={onEditorMount}
      />
    </div>
  );
}

const styles = stylex.create({
  codeEditor: {
    borderColor: {
      default: colors['--gf-colors-action-disabled-background'],
      ':hover': components['--gf-components-input-border-color'],
    },
  },
  wrapper: {
    display: 'flex',
    height: `calc(${spacing['--gf-spacing-grid-size']} * ${components['--gf-components-height-md']})`,
    borderRadius: shape['--gf-shape-radius-default'],
  },
  width: (width: number) => ({
    width: `calc(${spacing['--gf-spacing-grid-size']} * ${width})`,
  }),
  fullWidth: {
    width: '100%',
  },
});
