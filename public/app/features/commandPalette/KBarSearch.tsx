import * as stylex from '@stylexjs/stylex';
import { useKBar, VisualState } from 'kbar';
import * as React from 'react';

import { colors, typography } from '@grafana/ui/stylex/tokens.stylex';

export const KBAR_LISTBOX = 'kbar-listbox';
export const getListboxItemId = (id: number) => `kbar-listbox-item-${id}`;

export function KBarSearch(
  props: React.InputHTMLAttributes<HTMLInputElement> & {
    defaultPlaceholder?: string;
  }
) {
  const { query, search, actions, currentRootActionId, activeIndex, showing, options } = useKBar((state) => ({
    search: state.searchQuery,
    currentRootActionId: state.currentRootActionId,
    actions: state.actions,
    activeIndex: state.activeIndex,
    showing: state.visualState === VisualState.showing,
  }));

  const [inputValue, setInputValue] = React.useState(search);
  React.useEffect(() => {
    query.setSearch(inputValue);
  }, [inputValue, query]);

  const { defaultPlaceholder, ...rest } = props;

  React.useEffect(() => {
    query.setSearch('');
    query.getInput().focus();
    setInputValue('');
    return () => query.setSearch('');
  }, [currentRootActionId, query]);

  const defaultText = defaultPlaceholder ?? 'Type a command or search…';

  return (
    <input
      {...rest}
      className={stylex.props(styles.input).className}
      ref={query.inputRefSetter}
      /* eslint-disable-next-line jsx-a11y/no-autofocus */
      autoFocus
      autoComplete="off"
      role="combobox"
      spellCheck="false"
      aria-expanded={showing}
      aria-controls={KBAR_LISTBOX}
      aria-activedescendant={getListboxItemId(activeIndex)}
      value={inputValue}
      placeholder={defaultText}
      onChange={(event) => {
        props.onChange?.(event);
        setInputValue(event.target.value);
        options?.callbacks?.onQueryChange?.(event.target.value);
      }}
      onKeyDown={(event) => {
        props.onKeyDown?.(event);
        if (currentRootActionId && !search && event.key === 'Backspace') {
          const parent = actions[currentRootActionId].parent;
          query.setCurrentRootAction(parent);
        }
      }}
    />
  );
}

const styles = stylex.create({
  input: {
    fontSize: typography['--gf-typography-body-font-size'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    lineHeight: typography['--gf-typography-body-line-height'],
    color: colors['--gf-colors-text-secondary'],
    width: '100%',
    outline: 'none',
    paddingLeft: 0,
  },
});
