import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';

import { Trans } from '@grafana/i18n';
import { useSceneContext } from '@grafana/scenes-react';
import { Stack, Tooltip } from '@grafana/ui';

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
              {...mergeStylexClassName(stylex.props(formStyles.severityButton), activeLevel === def.level && stylex.props(formStyles.severityButtonActive))}
              onClick={() => toggle(def.level)}
            >
              <SeverityBars level={def.level} />
              <span {...stylex.props(severityFilterStyles.severityLabel)}>
                <Trans i18nKey={`alerting.triage.severity-${def.level}`}>{capitalise(def.level)}</Trans>
              </span>
              <span {...stylex.props(severityFilterStyles.severityCount)}>{count ? count.firing + count.pending : 0}</span>
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
    <span {...stylex.props(severityFilterStyles.bars)} aria-hidden>
      {Array.from({ length: 4 }, (_, i) => (
        <span
          key={i}
          {...mergeStylexClassName(stylex.props(formStyles.bar), i < filled ? styles[`bar_${level}`] : stylex.props(formStyles.barEmpty))}
          style={{ height: heights[i] }}
        />
      ))}
    </span>
  );
}

function capitalise(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

