import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing } from '../../../../core/stylex/spacing';

export const dataSourcePickerStyles = stylex.create({{
  dropdown_container: {
    position: 'relative',
          cursor: props.disabled ? 'not-allowed' : 'pointer',
          width: themeSpacing(props.width || 'auto'),
  },
  dropdown_trigger: {
    cursor: 'pointer',
          pointerEvents: props.disabled ? 'none' : 'auto',
  },
  dropdown_input: {
    'input::placeholder': {
            color: props.disabled ? grafanaTokens.colors_action_disabledText : grafanaTokens.colors_text_primary,
          },
  },
  picker_container: {
    display: 'flex',
          flexDirection: 'column',
          background: grafanaTokens.colors_background_elevated,
          borderRadius: grafanaTokens.shape_radius_default,
          boxShadow: grafanaTokens.shadows_z3,
          overflow: 'hidden',
          minWidth: calculateMinWidth('97vw'),
          '@media (min-width: 769px)': {
            minWidth: calculateMinWidth('80vw'),
          },
          '@media (min-width: 992px)': {
            minWidth: calculateMinWidth('60vw'),
          },
          '@media (min-width: 1200px)': {
            minWidth: calculateMinWidth('50vw'),
          },
          '@media (min-width: 1400px)': {
            minWidth: calculateMinWidth('40vw'),
          },
  },
  picker_picker: {
    background: grafanaTokens.colors_background_secondary,
  },
  picker_dataSourceList: {
    flex: 1,
  },
  picker_footer: {
    flex: 0,
          display: 'flex',
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          padding: themeSpacing(1.5),
          borderTop: `1px solid ${grafanaTokens.colors_border_weak}`,
          backgroundColor: grafanaTokens.colors_background_secondary,
  },
  footer_footer: {
    flex: 0,
          display: 'flex',
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          padding: themeSpacing(1.5),
          borderTop: `1px solid ${grafanaTokens.colors_border_weak}`,
          backgroundColor: grafanaTokens.colors_background_secondary,
  },
});
