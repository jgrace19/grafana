import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import { type ReactElement } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { FieldSet, InlineSwitch, Stack, Text } from '@grafana/ui';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

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
    <div {...stylex.props(styles.parent)} data-testid={AlertRuleSelectors.step(stepNo.toString())}>
      <FieldSet
        className={stylex.props(fullWidth && styles.fullWidth).className}
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
                  className={stylex.props(styles.reverse).className}
                />
              </Text>
            )}
          </Stack>
        }
      >
        <Stack direction="column">
          {description && <div {...stylex.props(styles.description)}>{description}</div>}
          {children}
        </Stack>
      </FieldSet>
    </div>
  );
};

const styles = stylex.create({
  parent: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    borderRadius: shape['--gf-shape-radius-lg'],
    paddingTop: spacing['--gf-spacing-x2'],
    paddingRight: spacing['--gf-spacing-x3'],
    paddingBottom: spacing['--gf-spacing-x2'],
    paddingLeft: spacing['--gf-spacing-x3'],
  },
  description: {
    marginTop: `calc(${spacing['--gf-spacing-x2']} * -1)`,
  },
  fullWidth: {
    width: '100%',
  },
  reverse: {
    flexDirection: 'row-reverse',
    gap: spacing['--gf-spacing-x1'],
  },
});
