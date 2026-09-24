// eslint-disable-next-line no-restricted-imports -- stylex: pending child migration, see the override below
import { css } from '@emotion/css';
import { useId } from '@react-aria/utils';
import { useCallback, useState } from 'react';
import * as React from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { TextArea } from '@grafana/ui';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { type VariableQueryEditorProps } from '../types';

export const LEGACY_VARIABLE_QUERY_EDITOR_NAME = 'Grafana-LegacyVariableQueryEditor';

export const LegacyVariableQueryEditor = ({ onChange, query }: VariableQueryEditorProps) => {
  const [value, setValue] = useState(query);

  const onValueChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    setValue(event.currentTarget.value);
  };

  const onBlur = useCallback(
    (event: React.FormEvent<HTMLTextAreaElement>) => {
      onChange(event.currentTarget.value, event.currentTarget.value);
    },
    [onChange]
  );

  const id = useId();

  return (
    <TextArea
      id={id}
      rows={2}
      value={value}
      onChange={onValueChange}
      onBlur={onBlur}
      placeholder={t(
        'variables.legacy-variable-query-editor.placeholder-metric-name-or-tags-query',
        'Metric name or tags query'
      )}
      required
      data-testid={selectors.pages.Dashboard.Settings.Variables.Edit.QueryVariable.queryOptionsQueryInput}
      cols={52}
      className={textareaClassName}
    />
  );
};

LegacyVariableQueryEditor.displayName = LEGACY_VARIABLE_QUERY_EDITOR_NAME;

// stylex: pending TextArea migration: TextArea's own padding and width would beat a StyleX className
const textareaClassName = css({
  whiteSpace: 'pre-wrap',
  minHeight: spacing['--gf-spacing-x4'],
  height: 'auto',
  overflow: 'auto',
  padding: `calc(${spacing['--gf-spacing-grid-size']} * 0.75) ${spacing['--gf-spacing-x1']}`,
  width: 'inherit',

  [bp.smDown]: {
    width: '100%',
  },
});
