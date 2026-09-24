import * as stylex from '@stylexjs/stylex';
import { memo, type ReactNode, useMemo } from 'react';

import { type LogRowModel } from '@grafana/data';
import { mergeStylexProps } from '@grafana/ui/internal';
import { type GetFieldLinksFn } from 'app/plugins/panel/logs/types';

import { LogRowMenuCell } from './LogRowMenuCell';
import { LOG_LINE_BODY_FIELD_NAME } from './fieldSelector/logFields';
import { logRowStyles } from './getLogRowStyles';
import { getAllFields } from './logParser';

export interface Props {
  row: LogRowModel;
  detectedFields: string[];
  wrapLogMessage: boolean;
  getFieldLinks?: GetFieldLinksFn;
  showContextToggle?: (row: LogRowModel) => boolean;
  onOpenContext: (row: LogRowModel) => void;
  onPermalinkClick?: (row: LogRowModel) => Promise<void>;
  onPinLine?: (row: LogRowModel) => void;
  onUnpinLine?: (row: LogRowModel) => void;
  pinned?: boolean;
  mouseIsOver: boolean;
  onBlur: () => void;
  logRowMenuIconsBefore?: ReactNode[];
  logRowMenuIconsAfter?: ReactNode[];
  preview?: boolean;
}

export const LogRowMessageDisplayedFields = memo((props: Props) => {
  const {
    row,
    detectedFields,
    getFieldLinks,
    wrapLogMessage,
    mouseIsOver,
    pinned,
    logRowMenuIconsBefore,
    logRowMenuIconsAfter,
    preview,
    ...rest
  } = props;
  const fields = useMemo(() => getAllFields(row, getFieldLinks), [getFieldLinks, row]);
  // only single key/value rows are filterable, so we only need the first field key for filtering
  const line = useMemo(() => {
    let line = '';
    for (let i = 0; i < detectedFields.length; i++) {
      const parsedKey = detectedFields[i];

      if (parsedKey === LOG_LINE_BODY_FIELD_NAME) {
        line += ` ${row.entry}`;
      }

      const field = fields.find((field) => {
        return field.keys[0] === parsedKey;
      });

      if (field != null) {
        line += ` ${parsedKey}=${field.values}`;
      }

      if (row.labels[parsedKey] != null && row.labels[parsedKey] != null) {
        line += ` ${parsedKey}=${row.labels[parsedKey]}`;
      }
    }
    return line.trimStart();
  }, [detectedFields, fields, row.entry, row.labels]);

  const shouldShowMenu = mouseIsOver || pinned;

  if (preview) {
    return (
      <>
        <td>
          <div>{line}</div>
        </td>
        <td></td>
      </>
    );
  }

  return (
    <>
      <td {...stylex.props(logRowStyles.logsRowMessage)}>
        <div {...stylex.props(!wrapLogMessage && styles.noWrap)}>{line}</div>
      </td>
      <td {...mergeStylexProps(stylex.props(logRowStyles.logRowMenuCell), { className: 'log-row-menu-cell' })}>
        {shouldShowMenu && (
          <LogRowMenuCell
            logText={line}
            row={row}
            pinned={pinned}
            mouseIsOver={mouseIsOver}
            addonBefore={logRowMenuIconsBefore}
            addonAfter={logRowMenuIconsAfter}
            {...rest}
          />
        )}
      </td>
    </>
  );
});

LogRowMessageDisplayedFields.displayName = 'LogRowMessageDisplayedFields';

const styles = stylex.create({
  noWrap: {
    whiteSpace: 'nowrap',
  },
});
