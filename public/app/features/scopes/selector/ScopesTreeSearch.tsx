import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';

import { t } from '@grafana/i18n';
import { FilterInput } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { type TreeNode } from './types';
import { useScopeActions } from './useScopeActions';

export interface ScopesTreeSearchProps {
  anyChildExpanded: boolean;
  searchArea: string;
  treeNode: TreeNode;
  onFocus: () => void;
  onBlur: () => void;
  'aria-controls': string;
  'aria-activedescendant'?: string;
}

export function ScopesTreeSearch({
  anyChildExpanded,
  treeNode,
  searchArea,
  onFocus,
  onBlur,
  'aria-controls': ariaControls,
  'aria-activedescendant': ariaActivedescendant,
}: ScopesTreeSearchProps) {
  const { filterNode } = useScopeActions();

  const [inputState, setInputState] = useState<{ value: string; dirty: boolean }>({
    value: treeNode.query,
    dirty: false,
  });

  useEffect(() => {
    if (!inputState.dirty && inputState.value !== treeNode.query) {
      setInputState({ value: treeNode.query, dirty: false });
    }
  }, [inputState, treeNode.query]);

  useDebounce(
    () => {
      if (inputState.dirty) {
        filterNode(treeNode.scopeNodeId, inputState.value);
      }
    },
    500,
    [inputState.dirty, inputState.value]
  );

  if (anyChildExpanded) {
    return null;
  }

  const searchLabel = t('scopes.tree.search', 'Search {{parentTitle}}', {
    parentTitle: searchArea,
  });

  return (
    <FilterInput
      placeholder={searchLabel}
      // Don't do autofocus for root node
      autoFocus={treeNode.scopeNodeId !== ''}
      role="combobox"
      aria-expanded={true}
      aria-autocomplete="list"
      aria-controls={ariaControls}
      aria-activedescendant={ariaActivedescendant}
      aria-label={searchLabel}
      value={inputState.value}
      className={stylex.props(styles.input).className}
      data-testid="scopes-tree-search"
      escapeRegex={false}
      onChange={(value) => {
        setInputState({ value, dirty: true });
      }}
      onFocus={onFocus}
      onBlur={() => {
        // TODO:Handle weird race condition where the blur event interupts selection of a radio button. This is because disableHighlighting is called, which forces a re-render of the tree. This re-render causes the radio button to lose focus, and the selection to be interrupted.
        setTimeout(() => {
          onBlur();
        }, 0);
      }}
    />
  );
}

const styles = stylex.create({
  input: {
    marginTop: spacing['--gf-spacing-x1'],
    marginRight: spacing['--gf-spacing-x0'],
    marginBottom: spacing['--gf-spacing-x1'],
    marginLeft: spacing['--gf-spacing-x0'],
    minHeight: spacing['--gf-spacing-x4'],
    height: spacing['--gf-spacing-x4'],
    maxHeight: spacing['--gf-spacing-x4'],
    width: `calc(100% - ${spacing['--gf-spacing-x0-5']})`,
  },
});
