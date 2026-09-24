import * as stylex from '@stylexjs/stylex';


import { type SelectableValue } from '@grafana/data';
import { LinkButton, FilterInput, InlineField, Checkbox } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { SortPicker } from '../Select/SortPicker';

export type FilterCheckbox = {
  onChange: (value: boolean) => void;
  value: boolean;
  label?: string;
};

export interface Props {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  linkButton?: { href: string; title: string; disabled?: boolean };
  target?: string;
  placeholder?: string;
  sortPicker?: {
    onChange: (sortValue: SelectableValue) => void;
    value?: string;
    getSortOptions?: () => Promise<SelectableValue[]>;
  };
  filterCheckbox?: FilterCheckbox;
}

export default function PageActionBar({
  searchQuery,
  linkButton,
  setSearchQuery,
  target,
  placeholder = 'Search by name or type',
  sortPicker,
  filterCheckbox,
}: Props) {
  const linkProps: Omit<Parameters<typeof LinkButton>[0], 'children'> = {
    href: linkButton?.href,
    disabled: linkButton?.disabled,
  };

  if (target) {
    linkProps.target = target;
  }

  return (
    <div {...stylex.props(styles.container)}>
      <InlineField grow>
        <FilterInput value={searchQuery} onChange={setSearchQuery} placeholder={placeholder} />
      </InlineField>
      {filterCheckbox && (
        <Checkbox
          label={filterCheckbox.label}
          value={filterCheckbox.value}
          onChange={(event) => filterCheckbox.onChange(event.currentTarget.checked)}
        />
      )}
      {sortPicker && (
        <SortPicker
          onChange={sortPicker.onChange}
          value={sortPicker.value}
          getSortOptions={sortPicker.getSortOptions}
        />
      )}
      {linkButton && <LinkButton {...linkProps}>{linkButton.title}</LinkButton>}
    </div>
  );
}

const styles = stylex.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x2'],
    marginBottom: spacing['--gf-spacing-x2'],
  },
});
