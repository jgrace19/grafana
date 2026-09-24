
import { t } from '@grafana/i18n';
import { ClipboardButton, CodeEditor } from '@grafana/ui';

interface Props {
  code: string;
  copyCode?: boolean;
}

export const CodeBlock = ({ code, copyCode = true }: Props) => {
  const lineCount = code.split('\n').length;
  const useMinHeight = lineCount * 24 <= 42; // 24px per line, 42px minimum
  const styles = (getStyles);

  return (
    <div {...stylex.props(codeBlockStyles.container)}>
      {copyCode && (
        <ClipboardButton
          aria-label={t('provisioning.code-block.aria-label-copy', 'Copy code to clipboard')}
          {...stylex.props(codeBlockStyles.copyButton)}
          variant="secondary"
          size="sm"
          icon="copy"
          getText={() => code}
        />
      )}
      <CodeEditor
        value={code}
        language="ini"
        showLineNumbers={false}
        showMiniMap={false}
        height={useMinHeight ? '42px' : `${Math.min(lineCount * 24, 300)}px`}
        readOnly={true}
        monacoOptions={{
          scrollBeyondLastLine: false,
          scrollbar: {
            vertical: useMinHeight ? 'hidden' : 'auto',
            horizontal: 'auto',
          },
        }}
      />
    </div>
  );
};

