import * as stylex from '@stylexjs/stylex';
import React, { useEffect, useState } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { Badge, Icon, Spinner, Stack, Tooltip } from '@grafana/ui';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { colors, components, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { type CombinedRuleGroup, type CombinedRuleNamespace, type RulesSource } from 'app/types/unified-alerting';

import { useFolder } from '../../hooks/useFolder';
import { useHasRuler } from '../../hooks/useHasRuler';
import { useRulesAccess } from '../../utils/accessControlHooks';
import { GRAFANA_RULES_SOURCE_NAME, getRulesSourceName, isCloudRulesSource } from '../../utils/datasource';
import { makeFolderLink } from '../../utils/misc';
import { groups } from '../../utils/navigation';
import { isFederatedRuleGroup, isPluginProvidedRule, isUngroupedRuleGroup, rulerRuleType } from '../../utils/rules';
import { CollapseToggle } from '../CollapseToggle';
import { RuleLocation } from '../RuleLocation';
import { GrafanaRuleFolderExporter } from '../export/GrafanaRuleFolderExporter';
import { decodeGrafanaNamespace } from '../expressions/util';
import { FolderActionsButton } from '../folder-actions/FolderActionsButton';

import { ActionIcon } from './ActionIcon';
import { RuleGroupStats } from './RuleStats';
import { RulesTable, useIsRulesLoading } from './RulesTable';

type ViewMode = 'grouped' | 'list';

interface Props {
  namespace: CombinedRuleNamespace;
  group: CombinedRuleGroup;
  expandAll: boolean;
  viewMode: ViewMode;
}

export const RulesGroup = React.memo(({ group, namespace, expandAll, viewMode }: Props) => {
  const { rulesSource } = namespace;
  const rulesSourceName = getRulesSourceName(rulesSource);
  const rulerRulesLoaded = useIsRulesLoading(rulesSource);

  const [isExporting, setIsExporting] = useState<'folder' | undefined>(undefined);
  const [isCollapsed, setIsCollapsed] = useState(!expandAll);

  useEffect(() => {
    setIsCollapsed(!expandAll);
  }, [expandAll]);

  const { hasRuler } = useHasRuler(namespace.rulesSource);

  const rulerRule = group.rules[0]?.rulerRule;
  const folderUID =
    (rulerRule && rulerRuleType.grafana.rule(rulerRule) && rulerRule.grafana_alert.namespace_uid) || undefined;
  const { folder } = useFolder(folderUID);

  const { canEditRules } = useRulesAccess();

  // group "is deleting" if rules source has ruler, but this group has no rules that are in ruler
  const isDeleting = hasRuler && rulerRulesLoaded && !group.rules.find((rule) => !!rule.rulerRule);
  const isFederated = isFederatedRuleGroup(group);

  // check if group has provisioned items
  const isProvisioned = group.rules.some((rule) => {
    return rulerRuleType.grafana.rule(rule.rulerRule) && rule.rulerRule.grafana_alert.provenance;
  });
  const isPluginProvided = group.rules.some((rule) => isPluginProvidedRule(rule.rulerRule ?? rule.promRule));

  const canEditGroup = hasRuler && !isProvisioned && !isFederated && !isPluginProvided && canEditRules(rulesSourceName);

  // check what view mode we are in
  const isListView = viewMode === 'list';
  const isGroupView = viewMode === 'grouped';

  const actionIcons: React.ReactNode[] = [];

  // for grafana, link to folder views
  if (isDeleting) {
    actionIcons.push(
      <Stack key="is-deleting">
        <Spinner />
        <Trans i18nKey="alerting.rules-group.deleting">Deleting</Trans>
      </Stack>
    );
  } else if (rulesSource === GRAFANA_RULES_SOURCE_NAME) {
    if (folderUID) {
      const baseUrl = makeFolderLink(folderUID);
      if (isGroupView) {
        actionIcons.push(
          <ActionIcon
            aria-label={t('alerting.rule-group-action.details', 'rule group details')}
            key="rule-group-details"
            icon="info-circle"
            tooltip={t('alerting.rule-group-action.details', 'rule group details')}
            to={groups.detailsPageLink('grafana', folderUID, group.name, { includeReturnTo: true })}
          />
        );
        if (folder?.canSave && canEditGroup) {
          actionIcons.push(
            <ActionIcon
              aria-label={t('alerting.rule-group-action.edit', 'edit rule group')}
              key="rule-group-edit"
              icon="pen"
              tooltip={t('alerting.rule-group-action.edit', 'edit rule group')}
              to={groups.editPageLink('grafana', folderUID, group.name, { includeReturnTo: true })}
            />
          );
        }
      }
      if (folder?.canSave) {
        if (isListView) {
          actionIcons.push(
            <ActionIcon
              aria-label={t('alerting.rule-group-action.go-to-folder', 'go to folder')}
              key="goto"
              icon="folder-open"
              tooltip={t('alerting.rule-group-action.go-to-folder', 'go to folder')}
              to={baseUrl}
              target="__blank"
            />
          );

          if (folder?.canAdmin) {
            actionIcons.push(
              <ActionIcon
                aria-label={t('alerting.rule-group-action.manage-permissions', 'manage permissions')}
                key="manage-perms"
                icon="lock"
                tooltip={t('alerting.rule-group-action.manage-permissions', 'manage permissions')}
                to={baseUrl + '/permissions'}
                target="__blank"
              />
            );
          }
        }
      }
      if (folder) {
        if (isListView) {
          actionIcons.push(<FolderActionsButton folderUID={folderUID} key="folder-bulk-actions" />);
        }
      }
    }
  } else {
    actionIcons.push(
      <ActionIcon
        aria-label={t('alerting.rule-group-action.details', 'rule group details')}
        key="rule-group-details"
        icon="info-circle"
        tooltip={t('alerting.rule-group-action.details', 'rule group details')}
        to={groups.detailsPageLink(rulesSource.uid, namespace.name, group.name, { includeReturnTo: true })}
      />
    );
    if (canEditGroup) {
      actionIcons.push(
        <ActionIcon
          aria-label={t('alerting.rule-group-action.edit', 'edit rule group')}
          key="rule-group-edit"
          icon="pen"
          tooltip={t('alerting.rule-group-action.edit', 'edit rule group')}
          to={groups.editPageLink(rulesSource.uid, namespace.name, group.name, { includeReturnTo: true })}
        />
      );
    }
  }

  // ungrouped rules are rules that are in the "default" group name
  let groupName = <RuleLocation namespace={decodeGrafanaNamespace(namespace).name} group={group.name} />;
  if (isListView) {
    groupName = <RuleLocation namespace={decodeGrafanaNamespace(namespace).name} />;
  } else if (isUngroupedRuleGroup(group.name)) {
    const firstRuleName = group.rules[0]?.name ?? t('alerting.rules-group.unknown-rule', 'Unknown Rule');
    const groupDisplayName = t('alerting.rules-group.ungrouped-suffix', '{{ruleName}} (Ungrouped)', {
      ruleName: firstRuleName,
    });
    groupName = <RuleLocation namespace={decodeGrafanaNamespace(namespace).name} group={groupDisplayName} />;
  }

  return (
    <div data-testid="rule-group">
      <div {...stylex.props(styles.header)} data-testid="rule-group-header">
        <CollapseToggle
          size="sm"
          style={collapseToggleStyle}
          isCollapsed={isCollapsed}
          onToggle={setIsCollapsed}
          data-testid={selectors.components.AlertRules.groupToggle}
        />
        <FolderIcon isCollapsed={isCollapsed} />
        <CloudSourceLogo rulesSource={rulesSource} />
        {
          // eslint-disable-next-line
          <div {...stylex.props(styles.groupName)} onClick={() => setIsCollapsed(!isCollapsed)}>
            {isFederated && <Badge color="purple" text={t('alerting.rules-group.text-federated', 'Federated')} />}{' '}
            {groupName}
          </div>
        }
        <div {...stylex.props(styles.spacer)} />
        <div {...stylex.props(styles.headerStats)}>
          <RuleGroupStats group={group} />
        </div>
        {isProvisioned && (
          <>
            <div {...stylex.props(styles.actionsSeparator)}>|</div>
            <div {...stylex.props(styles.actionIcons)}>
              <Badge color="purple" text={t('alerting.rules-group.text-provisioned', 'Provisioned')} />
            </div>
          </>
        )}
        {!!actionIcons.length && (
          <>
            <div {...stylex.props(styles.actionsSeparator)}>|</div>
            <div {...stylex.props(styles.actionIcons)}>
              <Stack gap={0.5}>{actionIcons}</Stack>
            </div>
          </>
        )}
      </div>
      {!isCollapsed && (
        <RulesTable
          showSummaryColumn={true}
          xstyle={styles.rulesTable}
          showGuidelines={true}
          showNextEvaluationColumn={Boolean(group.interval)}
          rules={group.rules}
        />
      )}
      {folder && isExporting === 'folder' && (
        <GrafanaRuleFolderExporter folder={folder} onClose={() => setIsExporting(undefined)} />
      )}
    </div>
  );
});

RulesGroup.displayName = 'RulesGroup';

// It's a simple component but we render 80 of them on the list page it needs to be fast
// The Tooltip component is expensive to render and the rulesSource doesn't change often
// so memoization seems to bring a lot of benefit here
const CloudSourceLogo = React.memo(({ rulesSource }: { rulesSource: RulesSource | string }) => {
  if (isCloudRulesSource(rulesSource)) {
    return (
      <Tooltip content={rulesSource.name} placement="top">
        <img
          alt={rulesSource.meta.name}
          {...stylex.props(styles.dataSourceIcon)}
          src={rulesSource.meta.info.logos.small}
        />
      </Tooltip>
    );
  }

  return null;
});

CloudSourceLogo.displayName = 'CloudSourceLogo';

// We render a lot of these on the list page, and the Icon component does quite a bit of work
// to render its contents
const FolderIcon = React.memo(({ isCollapsed }: { isCollapsed: boolean }) => {
  return <Icon name={isCollapsed ? 'folder' : 'folder-open'} />;
});

FolderIcon.displayName = 'FolderIcon';

const styles = stylex.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: 0,
    flexWrap: 'nowrap',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
    backgroundColor: {
      default: null,
      ':hover': components['--gf-components-table-row-hover-background'],
    },
  },
  headerStats: {
    flexShrink: 0,
    order: { default: null, [bp.smDown]: 2 },
    width: { default: null, [bp.smDown]: '100%' },
    paddingLeft: { default: null, [bp.smDown]: spacing['--gf-spacing-x1'] },
  },
  groupName: {
    marginLeft: spacing['--gf-spacing-x1'],
    marginBottom: 0,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  spacer: {
    flex: '1',
  },
  dataSourceIcon: {
    width: spacing['--gf-spacing-x2'],
    height: spacing['--gf-spacing-x2'],
    marginLeft: spacing['--gf-spacing-x2'],
  },
  actionsSeparator: {
    marginTop: 0,
    marginRight: spacing['--gf-spacing-x2'],
    marginBottom: 0,
    marginLeft: spacing['--gf-spacing-x2'],
  },
  actionIcons: {
    width: '120px',
    alignItems: 'center',
    flexShrink: 0,
  },
  rulesTable: {
    marginTop: spacing['--gf-spacing-x2'],
    marginRight: 0,
    marginBottom: spacing['--gf-spacing-x2'],
    marginLeft: 0,
  },
});

// CollapseToggle's Button has no xstyle, and this override must also win in its :hover state.
const collapseToggleStyle = {
  background: 'none',
  border: 'none',
  marginTop: `calc(${spacing['--gf-spacing-x1']} * -1)`,
  marginBottom: `calc(${spacing['--gf-spacing-x1']} * -1)`,
};
