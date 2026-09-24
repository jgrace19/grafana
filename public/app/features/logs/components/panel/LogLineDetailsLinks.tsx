import * as stylex from '@stylexjs/stylex';
import { memo, useMemo } from 'react';

import { t } from '@grafana/i18n';
import { DataLinkButton, Icon, Toggletip } from '@grafana/ui';
import { spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { type FieldDef } from '../logParser';

import { useLogDetailsContext } from './LogDetailsContext';
import { filterFields, MultipleValue, SingleValue } from './LogLineDetailsFields';
import { useLogListContext } from './LogListContext';
import { type LogListModel } from './processing';
import './LogLineDetailsFields.css';

interface LogLineDetailsLinksProps {
  fields: FieldDef[];
  log: LogListModel;
  logs: LogListModel[];
  search?: string;
}

export const LogLineDetailsLinks = memo(({ fields, log, search }: LogLineDetailsLinksProps) => {
  const { fontSize } = useLogListContext();
  const filteredFields = useMemo(() => (search ? filterFields(fields, search) : fields), [fields, search]);

  if (!fields.length) {
    return null;
  } else if (filteredFields.length === 0) {
    return t('logs.log-line-details.search.no-results', 'No results to display.');
  }

  return (
    <div {...stylex.props(styles.linksTable, fontSize === 'small' ? styles.linksTableGapSmall : styles.linksTableGap)}>
      {filteredFields.map((field, i) => (
        <LogLineDetailsField key={`${field.keys[0]}=${field.values[0]}-${i}`} field={field} log={log} />
      ))}
    </div>
  );
});
LogLineDetailsLinks.displayName = 'LogLineDetailsLinks';

interface LogLineDetailsFieldProps {
  field: FieldDef;
  log: LogListModel;
}

export const LogLineDetailsField = ({ field, log }: LogLineDetailsFieldProps) => {
  const { onPinLine, pinLineButtonTooltipTitle, prettifyJSON } = useLogListContext();
  const { closeDetails } = useLogDetailsContext();

  const singleKey = field.keys.length === 1;
  const singleValue = field.values.length === 1;

  const tooltip = useMemo(
    () => (
      <div className="gf-log-line-details-value">
        <div {...stylex.props(styles.valueContainer)}>
          {singleValue ? (
            <SingleValue value={field.values[0]} prettifyJSON={prettifyJSON} />
          ) : (
            <MultipleValue showCopy={true} values={field.values} />
          )}
        </div>
      </div>
    ),
    [field.values, singleValue, prettifyJSON]
  );

  return (
    <>
      <div {...stylex.props(styles.label)}>
        {singleKey ? field.keys[0] : <MultipleValue values={field.keys} />}
        <Toggletip fitContent content={tooltip}>
          <Icon
            aria-label={t('logs.log-line-details.link-value-tooltip', 'Link value')}
            xstyle={styles.labelIcon}
            name="info-circle"
          />
        </Toggletip>
      </div>
      <div {...stylex.props(styles.links)}>
        {field.links?.map((link, i) => {
          if (link.onClick && onPinLine) {
            const originalOnClick = link.onClick;
            link.onClick = (e, origin) => {
              // Pin the line
              onPinLine(log);

              // Execute the link onClick function
              originalOnClick(e, origin);

              closeDetails();
            };
          }
          return (
            <span key={`${link.title}-${i}`} {...stylex.props(styles.link)}>
              <DataLinkButton
                buttonProps={{
                  // Show tooltip message if max number of pinned lines has been reached
                  tooltip:
                    typeof pinLineButtonTooltipTitle === 'object' && link.onClick
                      ? pinLineButtonTooltipTitle
                      : undefined,
                  variant: 'secondary',
                  fill: 'outline',
                }}
                link={link}
              />
            </span>
          );
        })}
      </div>
    </>
  );
};

const styles = stylex.create({
  linksTable: {
    display: 'grid',
    gridTemplateColumns: `fit-content(30%) 1fr`,
    marginBottom: spacing['--gf-spacing-x1'],
  },
  linksTableGap: {
    rowGap: spacing['--gf-spacing-x0-5'],
    columnGap: spacing['--gf-spacing-x1'],
  },
  linksTableGapSmall: {
    rowGap: spacing['--gf-spacing-x0-25'],
    columnGap: spacing['--gf-spacing-x0-5'],
  },
  label: {
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
    paddingRight: spacing['--gf-spacing-x1'],
  },
  labelIcon: {
    marginLeft: spacing['--gf-spacing-x1'],
  },
  links: {
    paddingBottom: spacing['--gf-spacing-x0-5'],
  },
  link: {
    marginRight: spacing['--gf-spacing-x0-5'],
  },
  valueContainer: {
    display: 'flex',
    lineHeight: typography['--gf-typography-body-line-height'],
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    maxHeight: '50vh',
    overflow: 'auto',
  },
});
