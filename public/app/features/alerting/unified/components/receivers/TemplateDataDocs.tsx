import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import type { JSX } from 'react';

import { Trans } from '@grafana/i18n';
import { Stack, Text } from '@grafana/ui';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { PopupCard } from '../HoverCard';

import {
  AlertTemplateData,
  GlobalTemplateData,
  KeyValueCodeSnippet,
  KeyValueTemplateFunctions,
  type TemplateDataItem,
} from './TemplateData';

export function TemplateDataDocs() {
  const AlertTemplateDataTable = (
    <TemplateDataTable
      caption={
        <>
          <Text variant="h4" element="h4" color="primary">
            <Trans i18nKey="alerting.template-data-docs.alert-template-data-table.alert-template-data">
              Alert template data
            </Trans>
          </Text>
          <Text variant="bodySmall">
            <Trans i18nKey="alerting.template-data-docs.alert-template-data-table.only-in-alert">
              Available only when in the context of an Alert (e.g. inside .Alerts loop)
            </Trans>
          </Text>
        </>
      }
      dataItems={AlertTemplateData}
    />
  );

  return (
    <Stack gap={2}>
      <TemplateDataTable
        caption={
          <>
            <Text variant="h4" element="h4" color="primary">
              <Trans i18nKey="alerting.template-data-docs.notification-template-data">Notification template data</Trans>
            </Text>
            <Text variant="bodySmall">
              <Trans i18nKey="alerting.template-data-docs.available-context-notification">
                Available in the context of a notification.
              </Trans>
            </Text>
          </>
        }
        dataItems={GlobalTemplateData}
        typeRenderer={(type) => {
          if (type === '[]Alert') {
            return (
              <PopupCard content={AlertTemplateDataTable}>
                <div {...stylex.props(styles.interactiveType)}>{type}</div>
              </PopupCard>
            );
          }
          if (type === 'KeyValue') {
            return (
              <PopupCard content={<KeyValueTemplateDataTable />}>
                <div {...stylex.props(styles.interactiveType)}>{type}</div>
              </PopupCard>
            );
          }
          return type;
        }}
      />
    </Stack>
  );
}

const styles = stylex.create({
  interactiveType: {
    color: colors['--gf-colors-text-link'],
  },
  table: {
    borderCollapse: 'collapse',
    width: '100%',
  },
  caption: {
    captionSide: 'top',
  },
  cell: {
    padding: spacing['--gf-spacing-x1'],
  },
  thead: {
    fontWeight: typography['--gf-typography-font-weight-bold'],
  },
  bodyRow: {
    backgroundColor: {
      default: null,
      ':nth-child(2n + 1)': colors['--gf-colors-background-secondary'],
    },
  },
  firstBodyCell: {
    fontWeight: typography['--gf-typography-font-weight-bold'],
  },
  secondBodyCell: {
    fontStyle: 'italic',
  },
});

interface TemplateDataTableProps {
  dataItems: TemplateDataItem[];
  caption?: JSX.Element | string;
  typeRenderer?: (type: TemplateDataItem['type']) => React.ReactNode;
}

export function TemplateDataTable({ dataItems, caption, typeRenderer }: TemplateDataTableProps) {
  return (
    <table {...stylex.props(styles.table)}>
      {caption && <caption {...stylex.props(styles.caption)}>{caption}</caption>}
      <thead {...stylex.props(styles.thead)}>
        <tr>
          <th {...stylex.props(styles.cell)}>
            <Trans i18nKey="alerting.template-data-table.name">Name</Trans>
          </th>
          <th {...stylex.props(styles.cell)}>
            <Trans i18nKey="alerting.template-data-table.type">Type</Trans>
          </th>
          <th {...stylex.props(styles.cell)}>
            <Trans i18nKey="alerting.template-data-table.notes">Notes</Trans>
          </th>
        </tr>
      </thead>
      <tbody>
        {dataItems.map(({ name, type, notes }, index) => (
          <tr key={index} {...stylex.props(styles.bodyRow)}>
            <td {...stylex.props(styles.cell, styles.firstBodyCell)}>{name}</td>
            <td {...stylex.props(styles.cell, styles.secondBodyCell)}>{typeRenderer ? typeRenderer(type) : type}</td>
            <td {...stylex.props(styles.cell)}>{notes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function KeyValueTemplateDataTable() {
  return (
    <div>
      <Trans i18nKey="alerting.key-value-template-data-table.description">
        KeyValue is a set of key/value string pairs that represent labels and annotations.
      </Trans>
      <pre>
        <code>{KeyValueCodeSnippet}</code>
      </pre>
      <table {...stylex.props(styles.table)}>
        <caption {...stylex.props(styles.caption)}>
          <Trans i18nKey="alerting.key-value-template-data-table.keyvalue-methods">Key-value methods</Trans>
        </caption>
        <thead {...stylex.props(styles.thead)}>
          <tr>
            <th {...stylex.props(styles.cell)}>
              <Trans i18nKey="alerting.key-value-template-data-table.name">Name</Trans>
            </th>
            <th {...stylex.props(styles.cell)}>
              <Trans i18nKey="alerting.key-value-template-data-table.arguments">Arguments</Trans>
            </th>
            <th {...stylex.props(styles.cell)}>
              <Trans i18nKey="alerting.key-value-template-data-table.returns">Returns</Trans>
            </th>
            <th {...stylex.props(styles.cell)}>
              <Trans i18nKey="alerting.key-value-template-data-table.notes">Notes</Trans>
            </th>
          </tr>
        </thead>
        <tbody>
          {KeyValueTemplateFunctions.map(({ name, args, returns, notes }) => (
            <tr key={name} {...stylex.props(styles.bodyRow)}>
              <td {...stylex.props(styles.cell, styles.firstBodyCell)}>{name}</td>
              <td {...stylex.props(styles.cell, styles.secondBodyCell)}>{args}</td>
              <td {...stylex.props(styles.cell)}>{returns}</td>
              <td {...stylex.props(styles.cell)}>{notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
