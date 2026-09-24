import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { recentScopesStyles } from './RecentScopes.stylex';
import { useId, useState } from 'react';

import { Trans } from '@grafana/i18n';
import { Stack, Text, Icon, Box } from '@grafana/ui';

import { type RecentScope } from './types';

interface RecentScopesProps {
  recentScopes: RecentScope[][];
  onSelect: (scopeIds: string[], parentNodeId?: string, scopeNodeId?: string) => void;
}

export const RecentScopes = ({ recentScopes, onSelect }: RecentScopesProps) => {
  const [expanded, setExpanded] = useState(false);

  const contentId = useId();
  return (
    <fieldset>
      <legend {...stylex.props(recentScopesStyles.legend)}>
        <button
          {...stylex.props(recentScopesStyles.expandButton)}
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={() => setExpanded(!expanded)}
          data-testid="scopes-selector-recent-scopes-section"
        >
          <Icon name={expanded ? 'angle-down' : 'angle-right'} />
          <Text variant="body">
            <Trans i18nKey="command-palette.section.recent-scopes">Recent scopes</Trans>
          </Text>
        </button>
      </legend>
      <Box paddingLeft={3} paddingTop={expanded ? 1 : 0} paddingBottom={expanded ? 1 : 0}>
        <Stack direction="column" gap={1} id={contentId}>
          {expanded &&
            recentScopes.map((recentScopeSet) => (
              <button
                {...stylex.props(recentScopesStyles.recentScopeButton)}
                key={
                  recentScopeSet.map((s) => s.metadata.name).join(',') + recentScopeSet[0]?.parentNode?.metadata?.name
                }
                onClick={() => {
                  onSelect(
                    recentScopeSet.map((s) => s.metadata.name),
                    recentScopeSet[0]?.parentNode?.metadata?.name,
                    recentScopeSet[0]?.scopeNodeId
                  );
                }}
              >
                <Text truncate>{recentScopeSet.map((s) => s.spec.title).join(', ')}</Text>
                {recentScopeSet[0]?.parentNode?.spec.title && (
                  <Text truncate variant="body" color="secondary">
                    {recentScopeSet[0]?.parentNode?.spec.title}
                  </Text>
                )}
              </button>
            ))}
        </Stack>
      </Box>
    </fieldset>
  );
};

