
import { Trans } from '@grafana/i18n';
import { useTheme2 } from '@grafana/ui';

import { ActiveFields } from './ActiveFields';
import { AvailableFields } from './AvailableFields';
import { type FieldWithStats } from './FieldSelector';

interface Props {
  activeFields: string[];
  clear: () => void;
  fields: FieldWithStats[];
  logLevelActive?: boolean;
  reorder: (columns: string[]) => void;
  suggestedFields: FieldWithStats[];
  toggle: (columnName: string) => void;
  toggleLevel?: () => void;
}

export const FieldList = ({
  activeFields,
  clear,
  fields,
  logLevelActive,
  reorder,
  suggestedFields,
  toggle,
  toggleLevel,
}: Props) => {
  const theme = useTheme2();
  const styles = getStyles(theme);

  return (
    <div {...stylex.props(fieldListStyles.sidebarWrap)}>
      {/* Sidebar columns */}
      <>
        <ActiveFields
          activeFields={activeFields}
          clear={clear}
          fields={fields}
          logLevelActive={logLevelActive}
          reorder={reorder}
          suggestedFields={suggestedFields}
          toggle={toggle}
          toggleLevel={toggleLevel}
        />

        <div {...stylex.props(fieldListStyles.columnHeader)}>
          <Trans i18nKey="explore.logs-table-multi-select.fields">Fields</Trans>
        </div>
        <AvailableFields activeFields={activeFields} fields={fields} reorder={reorder} toggle={toggle} />
      </>
    </div>
  );
};

