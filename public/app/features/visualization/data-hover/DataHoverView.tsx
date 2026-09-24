
import {
  type DataFrame,
  type Field,
  formattedValueToString,
  getFieldDisplayName,
  type GrafanaTheme2,
  type LinkModel,
} from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { TextLink, } from '@grafana/ui';
import { renderValue } from 'app/plugins/panel/geomap/utils/uiUtils';
import { getDataLinks } from 'app/plugins/panel/status-history/utils';

export interface Props {
  data?: DataFrame; // source data
  rowIndex?: number | null; // the hover row
  columnIndex?: number | null; // the hover column
  header?: string;
  padding?: number;
}

export interface DisplayValue {
  name: string;
  value: unknown;
  valueString: string;
}

export function getDisplayValuesAndLinks(data: DataFrame, rowIndex: number, columnIndex?: number) {
  const visibleFields = data.fields.filter(
    (f, i) => !Boolean(f.config.custom?.hideFrom?.tooltip) && (columnIndex == null || i === columnIndex)
  );

  if (visibleFields.length === 0) {
    return null;
  }

  const displayValues: DisplayValue[] = [];
  const links: Array<LinkModel<Field>> = [];
  const linkLookup = new Set<string>();

  for (const field of visibleFields) {
    const value = field.values[rowIndex];
    const fieldDisplay = field.display ? field.display(value) : { text: `${value}`, numeric: +value };

    getDataLinks(field, rowIndex).forEach((link) => {
      const key = `${link.title}/${link.href}`;
      if (!linkLookup.has(key)) {
        links.push(link);
        linkLookup.add(key);
      }
    });

    displayValues.push({
      name: getFieldDisplayName(field, data),
      value,
      valueString: formattedValueToString(fieldDisplay),
    });
  }

  return { displayValues, links };
}

export const DataHoverView = ({ data, rowIndex, header, padding = 0 }: Props) => {
  const styles = (getStyles, padding);

  if (!data || rowIndex == null) {
    return null;
  }

  const dispValuesAndLinks = getDisplayValuesAndLinks(data, rowIndex);

  if (dispValuesAndLinks == null) {
    return null;
  }

  const { displayValues, links } = dispValuesAndLinks;

  return (
    <div {...stylex.props(dataHoverViewStyles.wrapper)}>
      {header && (
        <div {...stylex.props(dataHoverViewStyles.header)}>
          <span {...stylex.props(dataHoverViewStyles.title)}>{header}</span>
        </div>
      )}
      <table {...stylex.props(dataHoverViewStyles.infoWrap)}>
        <tbody>
          {displayValues.map((displayValue, i) => (
            <tr key={`${i}/${rowIndex}`}>
              <th>{displayValue.name}</th>
              <td>{renderValue(displayValue.valueString)}</td>
            </tr>
          ))}
          {links.map((link, i) => (
            <tr key={i}>
              <th>
                <Trans i18nKey="visualization.data-hover-view.link">Link</Trans>
              </th>
              <td colSpan={2}>
                <TextLink href={link.href} external={link.target === '_blank'} weight={'medium'} inline={false}>
                  {link.title}
                </TextLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

;
