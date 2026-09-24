import * as stylex from '@stylexjs/stylex';

import { type GrafanaTheme2 } from '@grafana/data';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { libraryPanelModalStyles } from './styles.stylex';

const cn = (key: keyof typeof libraryPanelModalStyles) =>
  mergeStylexClassName(stylex.props(libraryPanelModalStyles[key]), undefined).className ?? '';

/** @deprecated Emotion compat — use libraryPanelModalStyles with StyleX. */
export function getModalStyles(_theme: GrafanaTheme2) {
  return {
    myTable: cn('myTable'),
    noteTextbox: cn('noteTextbox'),
    textInfo: cn('textInfo'),
    dashboardSearch: cn('dashboardSearch'),
    modal: cn('modal'),
    modalText: cn('modalText'),
  };
}
