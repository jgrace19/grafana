import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { logLineDetailsLinksStyles } from './LogLineDetailsLinks.stylex';
import { memo, useMemo } from 'react';

import { t } from '@grafana/i18n';
import { DataLinkButton, Icon, Toggletip } from '@grafana/ui';

import { type FieldDef } from '../logParser';

import { useLogDetailsContext } from './LogDetailsContext';
import { filterFields, MultipleValue, SingleValue } from './LogLineDetailsFields';
import { type LogListFontSize } from './LogList';
import { useLogListContext } from './LogListContext';
import { type LogListModel } from './processing';

interface LogLineDetailsLinksProps {
  fields: FieldDef[];
  log: LogListModel;
  logs: LogListModel[];
  search?: string;
}

export const LogLineDetailsLinks = memo(({ fields, log, search }: LogLineDetailsLinksProps) => {
  const { fontSize } = useLogListContext();
  const styles = (getFieldsStyles, fontSize);
  const filteredFields = useMemo(() => (search ? filterFields(fields, search) : fields), [fields, search]);

  if (!fields.length) {
    return null;
  } else if (filteredFields.length === 0) {
    return t('logs.log-line-details.search.no-results', 'No results to display.');
  }

  return (
    <div {...stylex.props(logLineDetailsLinksStyles.linksTable)}>
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

  const styles = (getFieldStyles);

  const singleKey = field.keys.length === 1;
  const singleValue = field.values.length === 1;

  const tooltip = useMemo(
    () => (
      <div className={logLineDetailsLinksStyles.value}>
        <div className={logLineDetailsLinksStyles.valueContainer}>
          {singleValue ? (
            <SingleValue value={field.values[0]} prettifyJSON={prettifyJSON} />
          ) : (
            <MultipleValue showCopy={true} values={field.values} />
          )}
        </div>
      </div>
    ),
    [field.values, singleValue, logLineDetailsLinksStyles.value, logLineDetailsLinksStyles.valueContainer, prettifyJSON]
  );

  return (
    <>
      <div className={logLineDetailsLinksStyles.label}>
        {singleKey ? field.keys[0] : <MultipleValue values={field.keys} />}
        <Toggletip fitContent content={tooltip}>
          <Icon
            aria-label={t('logs.log-line-details.link-value-tooltip', 'Link value')}
            className={logLineDetailsLinksStyles.labelIcon}
            name="info-circle"
          />
        </Toggletip>
      </div>
      <div className={logLineDetailsLinksStyles.links}>
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
            <span key={`${link.title}-${i}`} className={logLineDetailsLinksStyles.link}>
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

const getFieldStyles = (theme: GrafanaTheme2) => ({
  label: css({
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
    paddingRight: theme.spacing(1),
  }),
  labelIcon: css({
    marginLeft: theme.spacing(1),
  }),
  value: css({
    button: {
      visibility: 'hidden',
    },
    '&:hover': {
      button: {
        visibility: 'visible',
      },
    },
  }),
  links: css({
    paddingBottom: theme.spacing(0.5),
  }),
  link: css({
    marginRight: theme.spacing(0.5),
  }),
  valueContainer: css({
    display: 'flex',
    lineHeight: theme.typography.body.lineHeight,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    maxHeight: '50vh',
    overflow: 'auto',
  }),
});
