import * as stylex from '@stylexjs/stylex';
import { useMemo, type JSX } from 'react';

import { t } from '@grafana/i18n';

import { logsFieldsStyles } from './ActiveFields';
import { EmptyFields } from './EmptyFields';
import { Field } from './Field';
import { type FieldWithStats } from './FieldSelector';

interface Props {
  activeFields: string[];
  fields: FieldWithStats[];
  toggle: (key: string) => void;
  reorder: (columns: string[]) => void;
}

export const AvailableFields = ({ activeFields, fields, toggle, reorder }: Props): JSX.Element => {
  const availableFields = useMemo(
    () => fields.filter((field) => !activeFields.includes(field.name)).sort(sortFields),
    [activeFields, fields]
  );

  if (availableFields.length) {
    return (
      <div {...stylex.props(logsFieldsStyles.columnWrapper)}>
        {availableFields.map((field) => (
          <div
            key={field.name}
            {...stylex.props(logsFieldsStyles.wrap)}
            title={t('logs.field-selector.label-title', `{{fieldName}} appears in {{percentage}}% of log lines`, {
              fieldName: field.name,
              percentage: field.stats.percentOfLinesWithLabel,
            })}
          >
            <Field field={field} toggle={toggle} showCount />
          </div>
        ))}
      </div>
    );
  }

  return <EmptyFields />;
};

const collator = new Intl.Collator(undefined, { sensitivity: 'base' });

function sortFields(a: FieldWithStats, b: FieldWithStats) {
  return collator.compare(a.name, b.name);
}
