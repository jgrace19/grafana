import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { queryEditorContentStyles } from './QueryEditorContent.stylex';


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
    <div {...stylex.props(queryEditorContentStyles.container)}>
      {shouldShowHeader && <ContentHeaderSceneWrapper />}
      {shouldShowDatasourceHelp && <DatasourceHelpPanel />}
      <QueryEditorBody />
      {shouldShowFooter && <QueryEditorFooter />}
    </div>
  );
}

