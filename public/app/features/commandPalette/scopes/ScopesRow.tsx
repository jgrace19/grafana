import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';
import { Button, FilterPill, Stack, Text } from '@grafana/ui';
import { colors, typography } from '@grafana/ui/stylex/tokens.stylex';

import { getModKey } from '../../../core/utils/browser';
import { type NodesMap, type ScopesMap, type SelectedScope } from '../../scopes/selector/types';

type Props = {
  selectedScopes: SelectedScope[];
  isDirty: boolean;
  apply: () => void;
  deselectScope: (id: string) => void;
  scopes: ScopesMap;
  nodes: NodesMap;
};

/**
 * Shows scopes that are already selected and applied or the ones user just selected in the palette, with an apply
 * button if the selection is dirty.
 */
export function ScopesRow({ selectedScopes, isDirty, apply, deselectScope, scopes, nodes }: Props) {
  return (
    <>
      <Stack alignItems={'center'}>
        <span {...stylex.props(styles.scopesText)}>
          <Trans i18nKey={'command-palette.scopes.selected-scopes-label'}>Scopes: </Trans>
        </span>
        <Stack wrap={'wrap'}>
          {selectedScopes?.map((scope) => {
            // We need to load scope data when an item is selected, so there may be a delay until we have it. We fallback
            // to node.title if we have it and if not, show just a scopeId. node.title and scope.title should probably be
            // the same, but it's not guaranteed
            const label =
              scopes[scope.scopeId]?.spec.title ||
              (scope.scopeNodeId && nodes[scope.scopeNodeId]?.spec.title) ||
              scope.scopeId;

            return (
              <FilterPill
                key={scope.scopeId}
                selected={true}
                icon={'times'}
                label={label}
                onClick={() => {
                  deselectScope(scope.scopeNodeId || scope.scopeId);
                }}
              />
            );
          })}
        </Stack>
      </Stack>
      {isDirty && (
        <Button
          onClick={() => {
            apply();
          }}
        >
          <Trans i18nKey={'command-palette.scopes.apply-selected-scopes'}>Apply</Trans>&nbsp;
          <Text variant="bodySmall">{`${getModKey()}+↵`}</Text>
        </Button>
      )}
    </>
  );
}

const styles = stylex.create({
  scopesText: {
    fontSize: typography['--gf-typography-body-small-font-size'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    lineHeight: typography['--gf-typography-body-small-line-height'],
    color: colors['--gf-colors-text-secondary'],
  },
});
