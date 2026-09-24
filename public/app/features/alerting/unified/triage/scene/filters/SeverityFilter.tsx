import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';
import { useSceneContext } from '@grafana/scenes-react';
import { Stack, Tooltip } from '@grafana/ui';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { COMBINED_FILTER_LABEL_KEYS } from '../../constants';
import { type LabelStats } from '../useLabelsBreakdown';
import { addOrReplaceFilter, removeFilter, useRegexFilterValue } from '../utils';

import { SEVERITY_DEFINITIONS, type SeverityLevel, canonicalSeverity, severityFilterRegex } from './severity';

interface SeverityCount {
  firing: number;
  pending: number;
}

function useSeverityCounts(labels: LabelStats[]): Map<SeverityLevel, SeverityCount> {
  const severityKeys = COMBINED_FILTER_LABEL_KEYS.severity;
  const counts = new Map<SeverityLevel, SeverityCount>();

  for (const key of severityKeys) {
    const severityStats = labels.find((l) => l.key === key);
    if (!severityStats) {
      continue;
    }

    for (const { value, firing, pending } of severityStats.values) {
      const level = canonicalSeverity(value);
      if (!level) {
        continue;
      }
      const existing = counts.get(level) ?? { firing: 0, pending: 0 };
      counts.set(level, { firing: existing.firing + firing, pending: existing.pending + pending });
    }
  }

  return counts;
}

interface SeverityFilterProps {
  labels: LabelStats[];
}

export function SeverityFilter({ labels }: SeverityFilterProps) {
  const sceneContext = useSceneContext();
  const activeValue = useRegexFilterValue('severity');
  const counts = useSeverityCounts(labels);

  const activeLevel = SEVERITY_DEFINITIONS.find((d) => activeValue === severityFilterRegex(d.level))?.level;

  const toggle = (level: SeverityLevel) => {
    const regex = severityFilterRegex(level);
    if (activeLevel === level) {
      removeFilter(sceneContext, 'severity');
    } else {
      addOrReplaceFilter(sceneContext, 'severity', '=~', regex);
    }
  };

  return (
    <Stack direction="column" gap={0.5}>
      {SEVERITY_DEFINITIONS.map((def) => {
        const count = counts.get(def.level);
        return (
          <Tooltip key={def.level} content={def.values.slice(1).join(', ')} placement="right">
            <button
              {...stylex.props(styles.severityButton, activeLevel === def.level && styles.severityButtonActive)}
              onClick={() => toggle(def.level)}
            >
              <SeverityBars level={def.level} />
              <span {...stylex.props(styles.severityLabel)}>
                <Trans i18nKey={`alerting.triage.severity-${def.level}`}>{capitalise(def.level)}</Trans>
              </span>
              <span {...stylex.props(styles.severityCount)}>{count ? count.firing + count.pending : 0}</span>
            </button>
          </Tooltip>
        );
      })}
    </Stack>
  );
}

interface SeverityBarsProps {
  level: SeverityLevel;
}

function SeverityBars({ level }: SeverityBarsProps) {
  const def = SEVERITY_DEFINITIONS.find((d) => d.level === level);
  const filled = def?.bars ?? 0;
  const heights = [4, 7, 10, 13];

  return (
    <span {...stylex.props(styles.bars)} aria-hidden>
      {Array.from({ length: 4 }, (_, i) => (
        <span
          key={i}
          {...stylex.props(styles.bar, i < filled ? barStyles[level] : styles.barEmpty)}
          style={{ height: heights[i] }}
        />
      ))}
    </span>
  );
}

function capitalise(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const styles = stylex.create({
  severityButton: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    width: '100%',
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    backgroundColor: { default: 'transparent', ':hover': colors['--gf-colors-action-hover'] },
    backgroundImage: 'none',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderRadius: shape['--gf-shape-radius-default'],
    cursor: 'pointer',
    color: colors['--gf-colors-text-secondary'],
    textAlign: 'left',
  },
  // Repeats the hover background: a later namespace replaces the whole property, conditions included.
  severityButtonActive: {
    backgroundColor: { default: colors['--gf-colors-action-selected'], ':hover': colors['--gf-colors-action-hover'] },
  },
  severityLabel: {
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
  severityCount: {
    marginLeft: 'auto',
    fontSize: typography['--gf-typography-body-small-font-size'],
    color: colors['--gf-colors-text-secondary'],
    fontVariantNumeric: 'tabular-nums',
  },
  bars: {
    display: 'inline-flex',
    alignItems: 'flex-end',
    gap: 2,
    flexShrink: 0,
  },
  bar: {
    width: 4,
    borderRadius: shape['--gf-shape-radius-default'],
  },
  barEmpty: {
    backgroundColor: colors['--gf-colors-border-medium'],
  },
});

const barStyles = stylex.create({
  low: {
    backgroundColor: colors['--gf-colors-success-text'],
  },
  minor: {
    backgroundColor: colors['--gf-colors-warning-text'],
  },
  major: {
    backgroundColor: colors['--gf-colors-warning-main'],
  },
  critical: {
    backgroundColor: colors['--gf-colors-error-text'],
  },
});
