import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import {
  type DataSourceJsonData,
  type DataSourcePluginOptionsEditorProps,
  type GrafanaTheme2,
  updateDatasourcePluginJsonDataOption,
} from '@grafana/data';
import { ConfigDescriptionLink, ConfigSubSection } from '@grafana/plugin-ui';
import { InlineField, InlineFieldRow, InlineSwitch } from '@grafana/ui';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { o11yInfoTextStyles } from '../o11ySettings.stylex';

export interface NodeGraphOptions {
  enabled?: boolean;
}

export interface NodeGraphData extends DataSourceJsonData {
  nodeGraph?: NodeGraphOptions;
}

interface Props extends DataSourcePluginOptionsEditorProps<NodeGraphData> {}

export function NodeGraphSettings({ options, onOptionsChange }: Props) {
  const rowClassName = mergeStylexClassName(stylex.props(o11yInfoTextStyles.row)).className;

  return (
    <div {...stylex.props(o11yInfoTextStyles.container)}>
      <InlineFieldRow className={rowClassName}>
        <InlineField
          tooltip="Displays the node graph above the trace view. Default: disabled"
          label="Enable node graph"
          labelWidth={26}
        >
          <InlineSwitch
            id="enableNodeGraph"
            value={options.jsonData.nodeGraph?.enabled}
            onChange={(event: React.SyntheticEvent<HTMLInputElement>) =>
              updateDatasourcePluginJsonDataOption({ onOptionsChange, options }, 'nodeGraph', {
                ...options.jsonData.nodeGraph,
                enabled: event.currentTarget.checked,
              })
            }
          />
        </InlineField>
      </InlineFieldRow>
    </div>
  );
}

export const NodeGraphSection = ({ options, onOptionsChange }: DataSourcePluginOptionsEditorProps) => {
  let suffix = options.type;
  suffix += options.type === 'tempo' ? '/configure-tempo-data-source/#node-graph' : '/#node-graph';

  return (
    <ConfigSubSection
      title="Node graph"
      description={
        <ConfigDescriptionLink
          description="Show or hide the node graph visualization."
          suffix={suffix}
          feature="the node graph"
        />
      }
    >
      <NodeGraphSettings options={options} onOptionsChange={onOptionsChange} />
    </ConfigSubSection>
  );
};

