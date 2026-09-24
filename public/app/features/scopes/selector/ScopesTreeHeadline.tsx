
import { Trans } from '@grafana/i18n';
import { } from '@grafana/ui';

import { type NodesMap, type TreeNode } from './types';

export interface ScopesTreeHeadlineProps {
  anyChildExpanded: boolean;
  query: string;
  resultsNodes: TreeNode[];
  scopeNodes: NodesMap;
}

export function ScopesTreeHeadline({ anyChildExpanded, query, resultsNodes, scopeNodes }: ScopesTreeHeadlineProps) {
  const styles = (getStyles);

  if (
    anyChildExpanded ||
    (resultsNodes.some((n) => scopeNodes[n.scopeNodeId]?.spec.nodeType === 'container') && !query)
  ) {
    return null;
  }

  return (
    <h6 {...stylex.props(scopesTreeHeadlineStyles.container)} data-testid="scopes-tree-headline">
      {!query ? (
        <Trans i18nKey="scopes.tree.headline.recommended">Recommended</Trans>
      ) : resultsNodes.length === 0 ? (
        <Trans i18nKey="scopes.tree.headline.noResults">No results found for your query</Trans>
      ) : (
        <Trans i18nKey="scopes.tree.headline.results">Results</Trans>
      )}
    </h6>
  );
}

;
