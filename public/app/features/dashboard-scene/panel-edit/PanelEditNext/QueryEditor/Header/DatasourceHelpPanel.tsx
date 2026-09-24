import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { type DataQuery } from '@grafana/schema';
import { IconButton } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

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
    <div {...stylex.props(styles.container)}>
      <IconButton
        name="times"
        size="md"
        tooltip={t('query-editor-next.help.close', 'Close help')}
        onClick={toggleDatasourceHelp}
        xstyle={styles.close}
        aria-label={t('query-editor-next.help.close-aria', 'Close help panel')}
      />
      <DatasourceCheatsheet query={selectedQuery} datasource={datasource} onClickExample={onClickExample} />
    </div>
  );
}

const styles = stylex.create({
  close: {
    position: 'absolute',
    top: spacing['--gf-spacing-x1'],
    right: spacing['--gf-spacing-x1'],
    zIndex: 1,
  },
  container: {
    position: 'relative',
    paddingTop: spacing['--gf-spacing-x2'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x2'],
    paddingLeft: spacing['--gf-spacing-x2'],
    backgroundColor: colors['--gf-colors-background-primary'],
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
    maxHeight: '400px',
    overflowY: 'auto',
  },
});
