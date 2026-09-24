import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { tagOptionStyles } from './TagOption.stylex';
import { type OptionProps } from 'react-select';

import { t } from '@grafana/i18n';

import { TagBadge } from './TagBadge';

export interface TagSelectOption {
  value: string;
  label: string;
  count: number;
}

export const TagOption = ({ data, className, label, isFocused, innerProps }: OptionProps<TagSelectOption>) => {

  return (
    <div
      {...mergeStylexClassName(stylex.props(tagOptionStyles.option, isFocused && tagOptionStyles.optionFocused), undefined)}
      aria-label={t('tag-filter.tag-option-label', 'Tag option')}
      {...innerProps}
    >
      <div {...mergeStylexClassName(stylex.props(tagOptionStyles.option, Inner, className), undefined)}>
        {typeof label === 'string' ? <TagBadge label={label} removeIcon={false} count={data.count ?? 0} /> : label}
      </div>
    </div>
  );
};

