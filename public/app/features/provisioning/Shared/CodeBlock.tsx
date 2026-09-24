// eslint-disable-next-line no-restricted-imports -- stylex: pending ClipboardButton migration
import { css } from '@emotion/css';
import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { ClipboardButton, CodeEditor } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

interface Props {
  code: string;
  copyCode?: boolean;
}

export const CodeBlock = ({ code, copyCode = true }: Props) => {
  const lineCount = code.split('\n').length;
  const useMinHeight = lineCount * 24 <= 42; // 24px per line, 42px minimum

  return (
    <div {...stylex.props(styles.container)}>
      {copyCode && (
        <ClipboardButton
          aria-label={t('provisioning.code-block.aria-label-copy', 'Copy code to clipboard')}
          className={copyButton}
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

const styles = stylex.create({
  container: {
    position: 'relative',
    marginTop: spacing['--gf-spacing-x2'],
    marginRight: 0,
    marginBottom: spacing['--gf-spacing-x2'],
    marginLeft: 0,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-medium'],
  },
});

// stylex: pending ClipboardButton migration. Its own Emotion `position: relative` would beat a layered StyleX class.
const copyButton = css({
  position: 'absolute',
  top: spacing['--gf-spacing-x1'],
  right: spacing['--gf-spacing-x1'],
  zIndex: 1,
});
