import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { fieldSearchStyles } from './FieldSearch.stylex';
import * as React from 'react';

import { t } from '@grafana/i18n';
import { Field, IconButton, Input } from '@grafana/ui';

interface Props {
  collapse(): void;
  onChange(e?: React.FormEvent<HTMLInputElement>): void;
  value: string;
}

export function FieldSearch({ collapse, onChange, value }: Props) {
  return (
    <>
      <IconButton
        {...stylex.props(fieldSearchStyles.iconExpanded)}
        onClick={collapse}
        name="arrow-from-right"
        tooltip={t('logs.field-selector.collapse', 'Collapse sidebar')}
        size="sm"
      />
      <Field noMargin {...stylex.props(fieldSearchStyles.searchWrap)}>
        <Input
          value={value}
          type="text"
          placeholder={t('logs.field-selector.placeholder-search-fields-by-name', 'Search fields by name')}
          onChange={onChange}
          suffix={
            value ? (
              <IconButton
                name="times"
                aria-label={t('logs.field-selector.clear-button', 'Clear')}
                onClick={() => onChange()}
              />
            ) : undefined
          }
        />
      </Field>
    </>
  );
}

