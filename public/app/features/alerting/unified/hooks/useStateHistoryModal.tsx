import * as stylex from '@stylexjs/stylex';
import { Suspense, lazy, useCallback, useMemo, useState } from 'react';

import { t } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { Modal } from '@grafana/ui';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import { type RulerGrafanaRuleDTO } from 'app/types/unified-alerting-dto';

const AnnotationsStateHistory = lazy(() => import('../components/rules/state-history/StateHistory'));
const LokiStateHistory = lazy(() => import('../components/rules/state-history/LokiStateHistory'));

export enum StateHistoryImplementation {
  Loki = 'loki',
  Annotations = 'annotations',
}

function useStateHistoryModal() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [rule, setRule] = useState<RulerGrafanaRuleDTO | undefined>();

  // can be "loki", "multiple" or "annotations"
  const stateHistoryBackend = config.unifiedAlerting.stateHistory?.backend;
  // can be "loki" or "annotations"
  const stateHistoryPrimary = config.unifiedAlerting.stateHistory?.primary;

  // if "loki" is either the backend or the primary, show the new state history implementation
  const usingNewAlertStateHistory = [stateHistoryBackend, stateHistoryPrimary].some(
    (implementation) => implementation === StateHistoryImplementation.Loki
  );
  const implementation = usingNewAlertStateHistory
    ? StateHistoryImplementation.Loki
    : StateHistoryImplementation.Annotations;

  const dismissModal = useCallback(() => {
    setRule(undefined);
    setShowModal(false);
  }, []);

  const openModal = useCallback((rule: RulerGrafanaRuleDTO) => {
    setRule(rule);
    setShowModal(true);
  }, []);

  const StateHistoryModal = useMemo(() => {
    if (!rule) {
      return null;
    }

    return (
      <Modal
        isOpen={showModal}
        onDismiss={dismissModal}
        closeOnBackdropClick={true}
        closeOnEscape={true}
        title={t('alerting.use-state-history-modal.state-history-modal.title-state-history', 'State history')}
        xstyle={styles.modal}
        contentXstyle={styles.modalContent}
      >
        <Suspense fallback={'Loading...'}>
          {implementation === StateHistoryImplementation.Loki && <LokiStateHistory ruleUID={rule.grafana_alert.uid} />}
          {implementation === StateHistoryImplementation.Annotations && (
            <AnnotationsStateHistory ruleUID={rule.grafana_alert.uid ?? ''} />
          )}
        </Suspense>
      </Modal>
    );
  }, [rule, showModal, dismissModal, implementation]);

  return {
    StateHistoryModal,
    showStateHistoryModal: openModal,
    hideStateHistoryModal: dismissModal,
  };
}

export { useStateHistoryModal };

const styles = stylex.create({
  modal: {
    width: '80%',
    height: '80%',
    minWidth: '800px',
  },
  // Modal's own small-screen padding still wins.
  modalContent: {
    height: '100%',
    width: '100%',
    paddingTop: { default: spacing['--gf-spacing-x2'], [bp.smDown]: spacing['--gf-spacing-x1'] },
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x2'],
    paddingLeft: spacing['--gf-spacing-x2'],
  },
});
