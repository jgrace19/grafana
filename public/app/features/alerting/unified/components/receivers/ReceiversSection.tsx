import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import { useToggle } from 'react-use';

import { Trans, t } from '@grafana/i18n';
import { Button, Dropdown, Icon, Menu, MenuItem, Stack } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors } from '@grafana/ui/stylex/tokens.stylex';

import { GrafanaReceiversExporter } from '../export/GrafanaReceiversExporter';

interface Props {
  title: string;
  description: string;
  addButtonLabel: string;
  addButtonTo: string;
  className?: string;
  showButton?: boolean;
  canReadSecrets?: boolean;
  showExport?: boolean;
}

export const ReceiversSection = ({
  className,
  title,
  description,
  addButtonLabel,
  addButtonTo,
  children,
  showButton = true,
  canReadSecrets = false,
  showExport = false,
}: React.PropsWithChildren<Props>) => {
  const showMore = showExport;
  const [showExportDrawer, toggleShowExportDrawer] = useToggle(false);

  const newMenu = (
    <Menu>
      {showExport && (
        <MenuItem
          onClick={toggleShowExportDrawer}
          label={t('alerting.receivers-section.new-menu.label-export-all', 'Export all')}
        />
      )}
    </Menu>
  );

  return (
    <Stack direction="column" gap={2}>
      <div {...mergeStylexProps(stylex.props(styles.heading), { className })}>
        <div>
          <h4>{title}</h4>
          <div {...stylex.props(styles.description)}>{description}</div>
        </div>
        <Stack direction="row" gap={0.5}>
          {showButton && (
            <Link to={addButtonTo}>
              <Button type="button" icon="plus">
                {addButtonLabel}
              </Button>
            </Link>
          )}
          {showMore && (
            <Dropdown overlay={newMenu}>
              <Button variant="secondary">
                <Trans i18nKey="alerting.receivers-section.button-more">More</Trans>
                <Icon name="angle-down" />
              </Button>
            </Dropdown>
          )}
        </Stack>
      </div>
      {children}
      {showExportDrawer && <GrafanaReceiversExporter decrypt={canReadSecrets} onClose={toggleShowExportDrawer} />}
    </Stack>
  );
};

const styles = stylex.create({
  heading: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  description: {
    color: colors['--gf-colors-text-secondary'],
  },
});
