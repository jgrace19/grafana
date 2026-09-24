import * as stylex from '@stylexjs/stylex';

import { colors, shape } from '@grafana/ui/stylex/tokens.stylex';

import { QueryEditorType } from '../constants';

import { QueryEditorBody } from './Body/QueryEditorBody';
import { QueryEditorFooter } from './Footer/QueryEditorFooter';
import { ContentHeaderSceneWrapper } from './Header/ContentHeader';
import { DatasourceHelpPanel } from './Header/DatasourceHelpPanel';
import { useAlertingContext, useQueryEditorUIContext } from './QueryEditorContext';

export function QueryEditorContent() {
  const { cardType, showingDatasourceHelp, pendingExpression, pendingTransformation } = useQueryEditorUIContext();
  const { alertRules } = useAlertingContext();
  const hasPendingPicker = !!pendingExpression || !!pendingTransformation;
  const isAlertView = cardType === QueryEditorType.Alert;
  const isAlertEmptyState = isAlertView && alertRules.length === 0;

  const shouldShowHeader = !isAlertEmptyState;
  const shouldShowFooter = !hasPendingPicker && !isAlertView;
  const shouldShowDatasourceHelp = !hasPendingPicker && showingDatasourceHelp;

  return (
    <div {...stylex.props(styles.container)}>
      {shouldShowHeader && <ContentHeaderSceneWrapper />}
      {shouldShowDatasourceHelp && <DatasourceHelpPanel />}
      <QueryEditorBody />
      {shouldShowFooter && <QueryEditorFooter />}
    </div>
  );
}

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors['--gf-colors-background-primary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    borderRadius: shape['--gf-shape-radius-default'],
    height: '100%',
    width: '100%',
    overflow: 'hidden',
  },
});
