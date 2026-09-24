import * as stylex from '@stylexjs/stylex';
import { type ActionId, type ActionImpl } from 'kbar';
import * as React from 'react';

import { t } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { Badge, useTheme2 } from '@grafana/ui';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
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

    const theme = useTheme2();

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
      <div
        ref={ref}
        {...stylex.props(
          styles.row,
          active && styles.activeRow,
          active && styles.activeRowBackground(theme.colors.emphasize(theme.colors.background.primary, 0.03))
        )}
      >
        <div {...stylex.props(styles.actionContainer)}>
          {action.icon}
          <div {...stylex.props(styles.textContainer)}>
            {ancestors.map((ancestor) => (
              <React.Fragment key={ancestor.id}>
                {!hasCommandOrLink(ancestor) && (
                  <>
                    <span {...stylex.props(styles.breadcrumbAncestor)}>{ancestor.name}</span>
                    <span {...stylex.props(styles.breadcrumbSeparator)}>&rsaquo;</span>
                  </>
                )}
              </React.Fragment>
            ))}
            <span>{name}</span>
          </div>
          {action.subtitle && <span {...stylex.props(styles.subtitleText)}>{action.subtitle}</span>}
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

const styles = stylex.create({
  row: {
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x2'],
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer',
    position: 'relative',
    borderRadius: shape['--gf-shape-radius-default'],
    marginTop: 0,
    marginRight: spacing['--gf-spacing-x1'],
    marginBottom: 0,
    marginLeft: spacing['--gf-spacing-x1'],
  },
  activeRow: {
    color: colors['--gf-colors-text-max-contrast'],
    '::before': {
      display: 'block',
      content: '" "',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: spacing['--gf-spacing-x0-5'],
      borderRadius: shape['--gf-shape-radius-default'],
      backgroundImage: colors['--gf-colors-gradients-brand-vertical'],
    },
  },
  activeRowBackground: (backgroundColor: string) => ({
    backgroundColor,
  }),
  actionContainer: {
    display: 'flex',
    gap: spacing['--gf-spacing-x1'],
    alignItems: 'baseline',
    fontSize: typography['--gf-typography-font-size'],
    width: '100%',
  },
  textContainer: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  breadcrumbAncestor: {
    color: colors['--gf-colors-text-secondary'],
  },
  breadcrumbSeparator: {
    color: colors['--gf-colors-text-secondary'],
    marginLeft: spacing['--gf-spacing-x1'],
    marginRight: spacing['--gf-spacing-x1'],
  },
  subtitleText: {
    fontFamily: typography['--gf-typography-body-small-font-family'],
    fontWeight: typography['--gf-typography-body-small-font-weight'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    lineHeight: typography['--gf-typography-body-small-line-height'],
    letterSpacing: typography['--gf-typography-body-small-letter-spacing'],
    color: colors['--gf-colors-text-secondary'],
    display: 'block',
    flexBasis: '20%',
    flexGrow: 1,
    flexShrink: 0,
    maxWidth: 'fit-content',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});
