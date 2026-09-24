import * as stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { components, type MultiValueRemoveProps } from 'react-select';

import { escapeStringForRegex, type SelectableValue } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { Icon, MultiSelect } from '@grafana/ui';
import { colors } from '@grafana/ui/stylex/tokens.stylex';

import { TagBadge } from './TagBadge';
import { TagOption, type TagSelectOption } from './TagOption';

export interface TermCount {
  term: string;
  count: number;
}

export interface Props {
  allowCustomValue?: boolean;
  formatCreateLabel?: (input: string) => string;
  /** Do not show selected values inside Select. Useful when the values need to be shown in some other components */
  hideValues?: boolean;
  inputId?: string;
  isClearable?: boolean;
  onChange: (tags: string[]) => void;
  placeholder?: string;
  tagOptions: () => Promise<TermCount[]>;
  tags: string[];
  width?: number;
  disabled?: boolean;
}

const filterOption = (option: SelectableValue<string>, searchQuery: string) => {
  const regex = RegExp(escapeStringForRegex(searchQuery), 'i');
  return Boolean(option.value && regex.test(option.value));
};

export const TagFilter = ({
  allowCustomValue = false,
  formatCreateLabel,
  hideValues,
  inputId,
  isClearable,
  onChange,
  placeholder,
  tagOptions,
  tags,
  width,
  disabled,
}: Props) => {
  const currentlySelectedTags = tags.map((tag) => ({ value: tag, label: tag, count: 0 }));
  const [options, setOptions] = useState<TagSelectOption[]>(currentlySelectedTags);
  const [isLoading, setIsLoading] = useState(false);
  const [previousTags, setPreviousTags] = useState(tags);
  const [customTags, setCustomTags] = useState<TagSelectOption[]>(currentlySelectedTags);

  // Necessary to force re-render to keep tag options up to date / relevant
  const selectKey = useMemo(() => tags.join(), [tags]);

  const onLoadOptions = useCallback(async () => {
    const options = await tagOptions();
    return options.map((option) => {
      if (tags.includes(option.term)) {
        return {
          value: option.term,
          label: option.term,
          count: 0,
        };
      } else {
        return {
          value: option.term,
          label: option.term,
          count: option.count,
        };
      }
    });
  }, [tagOptions, tags]);

  const onFocus = useCallback(async () => {
    setIsLoading(true);
    const results = await onLoadOptions();

    if (allowCustomValue) {
      customTags.forEach((customTag) => results.push(customTag));
    }

    setOptions(results);
    setIsLoading(false);
  }, [allowCustomValue, customTags, onLoadOptions]);

  useEffect(() => {
    // Load options when tag is selected externally
    if (tags.length > 0 && options.length === 0) {
      onFocus();
    }
  }, [onFocus, options.length, tags.length]);

  useEffect(() => {
    // Update selected tags to not include (counts) when selected externally
    if (tags !== previousTags) {
      setPreviousTags(tags);
      onFocus();
    }
  }, [onFocus, previousTags, tags]);

  const onTagChange = (newTags: any[]) => {
    newTags.forEach((tag) => (tag.count = 0));

    // On remove with 1 item returns null, so we need to make sure it's an empty array in that case
    // https://github.com/JedWatson/react-select/issues/3632
    onChange((newTags || []).map((tag) => tag.value));

    // If custom values are allowed, set custom tags to prevent overwriting from query update
    if (allowCustomValue) {
      setCustomTags(newTags.filter((tag) => !tags.includes(tag)));
    }
  };

  const selectOptions = {
    onFocus,
    isLoading,
    options,
    allowCreateWhileLoading: true,
    allowCustomValue,
    formatCreateLabel,
    defaultOptions: true,
    filterOption,
    getOptionLabel: (i: SelectableValue<string>) => i.label,
    getOptionValue: (i: SelectableValue<string>) => i.value,
    inputId,
    isMulti: true,
    onChange: onTagChange,
    loadingMessage: t('tag-filter.loading', 'Loading...'),
    noOptionsMessage: t('tag-filter.no-tags', 'No tags found'),
    placeholder: placeholder || t('tag-filter.placeholder', 'Filter by tag'),
    value: currentlySelectedTags,
    width,
    components: {
      Option: TagOption,
      MultiValueLabel: () => {
        return null; // We want the whole tag to be clickable so we use MultiValueRemove instead
      },
      MultiValueRemove(props: MultiValueRemoveProps<TagSelectOption>) {
        const { data } = props;

        return (
          <components.MultiValueRemove {...props}>
            <TagBadge
              key={data.label}
              label={data.label}
              removeIcon={true}
              count={data.count}
              className={stylex.props(styles.tagBadge).className}
            />
          </components.MultiValueRemove>
        );
      },
      MultiValueContainer: hideValues ? () => null : components.MultiValueContainer,
    },
  };

  return (
    <div {...stylex.props(styles.tagFilter)}>
      {isClearable && tags.length > 0 && (
        <button {...stylex.props(styles.clear)} onClick={() => onTagChange([])} disabled={disabled}>
          <Trans i18nKey="tag-filter.clear-button">Clear tags</Trans>
        </button>
      )}
      <MultiSelect
        key={selectKey}
        {...selectOptions}
        prefix={<Icon name="tag-alt" />}
        aria-label={t('tag-filter.select-aria-label', 'Tag filter')}
        disabled={disabled}
      />
    </div>
  );
};

TagFilter.displayName = 'TagFilter';

const styles = stylex.create({
  tagFilter: {
    position: 'relative',
    minWidth: '180px',
    flexGrow: 1,
  },
  tagBadge: {
    marginLeft: '6px',
    cursor: 'pointer',
  },
  clear: {
    background: 'none',
    borderStyle: 'none',
    textDecoration: 'underline',
    fontSize: '12px',
    position: 'absolute',
    top: '-17px',
    right: 0,
    cursor: 'pointer',
    color: { default: colors['--gf-colors-text-secondary'], ':hover': colors['--gf-colors-text-primary'] },
  },
});
