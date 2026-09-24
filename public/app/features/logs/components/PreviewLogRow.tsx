import * as stylex from '@stylexjs/stylex';

import { mergeStylexProps } from '@grafana/ui/internal';

import { type Props } from './LogRow';
import { LogRowMessageDisplayedFields } from './LogRowMessageDisplayedFields';
import { logRowStyles } from './getLogRowStyles';

const emptyFn = () => {};
export const PreviewLogRow = ({ row, showDuplicates, showLabels, showTime, displayedFields, ...rest }: Props) => {
  return (
    <tr>
      {showDuplicates && <td></td>}
      <td></td>
      <td></td>
      {showTime && <td>{row.timeEpochMs}</td>}
      {showLabels && row.uniqueLabels && <td></td>}
      {displayedFields && displayedFields.length > 0 ? (
        <LogRowMessageDisplayedFields
          {...rest}
          row={row}
          detectedFields={displayedFields}
          mouseIsOver={false}
          onBlur={emptyFn}
          onOpenContext={emptyFn}
          preview
        />
      ) : (
        <td {...stylex.props(logRowStyles.logsRowMessage)}>{row.entry}</td>
      )}
      <td {...mergeStylexProps(stylex.props(logRowStyles.logRowMenuCell), { className: 'log-row-menu-cell' })}></td>
    </tr>
  );
};
