import * as stylex from '@stylexjs/stylex';

import {
  type DataSourceJsonData,
  type DataSourcePluginOptionsEditorProps,
  type GrafanaTheme2,
  toOption,
  updateDatasourcePluginJsonDataOption,
} from '@grafana/data';
import { ConfigDescriptionLink, ConfigSubSection } from '@grafana/plugin-ui';
import { InlineField, InlineFieldRow, Input, Select } from '@grafana/ui';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { o11yFullWidth, o11yInfoTextStyles } from '../o11ySettings.stylex';

export interface SpanBarOptions {
  type?: string;
  tag?: string;
}

export interface SpanBarOptionsData extends DataSourceJsonData {
  spanBar?: SpanBarOptions;
}

export const NONE = 'None';
export const DURATION = 'Duration';
export const TAG = 'Tag';

interface Props extends DataSourcePluginOptionsEditorProps<SpanBarOptionsData> {}

export default function SpanBarSettings({ options, onOptionsChange }: Props) {
  const selectOptions = [NONE, DURATION, TAG].map(toOption);
  const rowClassName = mergeStylexClassName(stylex.props(o11yInfoTextStyles.row)).className;

  return (
    <div {...stylex.props(o11yFullWidth.fullWidth)}>
      <InlineFieldRow className={rowClassName}>
        <InlineField label="Label" labelWidth={26} tooltip="Default: duration" grow>
          <Select
            inputId="label"
            options={selectOptions}
            value={options.jsonData.spanBar?.type || ''}
            onChange={(v) => {
              updateDatasourcePluginJsonDataOption({ onOptionsChange, options }, 'spanBar', {
                ...options.jsonData.spanBar,
                type: v?.value ?? '',
              });
            }}
            placeholder="Duration"
            isClearable
            aria-label={'select-label-name'}
            width={40}
          />
        </InlineField>
      </InlineFieldRow>
      {options.jsonData.spanBar?.type === TAG && (
        <InlineFieldRow className={rowClassName}>
          <InlineField
            label="Tag key"
            labelWidth={26}
            tooltip="Tag key which will be used to get the tag value. A span's attributes and resources will be searched for the tag key"
          >
            <Input
              type="text"
              placeholder="Enter tag key"
              onChange={(v) =>
                updateDatasourcePluginJsonDataOption({ onOptionsChange, options }, 'spanBar', {
                  ...options.jsonData.spanBar,
                  tag: v.currentTarget.value,
                })
              }
              value={options.jsonData.spanBar?.tag || ''}
              width={40}
            />
          </InlineField>
        </InlineFieldRow>
      )}
    </div>
  );
}

export const SpanBarSection = ({ options, onOptionsChange }: DataSourcePluginOptionsEditorProps) => {
  let suffix = options.type;
  suffix += options.type === 'tempo' ? '/configure-tempo-data-source/#span-bar' : '/#span-bar';

  return (
    <ConfigSubSection
      title="Span bar"
      description={
        <ConfigDescriptionLink
          description="Add additional info next to the service and operation on a span bar row in the trace view."
          suffix={suffix}
          feature="the span bar"
        />
      }
    >
      <SpanBarSettings options={options} onOptionsChange={onOptionsChange} />
    </ConfigSubSection>
  );
};

