import * as stylex from '@stylexjs/stylex';

import { type GrafanaTheme2 } from '@grafana/data';
import { config } from '@grafana/runtime';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { panelInspectorStyles } from './styles.stylex';

function panelInspectorClassNames() {
  const cn = (key: keyof typeof panelInspectorStyles) =>
    mergeStylexClassName(stylex.props(panelInspectorStyles[key]), undefined).className ?? '';
  return {
    heading: cn('heading'),
    wrap: cn('wrap'),
    toolbar: cn('toolbar'),
    toolbarItem: cn('toolbarItem'),
    content: cn('content'),
    editor: cn('editor'),
    viewer: cn('viewer'),
    dataFrameSelect: cn('dataFrameSelect'),
    leftActions: cn('leftActions'),
    options: cn('options'),
    dataDisplayOptions: cn('dataDisplayOptions'),
    selects: cn('selects'),
  };
}

/** @deprecated */
export const getPanelInspectorStyles = () => getPanelInspectorStyles2(config.theme2);

/** @deprecated Emotion compat — use panelInspectorStyles with StyleX. */
export const getPanelInspectorStyles2 = (_theme: GrafanaTheme2) => panelInspectorClassNames();
