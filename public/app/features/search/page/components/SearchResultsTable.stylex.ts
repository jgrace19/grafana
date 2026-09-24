import * as stylex from '@stylexjs/stylex';

import { mergeStylexClassName } from '@grafana/ui/unstable';
import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing } from '../../../../core/stylex/spacing';

export const searchResultsTableStyles = stylex.create({
  tableWrapper: {
    position: 'relative',
    flex: '1 1 auto',
    minHeight: 0,
  },
  cell: {
    padding: themeSpacing(1),
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
  },
  nameCellStyle: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    userSelect: 'text',
    whiteSpace: 'nowrap',
  },
  typeCell: {
    gap: themeSpacing(0.5),
  },
  typeIcon: {
    fill: grafanaTokens.colors_text_secondary,
  },
  datasourceItem: {
    color: 'inherit',
  },
  missingTitleText: {
    color: grafanaTokens.colors_text_disabled,
    fontStyle: 'italic',
  },
  invalidDatasourceItem: {
    color: grafanaTokens.colors_error_main,
    textDecoration: 'line-through',
  },
  locationContainer: {
    display: 'flex',
    flexWrap: 'nowrap',
    gap: themeSpacing(1),
  },
  locationItem: {
    alignItems: 'center',
    color: grafanaTokens.colors_text_secondary,
    display: 'flex',
    flexWrap: 'nowrap',
    gap: '4px',
    overflow: 'hidden',
  },
  explainItem: {
    cursor: 'pointer',
  },
  tagList: {
    justifyContent: 'flex-start',
    flexWrap: 'nowrap',
  },
});

export function searchResultsTableClassNames() {
  const cn = (key: keyof typeof searchResultsTableStyles) =>
    mergeStylexClassName(stylex.props(searchResultsTableStyles[key]), undefined).className ?? '';
  return {
    cell: cn('cell'),
    nameCellStyle: cn('nameCellStyle'),
    typeCell: cn('typeCell'),
    typeIcon: cn('typeIcon'),
    datasourceItem: cn('datasourceItem'),
    missingTitleText: cn('missingTitleText'),
    invalidDatasourceItem: cn('invalidDatasourceItem'),
    locationContainer: cn('locationContainer'),
    locationItem: cn('locationItem'),
    explainItem: cn('explainItem'),
    tagList: cn('tagList'),
  };
}
