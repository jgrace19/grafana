import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { evaluationGroupStyles } from './EvaluationGroup.stylex';
import { type PropsWithChildren } from 'react';

import { Trans, t } from '@grafana/i18n';
import { Badge, Button, Dropdown, Icon, Menu, Stack, Text } from '@grafana/ui';

import { MetaText } from '../../components/MetaText';
import MoreButton from '../../components/MoreButton';
import { Spacer } from '../../components/Spacer';

interface EvaluationGroupProps extends PropsWithChildren {
  name: string;
  interval?: string;
  provenance?: string;
  isOpen?: boolean;
  onToggle: () => void;
}

export const EvaluationGroup = ({
  name,
  provenance,
  interval,
  onToggle,
  isOpen = false,
  children,
}: EvaluationGroupProps) => {

  const isProvisioned = Boolean(provenance);

  return (
    <Stack direction="column" role="treeitem" aria-expanded={isOpen} aria-selected="false" gap={0}>
      <div {...stylex.props(evaluationGroupStyles.headerWrapper)}>
        <Stack direction="row" alignItems="center" gap={1}>
          <button className={cx(evaluationGroupStyles.hiddenButton, evaluationGroupStyles.largerClickTarget)} type="button" onClick={onToggle}>
            <Stack alignItems="center" gap={0.5}>
              <Icon name={isOpen ? 'angle-down' : 'angle-right'} />
              <Text truncate variant="body">
                {name}
              </Text>
            </Stack>
          </button>
          {isProvisioned && (
            <Badge color="purple" text={t('alerting.evaluation-group.text-provisioned', 'Provisioned')} />
          )}
          <Spacer />
          {interval && <MetaText icon="history">{interval}</MetaText>}
          <Button size="sm" icon="pen" variant="secondary" disabled={isProvisioned} data-testid="edit-group-action">
            <Trans i18nKey="common.edit">Edit</Trans>
          </Button>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  label={t('alerting.evaluation-group.label-reorder-rules', 'Re-order rules')}
                  icon="flip"
                  disabled={isProvisioned}
                />
                <Menu.Divider />
                <Menu.Item label={t('alerting.evaluation-group.label-export', 'Export')} icon="download-alt" />
                <Menu.Item
                  label={t('alerting.evaluation-group.label-delete', 'Delete')}
                  icon="trash-alt"
                  destructive
                  disabled={isProvisioned}
                />
              </Menu>
            }
          >
            <MoreButton size="sm" />
          </Dropdown>
        </Stack>
      </div>
      {isOpen && <div role="group">{children}</div>}
    </Stack>
  );
};

