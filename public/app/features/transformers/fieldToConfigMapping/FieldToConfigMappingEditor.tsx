import * as stylex from '@stylexjs/stylex';
import { capitalize } from 'lodash';

import { type DataFrame, getFieldDisplayName, ReducerID, type SelectableValue } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { Select, StatsPicker } from '@grafana/ui';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import {
  configMapHandlers,
  evaluateFieldMappings,
  type FieldToConfigMapHandler,
  type FieldToConfigMapping,
  type HandlerArguments,
  lookUpConfigHandler as findConfigHandlerFor,
} from '../fieldToConfigMapping/fieldToConfigMapping';

import {
  createsArgumentsEditor,
  FieldConfigMappingHandlerArgumentsEditor,
} from './FieldConfigMappingHandlerArgumentsEditor';

export interface Props {
  frame: DataFrame;
  mappings: FieldToConfigMapping[];
  onChange: (mappings: FieldToConfigMapping[]) => void;
  withReducers?: boolean;
  withNameAndValue?: boolean;
}

export function FieldToConfigMappingEditor({ frame, mappings, onChange, withReducers, withNameAndValue }: Props) {
  const rows = getViewModelRows(frame, mappings, withNameAndValue);
  const configProps = configMapHandlers.map((def) => configHandlerToSelectOption(def, false)) as Array<
    SelectableValue<string>
  >;
  const hasAdditionalSettings = mappings.reduce(
    (prev, mapping) => prev || createsArgumentsEditor(mapping.handlerKey),
    false
  );

  const onChangeConfigProperty = (row: FieldToConfigRowViewModel, value: SelectableValue<string | null>) => {
    const existingIdx = mappings.findIndex((x) => x.fieldName === row.fieldName);

    if (value) {
      if (existingIdx !== -1) {
        const update = [...mappings];
        update.splice(existingIdx, 1, { ...mappings[existingIdx], handlerKey: value.value! });
        onChange(update);
      } else {
        onChange([...mappings, { fieldName: row.fieldName, handlerKey: value.value! }]);
      }
    } else {
      if (existingIdx !== -1) {
        onChange(mappings.filter((x, index) => index !== existingIdx));
      } else {
        onChange([...mappings, { fieldName: row.fieldName, handlerKey: '__ignore' }]);
      }
    }
  };

  const onChangeReducer = (row: FieldToConfigRowViewModel, reducerId: ReducerID) => {
    const existingIdx = mappings.findIndex((x) => x.fieldName === row.fieldName);

    if (existingIdx !== -1) {
      const update = [...mappings];
      update.splice(existingIdx, 1, { ...mappings[existingIdx], reducerId });
      onChange(update);
    } else {
      onChange([...mappings, { fieldName: row.fieldName, handlerKey: row.handlerKey, reducerId }]);
    }
  };

  const onChangeHandlerArguments = (row: FieldToConfigRowViewModel, handlerArguments: HandlerArguments) => {
    const existingIdx = mappings.findIndex((x) => x.fieldName === row.fieldName);

    if (existingIdx !== -1) {
      const update = [...mappings];
      update.splice(existingIdx, 1, { ...mappings[existingIdx], handlerArguments });
      onChange(update);
    } else {
      onChange([...mappings, { fieldName: row.fieldName, handlerKey: row.handlerKey, handlerArguments }]);
    }
  };

  return (
    <table {...stylex.props(styles.table)}>
      <thead>
        <tr>
          <th {...stylex.props(styles.cell, styles.headerCell)}>
            <Trans i18nKey="transformers.field-to-config-mapping-editor.field">Field</Trans>
          </th>
          <th {...stylex.props(styles.cell, styles.headerCell)}>
            <Trans i18nKey="transformers.field-to-config-mapping-editor.use-as">Use as</Trans>
          </th>
          {withReducers && (
            <th {...stylex.props(styles.cell, styles.headerCell)}>
              <Trans i18nKey="transformers.field-to-config-mapping-editor.select">Select</Trans>
            </th>
          )}
          {hasAdditionalSettings && (
            <th {...stylex.props(styles.cell, styles.headerCell)}>
              <Trans i18nKey="transformers.field-to-config-mapping-editor.additional-settings">
                Additional settings
              </Trans>
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.fieldName}>
            <td {...stylex.props(styles.cell, styles.labelCell)}>{row.fieldName}</td>
            <td {...stylex.props(styles.cell, styles.selectCell)} data-testid={`${row.fieldName}-config-key`}>
              <Select
                options={configProps}
                value={row.configOption}
                placeholder={row.placeholder}
                isClearable={true}
                onChange={(value) => onChangeConfigProperty(row, value)}
              />
            </td>
            {withReducers && (
              <td data-testid={`${row.fieldName}-reducer`} {...stylex.props(styles.cell, styles.selectCell)}>
                <StatsPicker
                  stats={[row.reducerId]}
                  defaultStat={row.reducerId}
                  onChange={(stats: string[]) => onChangeReducer(row, stats[0] as ReducerID)}
                />
              </td>
            )}
            {hasAdditionalSettings && (
              <td data-testid={`${row.fieldName}-handler-arg`} {...stylex.props(styles.cell, styles.selectCell)}>
                <FieldConfigMappingHandlerArgumentsEditor
                  handlerKey={row.handlerKey}
                  handlerArguments={row.handlerArguments}
                  onChange={(args) => onChangeHandlerArguments(row, args)}
                />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface FieldToConfigRowViewModel {
  handlerKey: string | null;
  fieldName: string;
  configOption: SelectableValue<string | null> | null;
  placeholder?: string;
  missingInFrame?: boolean;
  reducerId: string;
  handlerArguments: HandlerArguments;
}

function getViewModelRows(
  frame: DataFrame,
  mappings: FieldToConfigMapping[],
  withNameAndValue?: boolean
): FieldToConfigRowViewModel[] {
  const rows: FieldToConfigRowViewModel[] = [];
  const mappingResult = evaluateFieldMappings(frame, mappings ?? [], withNameAndValue);

  for (const field of frame.fields) {
    const fieldName = getFieldDisplayName(field, frame);
    const mapping = mappingResult.index[fieldName];
    const option = configHandlerToSelectOption(mapping.handler, mapping.automatic);

    rows.push({
      fieldName,
      configOption: mapping.automatic ? null : option,
      placeholder: mapping.automatic ? option?.label : 'Choose',
      handlerKey: mapping.handler?.key ?? null,
      reducerId: mapping.reducerId,
      handlerArguments: mapping.handlerArguments,
    });
  }

  // Add rows for mappings that have no matching field
  for (const mapping of mappings) {
    if (!rows.find((x) => x.fieldName === mapping.fieldName)) {
      const handler = findConfigHandlerFor(mapping.handlerKey);

      rows.push({
        fieldName: mapping.fieldName,
        handlerKey: mapping.handlerKey,
        configOption: configHandlerToSelectOption(handler, false),
        missingInFrame: true,
        reducerId: mapping.reducerId ?? ReducerID.lastNotNull,
        handlerArguments: {},
      });
    }
  }

  return Object.values(rows);
}

function configHandlerToSelectOption(
  def: FieldToConfigMapHandler | null,
  isAutomatic: boolean
): SelectableValue<string> | null {
  if (!def) {
    return null;
  }

  let name = def.name ?? capitalize(def.key);

  if (isAutomatic) {
    name = `${name} (auto)`;
  }

  return {
    label: name,
    value: def.key,
  };
}

const styles = stylex.create({
  table: {
    marginTop: spacing['--gf-spacing-x1'],
  },
  cell: {
    borderRightWidth: '4px',
    borderRightStyle: 'solid',
    borderRightColor: colors['--gf-colors-background-primary'],
    borderBottomWidth: '4px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-background-primary'],
    whiteSpace: 'nowrap',
  },
  headerCell: {
    fontSize: typography['--gf-typography-body-small-font-size'],
    lineHeight: spacing['--gf-spacing-x4'],
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x1'],
  },
  labelCell: {
    fontSize: typography['--gf-typography-body-small-font-size'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x1'],
    maxWidth: '400px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minWidth: '140px',
  },
  selectCell: {
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    minWidth: '161px',
  },
});
