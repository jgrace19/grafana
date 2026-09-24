import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { templateDataDocsStyles } from './TemplateDataDocs.stylex';
import * as React from 'react';
import type { JSX } from 'react';

import { Trans } from '@grafana/i18n';
import { Stack, Text } from '@grafana/ui';

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
                <div {...stylex.props(templateDataDocsStyles.interactiveType)}>{type}</div>
              </PopupCard>
            );
          }
          if (type === 'KeyValue') {
            return (
              <PopupCard content={<KeyValueTemplateDataTable />}>
                <div {...stylex.props(templateDataDocsStyles.interactiveType)}>{type}</div>
              </PopupCard>
            );
          }
          return type;
        }}
      />
    </Stack>
  );
}


interface TemplateDataTableProps {
  dataItems: TemplateDataItem[];
  caption?: JSX.Element | string;
  typeRenderer?: (type: TemplateDataItem['type']) => React.ReactNode;
}

export function TemplateDataTable({ dataItems, caption, typeRenderer }: TemplateDataTableProps) {

  return (
    <table {...stylex.props(templateDataDocsStyles.table)}>
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          <th>
            <Trans i18nKey="alerting.template-data-table.name">Name</Trans>
          </th>
          <th>
            <Trans i18nKey="alerting.template-data-table.type">Type</Trans>
          </th>
          <th>
            <Trans i18nKey="alerting.template-data-table.notes">Notes</Trans>
          </th>
        </tr>
      </thead>
      <tbody>
        {dataItems.map(({ name, type, notes }, index) => (
          <tr key={index}>
            <td>{name}</td>
            <td>{typeRenderer ? typeRenderer(type) : type}</td>
            <td>{notes}</td>
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
      <table {...stylex.props(tableStyles.table)}>
        <caption>
          <Trans i18nKey="alerting.key-value-template-data-table.keyvalue-methods">Key-value methods</Trans>
        </caption>
        <thead>
          <tr>
            <th>
              <Trans i18nKey="alerting.key-value-template-data-table.name">Name</Trans>
            </th>
            <th>
              <Trans i18nKey="alerting.key-value-template-data-table.arguments">Arguments</Trans>
            </th>
            <th>
              <Trans i18nKey="alerting.key-value-template-data-table.returns">Returns</Trans>
            </th>
            <th>
              <Trans i18nKey="alerting.key-value-template-data-table.notes">Notes</Trans>
            </th>
          </tr>
        </thead>
        <tbody>
          {KeyValueTemplateFunctions.map(({ name, args, returns, notes }) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{args}</td>
              <td>{returns}</td>
              <td>{notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

);
