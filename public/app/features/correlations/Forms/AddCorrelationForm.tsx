import * as stylex from '@stylexjs/stylex';
import { useEffect } from 'react';

import { useCreateCorrelationMutation } from '@grafana/api-clients/rtkq/correlations/v0alpha1';
import { config } from '@grafana/runtime';
import { PanelContainer } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import { CloseButton } from 'app/core/components/CloseButton/CloseButton';

import { Wizard } from '../components/Wizard/Wizard';
import { useCorrelations } from '../useCorrelations';
import { generateAddSpec } from '../utils';

import { ConfigureCorrelationBasicInfoForm } from './ConfigureCorrelationBasicInfoForm';
import { ConfigureCorrelationSourceForm } from './ConfigureCorrelationSourceForm';
import { ConfigureCorrelationTargetForm } from './ConfigureCorrelationTargetForm';
import { CorrelationFormNavigation } from './CorrelationFormNavigation';
import { CorrelationsFormContextProvider } from './correlationsFormContext';
import { type FormDTO } from './types';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export const AddCorrelationFormWrapper = ({ onClose, onCreated }: Props) => {
  if (config.featureToggles.kubernetesCorrelations) {
    return <AddCorrelationFormAppPlatform onClose={onClose} onCreated={onCreated} />;
  }

  return <AddCorrelationFormLegacy onClose={onClose} onCreated={onCreated} />;
};

export const AddCorrelationFormAppPlatform = ({ onClose, onCreated }: Props) => {
  const [createCorrelation, { data, isLoading, isError }] = useCreateCorrelationMutation();

  useEffect(() => {
    if (!isError && !isLoading && data) {
      onCreated();
    }
  }, [onCreated, isError, isLoading, data]);

  const defaultValues: Partial<FormDTO> = { type: 'query', config: { target: {}, field: '' } };

  const onSubmit = async (data: FormDTO) => {
    const corrSpec = await generateAddSpec(data);
    return createCorrelation({
      correlation: {
        metadata: {},
        apiVersion: 'correlations.grafana.app/v0alpha1',
        kind: 'Correlation',
        spec: corrSpec,
      },
    });
  };

  return (
    <PanelContainer className={stylex.props(styles.panelContainer).className}>
      <CloseButton onClick={onClose} />
      <CorrelationsFormContextProvider data={{ loading: isLoading, readOnly: false, correlation: undefined }}>
        <Wizard<FormDTO>
          defaultValues={defaultValues}
          pages={[ConfigureCorrelationBasicInfoForm, ConfigureCorrelationTargetForm, ConfigureCorrelationSourceForm]}
          navigation={CorrelationFormNavigation}
          onSubmit={onSubmit}
        />
      </CorrelationsFormContextProvider>
    </PanelContainer>
  );
};

export const AddCorrelationFormLegacy = ({ onClose, onCreated }: Props) => {
  const {
    create: { execute, loading, error, value },
  } = useCorrelations();

  useEffect(() => {
    if (!error && !loading && value) {
      onCreated();
    }
  }, [error, loading, value, onCreated]);

  const defaultValues: Partial<FormDTO> = { type: 'query', config: { target: {}, field: '' } };

  return (
    <PanelContainer className={stylex.props(styles.panelContainer).className}>
      <CloseButton onClick={onClose} />
      <CorrelationsFormContextProvider data={{ loading, readOnly: false, correlation: undefined }}>
        <Wizard<FormDTO>
          defaultValues={defaultValues}
          pages={[ConfigureCorrelationBasicInfoForm, ConfigureCorrelationTargetForm, ConfigureCorrelationSourceForm]}
          navigation={CorrelationFormNavigation}
          onSubmit={execute}
        />
      </CorrelationsFormContextProvider>
    </PanelContainer>
  );
};

const styles = stylex.create({
  panelContainer: {
    position: 'relative',
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
    marginBottom: spacing['--gf-spacing-x2'],
  },
});
