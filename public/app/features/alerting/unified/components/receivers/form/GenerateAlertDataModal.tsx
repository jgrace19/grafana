import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { generateAlertDataModalStyles } from './GenerateAlertDataModal.stylex';
import { addDays, subDays } from 'date-fns';
import { uniqueId } from 'lodash';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Trans, t } from '@grafana/i18n';
import { Button, Card, Modal, RadioButtonGroup, Stack } from '@grafana/ui';
import { type TestTemplateAlert } from 'app/plugins/datasource/alertmanager/types';

import { type KeyValueField } from '../../../api/templateApi';
import AnnotationsStep from '../../rule-editor/AnnotationsStep';
import LabelsField from '../../rule-editor/labels/LabelsField';

interface Props {
  isOpen: boolean;
  onDismiss: () => void;
  onAccept: (alerts: TestTemplateAlert[]) => void;
}

interface FormFields {
  annotations: KeyValueField[];
  labels: KeyValueField[];
  status: 'firing' | 'resolved';
}

const defaultValues: FormFields = {
  annotations: [{ key: '', value: '' }],
  labels: [{ key: '', value: '' }],
  status: 'firing',
};

export const GenerateAlertDataModal = ({ isOpen, onDismiss, onAccept }: Props) => {

  const [alerts, setAlerts] = useState<TestTemplateAlert[]>([]);

  const formMethods = useForm<FormFields>({ defaultValues, mode: 'onBlur' });
  const annotations = formMethods.watch('annotations');
  const labels = formMethods.watch('labels');
  const [status, setStatus] = useState<'firing' | 'resolved'>('firing');

  const onAdd = () => {
    const alert: TestTemplateAlert = {
      annotations: annotations
        .filter(({ key, value }) => !!key && !!value)
        .reduce((acc, { key, value }) => {
          return { ...acc, [key]: value };
        }, {}),
      labels: labels
        .filter(({ key, value }) => !!key && !!value)
        .reduce((acc, { key, value }) => {
          return { ...acc, [key]: value };
        }, {}),
      startsAt: '2023-04-01T00:00:00Z',
      endsAt: status === 'firing' ? addDays(new Date(), 1).toISOString() : subDays(new Date(), 1).toISOString(),
      status,
      fingerprint: uniqueId('fingerprint_'),
    };
    setAlerts((alerts) => [...alerts, alert]);
    formMethods.reset();
  };

  const onSubmit = () => {
    onAccept(alerts);
    setAlerts([]);
    formMethods.reset();
    setStatus('firing');
  };

  const labelsOrAnnotationsAdded = () => {
    const someLabels = labels.some((lb) => lb.key !== '' && lb.value !== '');
    const someAnnotations = annotations.some((ann) => ann.key !== '' && ann.value !== '');
    return someLabels || someAnnotations;
  };

  type AlertOption = {
    label: string;
    value: 'firing' | 'resolved';
  };
  const alertOptions: AlertOption[] = [
    {
      label: t('alerting.generate-alert-data-modal.alert-options.label.firing', 'Firing'),
      value: 'firing',
    },
    { label: t('alerting.generate-alert-data-modal.alert-options.label.resolved', 'Resolved'), value: 'resolved' },
  ];

  return (
    <Modal
      onDismiss={onDismiss}
      isOpen={isOpen}
      title={t('alerting.generate-alert-data-modal.title-add-custom-alerts', 'Add custom alerts')}
    >
      <FormProvider {...formMethods}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            formMethods.reset();
            setStatus('firing');
          }}
        >
          <Card noMargin>
            <Stack direction="column" gap={1}>
              <div {...stylex.props(generateAlertDataModalStyles.section)}>
                <AnnotationsStep />
              </div>
              <div {...stylex.props(generateAlertDataModalStyles.section)}>
                <LabelsField />
              </div>
              <div {...stylex.props(generateAlertDataModalStyles.flexWrapper)}>
                <RadioButtonGroup value={status} options={alertOptions} onChange={(value) => setStatus(value)} />
                <Button
                  onClick={onAdd}
                  {...stylex.props(generateAlertDataModalStyles.onAddButton)}
                  icon="plus-circle"
                  type="button"
                  variant="secondary"
                  disabled={!labelsOrAnnotationsAdded()}
                >
                  <Trans i18nKey="alerting.generate-alert-data-modal.add-alert-data">Add alert data</Trans>
                </Button>
              </div>
            </Stack>
          </Card>
          <div {...stylex.props(generateAlertDataModalStyles.onSubmitWrapper)} />
          {alerts.length > 0 && (
            <Stack direction="column" gap={1}>
              <h5>
                <Trans i18nKey="alerting.generate-alert-data-modal.review-alert-payload">
                  {' '}
                  Review alert data to add to the payload:
                </Trans>
              </h5>
              <pre {...stylex.props(generateAlertDataModalStyles.result)} data-testid="payloadJSON">
                {JSON.stringify(alerts, null, 2)}
              </pre>
            </Stack>
          )}
          <div {...stylex.props(generateAlertDataModalStyles.onSubmitWrapper)}>
            <Modal.ButtonRow>
              <Button onClick={onSubmit} disabled={alerts.length === 0} {...stylex.props(generateAlertDataModalStyles.onSubmitButton)}>
                <Trans i18nKey="alerting.generate-alert-data-modal.add-alert-data-to-payload">
                  Add alert data to payload
                </Trans>
              </Button>
            </Modal.ButtonRow>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};

