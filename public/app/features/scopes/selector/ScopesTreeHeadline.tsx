import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { type NodesMap, type TreeNode } from './types';

export interface ScopesTreeHeadlineProps {
  anyChildExpanded: boolean;
  query: string;
  resultsNodes: TreeNode[];
  scopeNodes: NodesMap;
}

export function ScopesTreeHeadline({ anyChildExpanded, query, resultsNodes, scopeNodes }: ScopesTreeHeadlineProps) {
  if (
    anyChildExpanded ||
    (resultsNodes.some((n) => scopeNodes[n.scopeNodeId]?.spec.nodeType === 'container') && !query)
  ) {
    return null;
  }

  return (
    <h6 {...stylex.props(styles.container)} data-testid="scopes-tree-headline">
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

const styles = stylex.create({
  container: {
    color: colors['--gf-colors-text-secondary'],
    marginTop: spacing['--gf-spacing-x1'],
    marginRight: spacing['--gf-spacing-x0'],
    marginBottom: spacing['--gf-spacing-x1'],
    marginLeft: spacing['--gf-spacing-x0'],
  },
});
