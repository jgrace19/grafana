import * as stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useRef, useState, type JSX } from 'react';

import { t } from '@grafana/i18n';
import { IconButton, Stack, InlineToast, Tooltip, Icon } from '@grafana/ui';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { type SqlExpressionQuery } from '../types';

interface QueryToolboxProps {
  onFormatCode?: () => void;
  onExpand?: (isExpanded: boolean) => void;
  isExpanded?: boolean;
  query: SqlExpressionQuery;
}

const SHOW_SUCCESS_DURATION = 2 * 1000;

export const QueryToolbox = ({ onFormatCode, onExpand, isExpanded, query }: QueryToolboxProps): JSX.Element => {
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!showCopySuccess) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setShowCopySuccess(false);
    }, SHOW_SUCCESS_DURATION);

    return () => clearTimeout(timeoutId);
  }, [showCopySuccess]);

  const copyTextCallback = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(query.expression ?? '');
      setShowCopySuccess(true);
    } catch (e) {
      console.error(e);
    }
  }, [query.expression]);

  const copiedText = t('clipboard-button.inline-toast.success', 'Copied');

  return (
    <div {...stylex.props(styles.container)}>
      <Stack alignItems="center" direction="row" gap={1}>
        {onFormatCode && (
          <IconButton
            onClick={onFormatCode}
            name="brackets-curly"
            size="xs"
            tooltip={t('expressions.query-toolbox.tooltip-format-query', 'Format query')}
          />
        )}
        {onExpand && (
          <IconButton
            onClick={() => onExpand(!isExpanded)}
            name={isExpanded ? 'angle-double-up' : 'angle-double-down'}
            size="xs"
            tooltip={
              isExpanded
                ? t('expressions.query-toolbox.tooltip-collapse-editor', 'Collapse editor')
                : t('expressions.query-toolbox.tooltip-expand-editor', 'Expand editor')
            }
          />
        )}
        {showCopySuccess && (
          <InlineToast placement="top" referenceElement={buttonRef.current}>
            {copiedText}
          </InlineToast>
        )}
        <IconButton
          name={showCopySuccess ? 'check' : 'copy'}
          onClick={copyTextCallback}
          ref={buttonRef}
          size="xs"
          tooltip={t('expressions.query-toolbox.tooltip-copy-query', 'Copy query')}
          variant={showCopySuccess ? 'primary' : 'secondary'}
        />
        {!isExpanded && (
          <Tooltip content={t('expressions.query-toolbox.tooltip-run-query', 'Hit ctrl/cmd+enter to run query')}>
            <Icon name="keyboard" />
          </Tooltip>
        )}
      </Stack>
    </div>
  );
};

const styles = stylex.create({
  container: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-medium'],
    borderTopStyle: 'none',
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'end',
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
});
