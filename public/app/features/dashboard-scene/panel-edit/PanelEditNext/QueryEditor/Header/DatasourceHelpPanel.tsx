import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { datasourceHelpPanelStyles } from './DatasourceHelpPanel.stylex';

import { t } from '@grafana/i18n';
import { type DataQuery } from '@grafana/schema';
import {IconButton} from '@grafana/ui';

import { useActionsContext, useQueryEditorUIContext } from '../QueryEditorContext';

export function DatasourceHelpPanel() {
  const { selectedQuery, selectedQueryDsData, selectedQueryDsLoading, toggleDatasourceHelp } =
    useQueryEditorUIContext();
  const { updateSelectedQuery } = useActionsContext();
  const datasource = selectedQueryDsData?.datasource;


  if (selectedQueryDsLoading || !datasource?.components?.QueryEditorHelp || !selectedQuery) {
    return null;
  }

  const DatasourceCheatsheet = datasource.components.QueryEditorHelp;

  const onClickExample = (exampleQuery: DataQuery) => {
    // Preserve refId and datasource from current query
    const updatedQuery = {
      ...exampleQuery,
      refId: selectedQuery.refId,
      datasource: exampleQuery.datasource ?? selectedQuery.datasource,
    };
    updateSelectedQuery(updatedQuery, selectedQuery.refId);
    toggleDatasourceHelp();
  };

  return (
    <div {...stylex.props(datasourceHelpPanelStyles.container)}>
      <IconButton
        name="times"
        size="md"
        tooltip={t('query-editor-next.help.close', 'Close help')}
        onClick={toggleDatasourceHelp}
        {...stylex.props(datasourceHelpPanelStyles.closeButton)}
        aria-label={t('query-editor-next.help.close-aria', 'Close help panel')}
      />
      <DatasourceCheatsheet query={selectedQuery} datasource={datasource} onClickExample={onClickExample} />
    </div>
  );
}

