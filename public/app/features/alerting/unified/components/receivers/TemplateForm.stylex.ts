import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const templateFormStyles = stylex.create({
  flexFull: {
    flex: 1,
  },
  minEditorSize: {
    minHeight: 300,
          minWidth: 300,
  },
  payloadEditor: {
    minHeight: 0,
  },
  containerWithBorderAndRadius: {
    borderRadius: grafanaTokens.shape_radius_default,
          border: `1px solid ${grafanaTokens.colors_border_medium}`,
  },
  flexColumn: {
    display: 'flex',
          flex: 1,
          flexDirection: 'column',
  },
  form: {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
  },
  fieldset: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
  },
  label: {
    margin: 0,
  },
  contentContainer: {
    flex: 1,
          display: 'flex',
          flexDirection: 'row',
  },
  contentField: {
    display: 'flex',
          flexDirection: 'column',
          flex: 1,
          marginBottom: 0,
  },
  templatePreview: {
    flex: 1,
          display: 'flex',
  },
  templatePayload: {
    flex: 1,
  },
  editorContainer: {
    width: 'fit-content',
          border: 'none',
  },
  payloadCollapseButton: {
    backgroundColor: grafanaTokens.colors_info_transparent,
          margin: 0,
          [narrowScreenQuery]: {
            display: 'none',
          },
  },
  code: {
    color: grafanaTokens.colors_text_secondary,
          fontWeight: grafanaTokens.typography_fontWeightBold,
  },
});
