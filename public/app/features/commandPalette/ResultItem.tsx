import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { resultItemStyles } from './ResultItem.stylex';
import { type ActionId, type ActionImpl } from 'kbar';
import * as React from 'react';

import { t } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { Badge } from '@grafana/ui';
import { ManagerKind } from 'app/features/apiserver/types';

export const ResultItem = React.forwardRef(
  (
    {
      action,
      active,
      currentRootActionId,
    }: {
      action: ActionImpl;
      active: boolean;
      currentRootActionId: ActionId;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    const ancestors = React.useMemo(() => {
      if (!currentRootActionId) {
        return action.ancestors;
      }

      const index = action.ancestors.findIndex((ancestor) => ancestor.id === currentRootActionId);
      // +1 removes the currentRootAction; e.g.
      // if we are on the "Set theme" parent action,
      // the UI should not display "Set theme… > Dark"
      // but rather just "Dark"
      return action.ancestors.slice(index + 1);
    }, [action.ancestors, currentRootActionId]);

    const styles = (getResultItemStyles);

    // type assertion needed because kbar's ActionImpl copies all properties from the input Action object at runtime,
    // but its TS type doesn't reflect custom properties like managedBy or url.
    // See the same pattern for `url` in KBarResults.tsx and below command url
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const managedBy = (action as ActionImpl & { managedBy?: ManagerKind }).managedBy;
    const showProvisionedBadge = config.featureToggles.provisioning && managedBy === ManagerKind.Repo;

    let name = action.name;

    const hasCommandOrLink = (action: ActionImpl) =>
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      Boolean(action.command?.perform || (action as ActionImpl & { url?: string }).url);

    // TODO: does this needs adjusting for i18n?
    if (action.children.length && !hasCommandOrLink(action) && !name.endsWith('...')) {
      name += '...';
    }

    return (
      <div ref={ref} {...mergeStylexClassName(stylex.props(resultItemStyles.row, active && resultItemStyles.activeRow), undefined)}>
        <div {...stylex.props(resultItemStyles.actionContainer)}>
          {action.icon}
          <div {...stylex.props(resultItemStyles.textContainer)}>
            {ancestors.map((ancestor) => (
              <React.Fragment key={ancestor.id}>
                {!hasCommandOrLink(ancestor) && (
                  <>
                    <span {...stylex.props(resultItemStyles.breadcrumbAncestor)}>{ancestor.name}</span>
                    <span {...stylex.props(resultItemStyles.breadcrumbSeparator)}>&rsaquo;</span>
                  </>
                )}
              </React.Fragment>
            ))}
            <span>{name}</span>
          </div>
          {action.subtitle && <span {...stylex.props(resultItemStyles.subtitleText)}>{action.subtitle}</span>}
          {showProvisionedBadge && (
            <Badge
              color="purple"
              icon="exchange-alt"
              aria-label={t('command-palette.badge.provisioned', 'Provisioned')}
              tooltip={t('command-palette.badge.provisioned', 'Provisioned')}
            />
          )}
        </div>
      </div>
    );
  }
);

ResultItem.displayName = 'ResultItem';

;
