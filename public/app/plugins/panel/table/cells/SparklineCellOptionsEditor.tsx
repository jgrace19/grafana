import * as stylex from '@stylexjs/stylex';
import { useId, useMemo } from 'react';

import { createFieldConfigRegistry, type SetFieldConfigOptionsArgs } from '@grafana/data';
import { type GraphFieldConfig, type TableSparklineCellOptions } from '@grafana/schema';
import { Field } from '@grafana/ui';
import { defaultSparklineCellConfig, mergeStylexProps } from '@grafana/ui/internal';

import { getGraphFieldConfig } from '../../timeseries/config';
import { type TableCellEditorProps } from '../TableCellOptionEditor';

import './SparklineCellOptionsEditor.css';

type OptionKey = keyof TableSparklineCellOptions;

const optionIds: Array<keyof TableSparklineCellOptions> = [
  'hideValue',
  'drawStyle',
  'lineInterpolation',
  'barAlignment',
  'lineWidth',
  'fillOpacity',
  'gradientMode',
  'lineStyle',
  'spanNulls',
  'showPoints',
  'pointSize',
];

function getChartCellConfig(cfg: GraphFieldConfig): SetFieldConfigOptionsArgs<GraphFieldConfig> {
  const graphFieldConfig = getGraphFieldConfig(cfg);
  return {
    ...graphFieldConfig,
    useCustomConfig: (builder) => {
      graphFieldConfig.useCustomConfig?.(builder);
      builder.addBooleanSwitch({
        path: 'hideValue',
        name: 'Hide value',
      });
    },
  };
}

export const SparklineCellOptionsEditor = (props: TableCellEditorProps<TableSparklineCellOptions>) => {
  const { cellOptions, onChange } = props;

  const registry = useMemo(() => {
    const config = getChartCellConfig(defaultSparklineCellConfig);
    return createFieldConfigRegistry(config, 'ChartCell');
  }, []);

  const values = { ...defaultSparklineCellConfig, ...cellOptions };

  const htmlIdBase = useId();

  return (
    <>
      {registry.list(optionIds.map((id) => `custom.${id}`)).map((item) => {
        if (item.showIf && !item.showIf(values)) {
          return null;
        }
        const Editor = item.editor;
        const path = item.path;

        return (
          <Field
            key={item.id}
            noMargin
            label={item.name}
            className={mergeStylexProps(stylex.props(styles.field), { className: 'gf-sparkline-cell-field' }).className}
          >
            <Editor
              onChange={(val) => onChange({ ...cellOptions, [path]: val })}
              value={(isOptionKey(path, values) ? values[path] : undefined) ?? item.defaultValue}
              item={item}
              context={{ data: [] }}
              id={`${htmlIdBase}${item.id}`}
            />
          </Field>
        );
      })}
    </>
  );
};

// jumping through hoops to avoid using "any"
function isOptionKey(key: string, options: TableSparklineCellOptions): key is OptionKey {
  return key in options;
}

const styles = stylex.create({
  field: {
    width: '100%',
  },
});
