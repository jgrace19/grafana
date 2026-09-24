import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { provisionedControlsSectionStyles } from './ProvisionedControlsSection.stylex';
import classNames from 'classnames';
import { type ReactNode, useMemo, useState } from 'react';

import { Trans, t } from '@grafana/i18n';
import { getDataSourceSrv } from '@grafana/runtime';
import { type ControlSourceRef } from '@grafana/schema/apis/dashboard.grafana.app/v2';
import {CollapsableSection, Icon, Stack, Text, Tooltip} from '@grafana/ui';

type Column = {
  i18nKey: string;
  defaultText: string;
};

type Props = {
  columns: Column[];
  children: ReactNode;
};

export function ProvisionedControlsSection({ columns, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <div {...stylex.props(provisionedControlsSectionStyles.container)}>
      <CollapsableSection label={<ProvisionedControlsSectionLabel />} isOpen={isOpen} onToggle={setIsOpen}>
        <table className={classNames('filter-table', 'filter-table--hover', provisionedControlsSectionStyles.table)} role="grid">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.i18nKey}>
                  <Trans i18nKey={col.i18nKey}>{col.defaultText}</Trans>
                </th>
              ))}
              <th {...stylex.props(provisionedControlsSectionStyles.thNarrow)} />
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </CollapsableSection>
    </div>
  );
}

function ProvisionedControlsSectionLabel() {


  return (
    <Stack direction="row" gap={1} alignItems="center">
      <Icon name="database" {...stylex.props(provisionedControlsSectionStyles.iconMuted)} />
      <Text variant="h5">
        <Trans i18nKey="dashboard-scene.provisioned-controls-section.label">Provisioned by data source</Trans>
      </Text>
    </Stack>
  );
}

export function SourceIcon({ origin }: { origin: ControlSourceRef | undefined }) {

  const pluginName = usePluginName(origin);

  return (
    <Tooltip content={getSourceTooltip(pluginName)}>
      <Icon name="database" {...stylex.props(provisionedControlsSectionStyles.iconMuted)} aria-hidden />
    </Tooltip>
  );
}

function getSourceTooltip(pluginName: string | undefined): string {
  if (pluginName) {
    return t('dashboard-scene.provisioned-controls-section.tooltip', 'Added by the {{pluginName}} plugin', {
      pluginName,
    });
  }
  return t('dashboard-scene.provisioned-controls-section.tooltip-unknown', 'Added by a data source plugin');
}

function usePluginName(origin: ControlSourceRef | undefined): string | undefined {
  return useMemo(() => {
    if (!origin?.group) {
      return undefined;
    }

    const list = getDataSourceSrv().getList({});
    const ds = list.find((d) => d.meta.id === origin.group);
    return ds?.meta.name ?? origin.group;
  }, [origin?.group]);
}

