import * as stylex from '@stylexjs/stylex';
import { effectsEditorStyles } from './EffectsEditor.stylex';

import { type ComponentProps, useId } from 'react';

import { t } from '@grafana/i18n';
import { Stack, Switch, Label, Tooltip, Grid } from '@grafana/ui';

import { type GaugePanelEffects } from './panelcfg.gen';

function EffectsEditorInput(props: ComponentProps<typeof Switch> & { tooltip?: string }) {
  const id = useId();
  const content = (
    <div {...stylex.props(effectsEditorStyles.container)}>
      <Stack gap={1} alignItems="center">
        <Switch {...props} id={id} />
        <Label {...stylex.props(effectsEditorStyles.label)} htmlFor={id}>
          {props.label}
        </Label>
      </Stack>
    </div>
  );
  if (props.tooltip) {
    return <Tooltip content={props.tooltip}>{content}</Tooltip>;
  }
  return content;
}


/**
 * Editor for all the radial bar effects options
 */
export function EffectsEditor(props: StandardEditorProps<GaugePanelEffects>) {
  return (
    <Grid alignItems={'flex-start'} gap={1} minColumnWidth={16}>
      <EffectsEditorInput
        label={t('gauge.config.effects.gradient', 'Gradient')}
        value={!!props.value?.gradient}
        onChange={(e) => props.onChange({ ...props.value, gradient: e.currentTarget.checked })}
      />
      <EffectsEditorInput
        label={t('gauge.config.effects.bar-glow', 'Bar glow')}
        value={!!props.value?.barGlow}
        onChange={(e) => props.onChange({ ...props.value, barGlow: e.currentTarget.checked })}
      />
      <EffectsEditorInput
        label={t('gauge.config.effects.center-glow', 'Center glow')}
        value={!!props.value?.centerGlow}
        onChange={(e) => props.onChange({ ...props.value, centerGlow: e.currentTarget.checked })}
      />
    </Grid>
  );
}
