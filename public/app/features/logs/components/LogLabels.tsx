import * as stylex from '@stylexjs/stylex';
import { type CSSProperties, memo, forwardRef, useMemo, useState, type JSX } from 'react';

import { type Labels } from '@grafana/data';
import { t } from '@grafana/i18n';
import { Button, Icon, Tooltip } from '@grafana/ui';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

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
        <span {...stylex.props(styles.logsLabels)}>
          <span {...stylex.props(styles.logsLabel)}>{emptyMessage}</span>
        </span>
      );
    }

    return (
      <span {...stylex.props(styles.logsLabels)}>
        {displayLabels.map((labelValue) => {
          return addTooltip ? (
            <Tooltip content={labelValue} key={labelValue} placement="top">
              <LogLabel>{labelValue}</LogLabel>
            </Tooltip>
          ) : (
            <LogLabel tooltip={labelValue} key={labelValue}>
              {labelValue}
            </LogLabel>
          );
        })}
        {displayLabels.length < allLabels.length && !displayAll && (
          <Button
            size="sm"
            fill="outline"
            variant="secondary"
            style={buttonStyle}
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
            style={buttonStyle}
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
    <span {...stylex.props(styles.logsLabels)}>
      {labels.map((label) => (
        <LogLabel key={label} tooltip={label}>
          {getNormalizedFieldName(label)}
        </LogLabel>
      ))}
    </span>
  );
});
LogLabelsList.displayName = 'LogLabelsList';

interface LogLabelProps {
  tooltip?: string;
  children: JSX.Element | string;
}

const LogLabel = forwardRef<HTMLSpanElement, LogLabelProps>(({ tooltip, children }: LogLabelProps, ref) => {
  return (
    <span {...stylex.props(styles.logsLabel)} ref={ref}>
      <span {...stylex.props(styles.logsLabelValue)} title={tooltip}>
        {children}
      </span>
    </span>
  );
});
LogLabel.displayName = 'LogLabel';

// Button has no xstyle and sets its own height, which a class from another stylex.props() call can't reliably
// override.
const buttonStyle: CSSProperties = { height: `calc(${spacing['--gf-spacing-grid-size']} * 2.75)` };

const styles = stylex.create({
  logsLabels: {
    display: 'inline-flex',
    flexWrap: 'wrap',
    fontSize: typography['--gf-typography-size-xs'],
    alignItems: 'center',
  },
  logsLabel: {
    display: 'flex',
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x0-25'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x0-25'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    borderRadius: shape['--gf-shape-radius-default'],
    marginTop: `calc(${spacing['--gf-spacing-grid-size']} * 0.125)`,
    marginRight: spacing['--gf-spacing-x0-5'],
    marginBottom: 0,
    marginLeft: 0,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    maxHeight: spacing['--gf-spacing-x2'],
  },
  logsLabelValue: {
    display: 'inline-block',
    maxWidth: `calc(${spacing['--gf-spacing-grid-size']} * 25)`,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
});
