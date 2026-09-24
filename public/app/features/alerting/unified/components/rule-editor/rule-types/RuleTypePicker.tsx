import * as stylex from '@stylexjs/stylex';
import { isEmpty } from 'lodash';

import { Trans } from '@grafana/i18n';
import { Stack } from '@grafana/ui';
import { colors } from '@grafana/ui/stylex/tokens.stylex';

import { useRulesSourcesWithRuler } from '../../../hooks/useRuleSourcesWithRuler';
import { RuleFormType } from '../../../types/rule-form';

import { GrafanaManagedRuleType } from './GrafanaManagedAlert';
import { MimirFlavoredType } from './MimirOrLokiAlert';
interface RuleTypePickerProps {
  onChange: (value: RuleFormType) => void;
  selected: RuleFormType;
  enabledTypes: RuleFormType[];
}

const RuleTypePicker = ({ selected, onChange, enabledTypes }: RuleTypePickerProps) => {
  const { rulesSourcesWithRuler } = useRulesSourcesWithRuler();
  const hasLotexDatasources = !isEmpty(rulesSourcesWithRuler);

  const handleChange = (type: RuleFormType) => {
    onChange(type);
  };

  return (
    <>
      <Stack direction="row" gap={2}>
        {enabledTypes.includes(RuleFormType.grafana) && (
          <GrafanaManagedRuleType selected={selected === RuleFormType.grafana} onClick={handleChange} />
        )}
        {enabledTypes.includes(RuleFormType.cloudAlerting) && (
          <MimirFlavoredType
            selected={selected === RuleFormType.cloudAlerting}
            onClick={handleChange}
            disabled={!hasLotexDatasources}
          />
        )}
      </Stack>
      {enabledTypes.includes(RuleFormType.grafana) && (
        <small {...stylex.props(styles.meta)}>
          <Trans i18nKey="alerting.rule-type-picker.grafana-managed">
            Select &ldquo;Grafana managed&rdquo; unless you have a Mimir, Loki or Cortex data source with the Ruler API
            enabled.
          </Trans>
        </small>
      )}
    </>
  );
};

const styles = stylex.create({
  meta: {
    color: colors['--gf-colors-text-disabled'],
  },
});

export { RuleTypePicker };
