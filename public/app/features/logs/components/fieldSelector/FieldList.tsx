import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

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
  return (
    <div {...stylex.props(styles.sidebarWrap)}>
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

        <div {...stylex.props(styles.columnHeader)}>
          <Trans i18nKey="explore.logs-table-multi-select.fields">Fields</Trans>
        </div>
        <AvailableFields activeFields={activeFields} fields={fields} reorder={reorder} toggle={toggle} />
      </>
    </div>
  );
};

const styles = stylex.create({
  sidebarWrap: {
    overflowY: 'auto',
    flex: '1',
    scrollbarWidth: 'thin',
  },
  columnHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: typography['--gf-typography-h6-font-size'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    position: 'sticky',
    top: 0,
    left: 0,
    paddingTop: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 1.5)`,
    zIndex: 3,
    marginBottom: spacing['--gf-spacing-x2'],
  },
});
