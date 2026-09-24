import * as stylex from '@stylexjs/stylex';

import { type DataFrame, type Field, formattedValueToString, getFieldDisplayName, type LinkModel } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { TextLink } from '@grafana/ui';
import { colors, components, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
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
  if (!data || rowIndex == null) {
    return null;
  }

  const dispValuesAndLinks = getDisplayValuesAndLinks(data, rowIndex);

  if (dispValuesAndLinks == null) {
    return null;
  }

  const { displayValues, links } = dispValuesAndLinks;

  return (
    <div {...stylex.props(styles.wrapper, styles.padding(`${padding}px`))}>
      {header && (
        <div {...stylex.props(styles.header)}>
          <span {...stylex.props(styles.title)}>{header}</span>
        </div>
      )}
      <table {...stylex.props(styles.infoWrap)}>
        <tbody>
          {displayValues.map((displayValue, i) => (
            <tr key={`${i}/${rowIndex}`} {...stylex.props(styles.row)}>
              <th {...stylex.props(styles.infoWrapTh)}>{displayValue.name}</th>
              <td>{renderValue(displayValue.valueString)}</td>
            </tr>
          ))}
          {links.map((link, i) => (
            <tr key={i} {...stylex.props(styles.row)}>
              <th {...stylex.props(styles.infoWrapTh)}>
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

const styles = stylex.create({
  wrapper: {
    backgroundColor: components['--gf-components-tooltip-background'],
    borderRadius: `calc(${shape['--gf-shape-radius-default']} * 2)`,
  },
  padding: (padding: string) => ({
    paddingTop: padding,
    paddingRight: padding,
    paddingBottom: padding,
    paddingLeft: padding,
  }),
  header: {
    backgroundColor: colors['--gf-colors-background-secondary'],
    alignItems: 'center',
    alignContent: 'center',
    display: 'flex',
    paddingBottom: spacing['--gf-spacing-x1'],
  },
  title: {
    fontWeight: typography['--gf-typography-font-weight-medium'],
    overflow: 'hidden',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    flexGrow: 1,
  },
  infoWrap: {
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
    backgroundColor: 'transparent',
    borderStyle: 'none',
  },
  infoWrapTh: {
    fontWeight: typography['--gf-typography-font-weight-medium'],
    paddingTop: `calc(${spacing['--gf-spacing-grid-size']} * 0.25)`,
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 0.25)`,
    paddingLeft: 0,
  },
  row: {
    borderBottomWidth: '1px',
    borderBottomStyle: { default: 'solid', ':last-child': 'none' },
    borderBottomColor: colors['--gf-colors-border-weak'],
  },
});
