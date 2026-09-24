import * as stylex from '@stylexjs/stylex';
import { derivedFieldsStyles } from './DerivedFields.stylex';

import { useCallback, useState } from 'react';

import { ConfigDescriptionLink, ConfigSubSection } from '@grafana/plugin-ui';
import { Button, useTheme2 } from '@grafana/ui';

import { type DerivedFieldConfig } from '../types';

import { DebugSection } from './DebugSection';
import { DerivedField } from './DerivedField';


type Props = {
  fields?: DerivedFieldConfig[];
  onChange: (value: DerivedFieldConfig[]) => void;
};

export const DerivedFields = ({ fields = [], onChange }: Props) => {
  const theme = useTheme2();
  const styles = getStyles(theme);

  const [showDebug, setShowDebug] = useState(false);

  const validateName = useCallback(
    (name: string) => {
      return fields.filter((field) => field.name && field.name === name).length <= 1;
    },
    [fields]
  );

  return (
    <ConfigSubSection
      title="Derived fields"
      description={
        <ConfigDescriptionLink
          description="Derived fields can be used to extract new fields from a log message and create a link from its value."
          suffix="loki/configure-loki-data-source/#derived-fields"
          feature="derived fields"
        />
      }
    >
      <div {...stylex.props(derivedFieldsStyles.container)}>
        {fields.map((field, index) => {
          return (
            <DerivedField
              {...stylex.props(derivedFieldsStyles.derivedField)}
              key={index}
              value={field}
              onChange={(newField) => {
                const newDerivedFields = [...fields];
                newDerivedFields.splice(index, 1, newField);
                onChange(newDerivedFields);
              }}
              onDelete={() => {
                const newDerivedFields = [...fields];
                newDerivedFields.splice(index, 1);
                onChange(newDerivedFields);
              }}
              validateName={validateName}
              suggestions={[
                {
                  value: DataLinkBuiltInVars.valueRaw,
                  label: 'Raw value',
                  documentation: 'Exact string captured by the regular expression',
                  origin: VariableOrigin.Value,
                },
              ]}
            />
          );
        })}
        <div>
          <Button
            variant="secondary"
            {...stylex.props(derivedFieldsStyles.addButton)}
            icon="plus"
            onClick={(event) => {
              event.preventDefault();
              const emptyConfig: DerivedFieldConfig = {
                name: '',
                matcherRegex: '',
                urlDisplayLabel: '',
                url: '',
                matcherType: 'regex',
              };
              const newDerivedFields = [...fields, emptyConfig];
              onChange(newDerivedFields);
            }}
          >
            Add
          </Button>

          {fields.length > 0 && (
            <Button variant="secondary" type="button" onClick={() => setShowDebug(!showDebug)}>
              {showDebug ? 'Hide example log message' : 'Show example log message'}
            </Button>
          )}
        </div>

        {showDebug && (
          <div {...stylex.props(derivedFieldsStyles.debugSection)}>
            <DebugSection
              className={css({
                marginBottom: '10px',
              })}
              derivedFields={fields}
            />
          </div>
        )}
      </div>
    </ConfigSubSection>
  );
};
