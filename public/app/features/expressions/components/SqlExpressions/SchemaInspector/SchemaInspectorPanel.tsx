import * as stylex from '@stylexjs/stylex';
import { useMemo, useState } from 'react';

import { t, Trans } from '@grafana/i18n';
import {
  Alert,
  Badge,
  Icon,
  InteractiveTable,
  ScrollContainer,
  Spinner,
  Stack,
  Tab,
  TabContent,
  TabsBar,
  Text,
} from '@grafana/ui';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { type SQLSchemaData, type SQLSchemaField, type SQLSchemas } from '../hooks/useSQLSchemas';

import { getFieldTypeIcon } from './utils';

type SchemaField = SQLSchemaField;
type SampleValue = string | number | boolean;
type SampleRow = SampleValue[];
type SampleRows = SampleRow[];
type SchemaData = SQLSchemaData;

interface SchemaInspectorPanelProps {
  schemas: SQLSchemas | null;
  loading: boolean;
  error: Error | null;
}

export const SchemaInspectorPanel = ({ schemas, loading, error }: SchemaInspectorPanelProps) => {
  const schemaResponse: SQLSchemas = schemas ?? {};
  const refIds = Object.keys(schemaResponse);

  const [selectedTab, setSelectedTab] = useState<string>('');
  const activeSchemaTab = refIds.includes(selectedTab) ? selectedTab : refIds[0] || '';
  const activeSchemaData = schemaResponse[activeSchemaTab];

  const columns = useMemo(
    () => [
      {
        id: 'field',
        header: 'Field',
        accessorKey: 'name',
        cell: ({ row }: { row: { original: SchemaField } }) => (
          <Stack direction="row" alignItems="center" gap={1}>
            <Icon name={getFieldTypeIcon(row.original.mysqlType)} />
            <div {...stylex.props(styles.tableCell)}>{row.original.name}</div>
          </Stack>
        ),
      },
      {
        id: 'type',
        header: 'Type',
        accessorKey: 'mysqlType',
        cell: ({ row }: { row: { original: SchemaField } }) => <Badge text={row.original.mysqlType} color="blue" />,
      },
      {
        id: 'nullable',
        header: 'Nullable',
        accessorKey: 'nullable',
        cell: ({ row }: { row: { original: SchemaField } }) => (
          <Icon
            name={row.original.nullable ? 'check' : 'times'}
            xstyle={row.original.nullable ? styles.nullableIcon : styles.requiredIcon}
          />
        ),
      },
      {
        id: 'sample',
        header: 'Sample values',
        accessorKey: 'sample',
        cell: ({
          row,
        }: {
          row: {
            original: SchemaField & {
              fieldIndex: number;
              sampleRows: SchemaData['sampleRows'];
            };
          };
        }) => {
          const { fieldIndex, sampleRows } = row.original;

          // Extract sample values for this field (column index)
          const sampleValues = sampleRows?.map((sampleRow) => sampleRow[fieldIndex]) ?? [];

          // Format as a proper array string with quoted strings
          const arrayString = JSON.stringify(sampleValues);

          return <div {...stylex.props(styles.tableCell)}>{arrayString}</div>;
        },
      },
    ],
    []
  );

  const renderSchemaFields = (fields: SchemaField[], sampleRows: SampleRows | null) => {
    // Enhance fields with fieldIndex and sampleRows for the Sample column
    const enhancedFields = fields.map((field, index) => ({
      ...field,
      fieldIndex: index,
      sampleRows,
    }));

    return (
      <div {...stylex.props(styles.tableContainer)}>
        <InteractiveTable
          columns={columns}
          data={enhancedFields}
          getRowId={({ name }) => name}
          pageSize={0} // No pagination
        />
      </div>
    );
  };

  const renderSchemaTabContent = ({ columns, error, sampleRows }: SchemaData) => {
    if (error) {
      return (
        <div {...stylex.props(styles.schemaInfoContainer)}>
          <Alert title={t('expressions.sql-schema.query-error-title', 'Query error')} severity="error">
            {error}
          </Alert>
        </div>
      );
    }

    if (!columns || columns.length === 0) {
      return (
        <div {...stylex.props(styles.schemaInfoContainer)}>
          <Alert severity="warning" title={t('expressions.sql-schema.no-fields-title', 'No schema information')}>
            <Trans i18nKey="expressions.sql-schema.no-fields-desc">This query returned no schema information.</Trans>
          </Alert>
        </div>
      );
    }

    return renderSchemaFields(columns, sampleRows);
  };

  const renderContent = () => {
    if (error) {
      return (
        <div {...stylex.props(styles.schemaInfoContainer)}>
          <Alert title={t('expressions.sql-schema.error-title', 'Error')} severity="error">
            {error.message}
          </Alert>
        </div>
      );
    }

    if (loading) {
      return (
        <div {...stylex.props(styles.schemaInfoContainer)}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Spinner />
            <Text variant="code" color="secondary">
              <Trans i18nKey="expressions.sql-schema.loading">Loading schema information...</Trans>
            </Text>
          </Stack>
        </div>
      );
    }

    if (!activeSchemaData || refIds.length === 0) {
      return (
        <div {...stylex.props(styles.schemaInfoContainer)}>
          <Alert
            severity="warning"
            title={t('expressions.sql-schema.no-data-title', 'No schema information available')}
          />
        </div>
      );
    }

    return (
      <ScrollContainer backgroundColor="primary">
        <TabContent>{renderSchemaTabContent(activeSchemaData)}</TabContent>
      </ScrollContainer>
    );
  };

  return (
    <>
      {refIds.length > 0 && (
        <TabsBar>
          {refIds.map((refId) => (
            <Tab
              key={refId}
              label={refId}
              active={activeSchemaTab === refId}
              onChangeTab={() => setSelectedTab(refId)}
            />
          ))}
        </TabsBar>
      )}
      {renderContent()}
    </>
  );
};

const styles = stylex.create({
  schemaInfoContainer: {
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
  },
  tableCell: {
    fontSize: typography['--gf-typography-body-small-font-size'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    fontFamily: typography['--gf-typography-font-family-monospace'],
  },
  tableContainer: {
    marginTop: spacing['--gf-spacing-x1'],
    marginRight: spacing['--gf-spacing-x1'],
    marginBottom: spacing['--gf-spacing-x1'],
    marginLeft: spacing['--gf-spacing-x1'],
    overflowY: 'auto',
    overflowX: 'auto',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-medium'],
    borderRadius: shape['--gf-shape-radius-default'],
    backgroundColor: colors['--gf-colors-background-primary'],
  },
  nullableIcon: {
    color: colors['--gf-colors-success-text'],
  },
  requiredIcon: {
    color: colors['--gf-colors-warning-text'],
  },
});
