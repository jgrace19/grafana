import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { Field, Input, Stack, Text } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { type RuleFormValues } from '../types/rule-form';
import { GRAFANA_RULES_SOURCE_NAME } from '../utils/datasource';

import { FolderSelectorV2 } from './rule-editor/FolderSelectorV2';
import { LabelsEditorModal } from './rule-editor/labels/LabelsEditorModal';
import { LabelsFieldInFormV2 } from './rule-editor/labels/LabelsFieldInFormV2';

/**
 * Rule definition section (name, folder, labels) for the alert rule drawer. Drawer only supports GMA.
 */
export function RuleDefinitionSection() {
  const {
    register,
    formState: {
      errors,
    },
    setValue,
    getValues,
  } = useFormContext<RuleFormValues>();
  const [showLabelsEditor, setShowLabelsEditor] = useState(false);

  return (
    <section {...stylex.props(styles.section)} aria-labelledby="rule-definition-section-heading">
      <div {...stylex.props(styles.sectionHeaderRow)}>
        <Text element="h3" variant="h4" id="rule-definition-section-heading">
          {`1. `}
          <Trans i18nKey="alerting.simplified.rule-definition">Rule Definition</Trans>
        </Text>
      </div>
      <div>
        <Stack direction="column" gap={2}>
          <Field
            noMargin
            label={
              <Text variant="bodySmall" weight="medium">
                <Trans i18nKey="alerting.alert-rule-name-and-metric.label-name">Name</Trans>
              </Text>
            }
            error={errors?.name?.message}
            invalid={!!errors.name?.message}
          >
            <Input
              data-testid={selectors.components.AlertRules.ruleNameField}
              id="name"
              width={38}
              {...register('name', {
                required: {
                  value: true,
                  message: t('alerting.alert-rule-name-and-metric.message.must-enter-a-name', 'Must enter a name'),
                },
              })}
              aria-label={t('alerting.alert-rule-name-and-metric.aria-label-name', 'name')}
              placeholder={t(
                'alerting.alert-rule-name-and-metric.placeholder-name',
                'Give your {{namePlaceholder}} a name',
                { namePlaceholder: 'alert rule' }
              )}
            />
          </Field>

          <FolderSelectorV2 />
          <LabelsFieldInFormV2 onEditClick={() => setShowLabelsEditor(true)} />
          <LabelsEditorModal
            isOpen={showLabelsEditor}
            onClose={(labelsToUpdate) => {
              if (labelsToUpdate) {
                const filtered = labelsToUpdate.filter((l) => (l?.key ?? '').length > 0 || (l?.value ?? '').length > 0);
                setValue('labels', filtered, { shouldDirty: true, shouldValidate: true });
              }
              setShowLabelsEditor(false);
            }}
            dataSourceName={GRAFANA_RULES_SOURCE_NAME}
            initialLabels={getValues('labels')}
          />
        </Stack>
      </div>
    </section>
  );
}

const styles = stylex.create({
  section: {
    width: '100%',
  },
  sectionHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    marginBottom: spacing['--gf-spacing-x1'],
  },
});
