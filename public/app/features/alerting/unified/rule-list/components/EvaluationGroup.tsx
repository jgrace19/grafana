import * as stylex from '@stylexjs/stylex';
import { type PropsWithChildren } from 'react';

import { Trans, t } from '@grafana/i18n';
import { Badge, Button, Dropdown, Icon, Menu, Stack, Text } from '@grafana/ui';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

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
      <div {...stylex.props(styles.headerWrapper)}>
        <Stack direction="row" alignItems="center" gap={1}>
          <button {...stylex.props(styles.hiddenButton, styles.largerClickTarget)} type="button" onClick={onToggle}>
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

const styles = stylex.create({
  headerWrapper: {
    padding: spacing['--gf-spacing-x1'],

    backgroundColor: colors['--gf-colors-background-secondary'],

    borderStyle: 'none',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
    borderTopLeftRadius: shape['--gf-shape-radius-default'],
    borderTopRightRadius: shape['--gf-shape-radius-default'],
  },
  hiddenButton: {
    borderStyle: 'none',
    backgroundColor: 'transparent',
  },
  largerClickTarget: {
    padding: spacing['--gf-spacing-x0-5'],
    margin: `calc(${spacing['--gf-spacing-grid-size']} * -0.5)`,
  },
});
