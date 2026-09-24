// Copyright (c) 2017 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { Button } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

type CollapserProps = {
  onCollapseAll: () => void;
  onCollapseOne: () => void;
  onExpandOne: () => void;
  onExpandAll: () => void;
};

export function TimelineCollapser(props: CollapserProps) {
  const { onExpandAll, onExpandOne, onCollapseAll, onCollapseOne } = props;

  return (
    <div {...stylex.props(styles.TimelineCollapser)} data-testid="TimelineCollapser">
      <div {...stylex.props(styles.buttonsContainer)}>
        <div {...stylex.props(styles.buttonContainer)}>
          <Button
            aria-label={t('explore.timeline-collapser.tooltip-expand', 'Expand +1')}
            tooltip={t('explore.timeline-collapser.tooltip-expand', 'Expand +1')}
            size="sm"
            tooltipPlacement="top"
            icon="angle-down"
            onClick={onExpandOne}
            fill="solid"
            variant="secondary"
          />
          <Button
            aria-label={t('explore.timeline-collapser.tooltip-collapse', 'Collapse +1')}
            tooltip={t('explore.timeline-collapser.tooltip-collapse', 'Collapse +1')}
            size="sm"
            tooltipPlacement="top"
            icon="angle-up"
            onClick={onCollapseOne}
            fill="solid"
            variant="secondary"
          />
        </div>
        <div {...stylex.props(styles.buttonContainer)}>
          <Button
            aria-label={t('explore.timeline-collapser.tooltip-expand-all', 'Expand all')}
            tooltip={t('explore.timeline-collapser.tooltip-expand-all', 'Expand all')}
            size="sm"
            tooltipPlacement="top"
            icon="angle-double-down"
            onClick={onExpandAll}
            fill="solid"
            variant="secondary"
          />
          <Button
            aria-label={t('explore.timeline-collapser.tooltip-collapse-all', 'Collapse all')}
            tooltip={t('explore.timeline-collapser.tooltip-collapse-all', 'Collapse all')}
            size="sm"
            tooltipPlacement="top"
            icon="angle-double-up"
            onClick={onCollapseAll}
            fill="solid"
            variant="secondary"
          />
        </div>
      </div>
    </div>
  );
}

const styles = stylex.create({
  TimelineCollapser: {
    alignItems: 'center',
    display: 'flex',
    flex: 'none',
    justifyContent: 'center',
    marginRight: '0.5rem',
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '0.5rem',
    paddingRight: spacing['--gf-spacing-x1'],
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
  },
});
