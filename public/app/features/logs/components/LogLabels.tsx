import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { logLabelsStyles } from './LogLabels.stylex';
import { memo, forwardRef, useMemo, useState, type JSX } from 'react';

import { t } from '@grafana/i18n';
import { Button, Icon, Tooltip } from '@grafana/ui';

import { getNormalizedFieldName } from './panel/processing';

// Levels are already encoded in color, filename is a Loki-ism
const HIDDEN_LABELS = ['detected_level', 'level', 'lvl', 'filename'];

export interface Props {
  labels: Labels;
  emptyMessage?: string;
  addTooltip?: boolean;
  displayMax?: number;
  displayAll?: boolean;
  onDisplayMaxToggle?(state: boolean): void;
}

export const LogLabels = memo(
  ({
    labels,
    emptyMessage,
    addTooltip = true,
    displayMax,
    onDisplayMaxToggle,
    displayAll: initialDisplayAll = false,
  }: Props) => {
    const [displayAll, setDisplayAll] = useState<boolean | undefined>(displayMax ? initialDisplayAll : undefined);
    const allLabels = useMemo(
      () =>
        Object.keys(labels)
          .filter((label) => !label.startsWith('_') && !HIDDEN_LABELS.includes(label) && labels[label])
          .map((label) => `${label}=${labels[label]}`),
      [labels]
    );
    const displayLabels = useMemo(
      () => allLabels.slice(0, !displayAll && displayMax ? displayMax : Infinity),
      [allLabels, displayAll, displayMax]
    );

    if (displayLabels.length === 0 && emptyMessage) {
      return (
        <span {...stylex.props(logLabelsStyles.logsLabels)}>
          <span {...stylex.props(logLabelsStyles.logsLabel)}>{emptyMessage}</span>
        </span>
      );
    }

    return (
      <span {...stylex.props(logLabelsStyles.logsLabels)}>
        {displayLabels.map((labelValue) => {
          return addTooltip ? (
            <Tooltip content={labelValue} key={labelValue} placement="top">
              <LogLabel styles={styles}>{labelValue}</LogLabel>
            </Tooltip>
          ) : (
            <LogLabel styles={styles} tooltip={labelValue} key={labelValue}>
              {labelValue}
            </LogLabel>
          );
        })}
        {displayLabels.length < allLabels.length && !displayAll && (
          <Button
            size="sm"
            fill="outline"
            variant="secondary"
            {...stylex.props(logLabelsStyles.button)}
            aria-label={t('logs.log-labels.expand', 'Expand labels')}
            onClick={() => {
              setDisplayAll(true);
              onDisplayMaxToggle?.(true);
            }}
          >
            <Icon name="plus" size="xs" />
            {allLabels.length - displayLabels.length}
          </Button>
        )}
        {displayAll === true && (
          <Button
            size="sm"
            fill="outline"
            variant="secondary"
            {...stylex.props(logLabelsStyles.button)}
            aria-label={t('logs.log-labels.collapse', 'Collapse labels')}
            onClick={() => {
              setDisplayAll(false);
              onDisplayMaxToggle?.(false);
            }}
          >
            <Icon name="minus" size="xs" />
          </Button>
        )}
      </span>
    );
  }
);
LogLabels.displayName = 'LogLabels';

interface LogLabelsArrayProps {
  labels: string[];
}

export const LogLabelsList = memo(({ labels }: LogLabelsArrayProps) => {

  return (
    <span {...stylex.props(logLabelsStyles.logsLabels)}>
      {labels.map((label) => (
        <LogLabel key={label} styles={styles} tooltip={label}>
          {getNormalizedFieldName(label)}
        </LogLabel>
      ))}
    </span>
  );
});
LogLabelsList.displayName = 'LogLabelsList';

interface LogLabelProps {
  styles: Record<string, string>;
  tooltip?: string;
  children: JSX.Element | string;
}

const LogLabel = forwardRef<HTMLSpanElement, LogLabelProps>(({ styles, tooltip, children }: LogLabelProps, ref) => {
  return (
    <span {...stylex.props(logLabelsStyles.logsLabel)} ref={ref}>
      <span {...stylex.props(logLabelsStyles.logsLabelValue)} title={tooltip}>
        {children}
      </span>
    </span>
  );
});
LogLabel.displayName = 'LogLabel';

;
