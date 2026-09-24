import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { ruleEditorSectionStyles } from './RuleEditorSection.stylex';
import * as React from 'react';
import { type ReactElement } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { FieldSet, InlineSwitch, Stack, Text } from '@grafana/ui';

export interface RuleEditorSectionProps {
  title: string;
  stepNo: number;
  description?: string | ReactElement;
  fullWidth?: boolean;
  switchMode?: {
    isAdvancedMode: boolean;
    setAdvancedMode: (isAdvanced: boolean) => void;
  };
}

export const RuleEditorSection = ({
  title,
  stepNo,
  children,
  fullWidth = false,
  description,
  switchMode,
}: React.PropsWithChildren<RuleEditorSectionProps>) => {

  const AlertRuleSelectors = selectors.components.AlertRules;
  return (
    <div {...stylex.props(ruleEditorSectionStyles.parent)} data-testid={AlertRuleSelectors.step(stepNo.toString())}>
      <FieldSet
        className={cx(fullWidth && ruleEditorSectionStyles.fullWidth)}
        label={
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Text variant="h3">
              {stepNo}. {title}
            </Text>
            {switchMode && (
              <Text variant="bodySmall">
                <InlineSwitch
                  data-testid={AlertRuleSelectors.stepAdvancedModeSwitch(stepNo.toString())}
                  value={switchMode.isAdvancedMode}
                  onChange={(event) => {
                    switchMode.setAdvancedMode(event.currentTarget.checked);
                  }}
                  label={t('alerting.rule-editor-section.label-advanced-options', 'Advanced options')}
                  showLabel
                  transparent
                  {...stylex.props(ruleEditorSectionStyles.reverse)}
                />
              </Text>
            )}
          </Stack>
        }
      >
        <Stack direction="column">
          {description && <div {...stylex.props(ruleEditorSectionStyles.description)}>{description}</div>}
          {children}
        </Stack>
      </FieldSet>
    </div>
  );
};

