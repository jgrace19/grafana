import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { scopesTreeItemStyles } from './ScopesTreeItem.stylex';
import Highlighter from 'react-highlight-words';

import { Checkbox, Icon, RadioButtonDot, Text } from '@grafana/ui';

import { useScopesServices } from '../ScopesContextProvider';

import { ScopesTree } from './ScopesTree';
import { isNodeExpandable, isNodeSelectable } from './scopesTreeUtils';
import { type NodesMap, type SelectedScope, type TreeNode } from './types';
import { useScopeActions } from './useScopeActions';

// Helper components for rendering different selectable content types
interface RadioButtonDotProps {
  scopeNodeId: string;
  selected: boolean;
  onChange: () => void;
  children?: React.ReactNode;
  'aria-labelledby'?: string;
}

function ScopeRadioButtonDot({
  scopeNodeId,
  selected,
  onChange,
  children,
  'aria-labelledby': ariaLabelledby,
}: RadioButtonDotProps) {
  return (
    <RadioButtonDot
      id={scopeNodeId}
      name={scopeNodeId}
      checked={selected}
      label={children ?? undefined}
      data-testid={`scopes-tree-${scopeNodeId}-radio`}
      onChange={onChange}
      aria-labelledby={ariaLabelledby ?? undefined}
    />
  );
}

interface LinkLikeButtonProps {
  scopeNodeId: string;
  onClick: () => void;
  children: React.ReactNode;
}

function ScopeLinkLikeButton({ scopeNodeId, onClick, children }: LinkLikeButtonProps) {
  return (
    <button {...stylex.props(scopesTreeItemStyles.linkLikeItem)} data-testid={`scopes-tree-${scopeNodeId}-link`} onClick={onClick}>
      {children}
    </button>
  );
}

interface CheckboxWithLabelProps {
  scopeNodeId: string;
  selected: boolean;
  showLabel: boolean;
  onChange: () => void;
  children?: React.ReactNode;
  'aria-labelledby'?: string;
}

function ScopeCheckboxWithLabel({
  scopeNodeId,
  selected,
  showLabel,
  onChange,
  children,
  'aria-labelledby': ariaLabelledby,
}: CheckboxWithLabelProps) {
  return (
    <div {...stylex.props(scopesTreeItemStyles.checkboxWithLabel)}>
      <Checkbox
        id={scopeNodeId}
        checked={selected}
        data-testid={`scopes-tree-${scopeNodeId}-checkbox`}
        label=""
        onChange={onChange}
        aria-labelledby={ariaLabelledby ?? undefined}
      />
      {showLabel && (
        <label htmlFor={scopeNodeId} {...stylex.props(scopesTreeItemStyles.checkboxLabel)}>
          {children}
        </label>
      )}
    </div>
  );
}

interface TitleContentProps {
  shouldHighlight: boolean;
  titleText: string;
  searchWords: string[];
}

function TitleContent({ shouldHighlight, titleText, searchWords }: TitleContentProps) {
  if (shouldHighlight) {
    return <Highlighter textToHighlight={titleText} searchWords={searchWords} autoEscape />;
  }
  return <>{titleText}</>;
}

interface ExpandButtonProps {
  scopeNodeId: string;
  expanded: boolean;
  onClick: () => void;
  children: React.ReactNode;
  controlsId: string;
  isSelectable: boolean;
  disableMultiSelect: boolean;
  selected: boolean;
  onSelect: () => void;
}

function ScopeExpandButton({
  scopeNodeId,
  expanded,
  onClick,
  children,
  controlsId,
  isSelectable,
  disableMultiSelect,
  selected,
  onSelect,
}: ExpandButtonProps) {

  const buttonId = getTreeItemElementId(scopeNodeId) + '-button';

  const SelectComponent = () => {
    if (!isSelectable || expanded) {
      return null;
    }
    if (disableMultiSelect) {
      return (
        <ScopeRadioButtonDot
          scopeNodeId={scopeNodeId}
          selected={selected}
          onChange={onSelect}
          aria-labelledby={buttonId}
        />
      );
    }
    return (
      <ScopeCheckboxWithLabel
        scopeNodeId={scopeNodeId}
        selected={selected}
        showLabel={false}
        onChange={onSelect}
        aria-labelledby={buttonId}
      />
    );
  };
  return (
    <>
      <SelectComponent />
      <button
        id={buttonId}
        {...stylex.props(scopesTreeItemStyles.expand)}
        data-testid={`scopes-tree-${scopeNodeId}-expand`}
        onClick={onClick}
        aria-expanded={expanded}
        aria-controls={controlsId}
      >
        <Icon name={!expanded ? 'angle-right' : 'angle-down'} />
        {children}
      </button>
    </>
  );
}

export interface ScopesTreeItemProps {
  anyChildExpanded: boolean;
  loadingNodeName: string | undefined;
  treeNode: TreeNode;
  scopeNodes: NodesMap;
  selected: boolean;
  selectedScopes: SelectedScope[];
  highlighted: boolean;
}

export function ScopesTreeItem({
  anyChildExpanded,
  loadingNodeName,
  treeNode,
  scopeNodes,
  selected,
  selectedScopes,
  highlighted,
}: ScopesTreeItemProps) {
  const { selectScope, deselectScope, toggleExpandedNode } = useScopeActions();
  const services = useScopesServices();
  const { closeAndApply } = services?.scopesSelectorService || {};
  if (anyChildExpanded && !treeNode.expanded) {
    return null;
  }

  const scopeNode = scopeNodes[treeNode.scopeNodeId];
  if (!scopeNode) {
    // Should not happen as only way we show a tree is if we also load the nodes.
    return null;
  }

  const parentNode = scopeNode.spec.parentName ? scopeNodes[scopeNode.spec.parentName] : undefined;
  const disableMultiSelect = parentNode?.spec.disableMultiSelect ?? false;

  const isSelectable = isNodeSelectable(scopeNode);
  const isExpandable = isNodeExpandable(scopeNode);

  // Create search words for highlighting if there's a query
  // Only highlight if we have a query AND this node is not expanded (not a parent showing children)
  const titleText = scopeNode.spec.title;
  const shouldHighlight = Boolean(treeNode.query && !treeNode.expanded);
  const searchWords = shouldHighlight ? getSearchWordsFromQuery(treeNode.query) : [];

  const childrenId = getTreeItemElementId(treeNode.scopeNodeId) + '-children';

  return (
    <div
      key={treeNode.scopeNodeId}
      id={getTreeItemElementId(treeNode.scopeNodeId)}
      role="treeitem"
      // aria-selected refers to the highlighted item in the tree, not the selected checkbox/radio button
      aria-selected={highlighted}
      aria-expanded={isExpandable ? treeNode.expanded : undefined}
      className={anyChildExpanded ? scopesTreeItemStyles.expandedContainer : undefined}
    >
      <div
        {...mergeStylexClassName(stylex.props(scopesTreeItemStyles.highlighted, 
          scopesTreeItemStyles.title,
          isSelectable && !treeNode.expanded && scopesTreeItemStyles.titlePadding,
          highlighted && 
        ), undefined)}
        data-testid={`scopes-tree-${treeNode.scopeNodeId}`}
      >
        {isSelectable && !isExpandable && !treeNode.expanded && (
          <>
            {disableMultiSelect && (
              <ScopeLinkLikeButton
                scopeNodeId={treeNode.scopeNodeId}
                onClick={() => {
                  selectScope(treeNode.scopeNodeId);
                  closeAndApply?.();
                }}
              >
                <TitleContent shouldHighlight={shouldHighlight} titleText={titleText} searchWords={searchWords} />
              </ScopeLinkLikeButton>
            )}
            {!disableMultiSelect && (
              <ScopeCheckboxWithLabel
                scopeNodeId={treeNode.scopeNodeId}
                selected={selected}
                showLabel={!isExpandable}
                onChange={() => {
                  selected ? deselectScope(treeNode.scopeNodeId) : selectScope(treeNode.scopeNodeId);
                }}
              >
                <TitleContent shouldHighlight={shouldHighlight} titleText={titleText} searchWords={searchWords} />
              </ScopeCheckboxWithLabel>
            )}
          </>
        )}

        {isExpandable && (
          <ScopeExpandButton
            scopeNodeId={treeNode.scopeNodeId}
            expanded={treeNode.expanded}
            controlsId={childrenId}
            onClick={() => toggleExpandedNode(treeNode.scopeNodeId)}
            onSelect={() => (selected ? deselectScope(treeNode.scopeNodeId) : selectScope(treeNode.scopeNodeId))}
            isSelectable={isSelectable}
            disableMultiSelect={disableMultiSelect}
            selected={selected}
          >
            <TitleContent shouldHighlight={shouldHighlight} titleText={titleText} searchWords={searchWords} />
          </ScopeExpandButton>
        )}

        {scopeNode.spec.subTitle && (
          <Text truncate variant="body" color="secondary">
            {scopeNode.spec.subTitle}
          </Text>
        )}
      </div>

      <div id={childrenId} {...stylex.props(scopesTreeItemStyles.children)}>
        {treeNode.expanded && (
          <ScopesTree
            tree={treeNode}
            loadingNodeName={loadingNodeName}
            scopeNodes={scopeNodes}
            selectedScopes={selectedScopes}
          />
        )}
      </div>
    </div>
  );
}

// Convert a query string with wildcards into search words for react-highlight-words
function getSearchWordsFromQuery(query: string): string[] {
  if (!query) {
    return [];
  }
  // Split query string on wildcard and filter out empty parts
  return query.split('*').filter((part) => part.length > 0);
}

export const getTreeItemElementId = (scopeNodeId?: string) => {
  return scopeNodeId ? `scopes-tree-item-${scopeNodeId}` : undefined;
};

;
