import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing } from '../../../../core/stylex/spacing';

export const dataSourceModalStyles = stylex.create({{
  modal: {
    width: '80%',
          maxWidth: '1200px',
          minHeight: '80%',
    
          [@media (max-width: 768.95px)]: {
            width: '100%',
          },
  },
  modalContent: {
    display: 'flex',
          flexDirection: 'row',
          flex: 1,
    
          [@media (max-width: 768.95px)]: {
            flexDirection: 'column',
          },
  },
  leftColumn: {
    display: 'flex',
          flexDirection: 'column',
          width: '50%',
          maxHeight: '100%',
          paddingRight: themeSpacing(4),
          borderRight: `1px solid ${grafanaTokens.colors_border_weak}`,
    
          [@media (max-width: 768.95px)]: {
            width: '100%',
            borderRight: 0,
            paddingRight: 0,
            flex: 1,
            overflowY: 'auto',
          },
  },
  rightColumn: {
    display: 'flex',
          flexDirection: 'column',
          width: '50%',
          minHeight: '100%',
          justifyItems: 'space-evenly',
          alignItems: 'stretch',
          paddingLeft: themeSpacing(4),
    
          [@media (max-width: 768.95px)]: {
            width: '100%',
            paddingLeft: 0,
            flexShrink: 0,
          },
  },
  builtInDataSources: {
    flex: '1 1',
    
          [@media (max-width: 768.95px)]: {
            display: 'none',
          },
  },
  builtInDataSourcesList: {
    [@media (max-width: 768.95px)]: {
            display: 'none',
            marginBottom: 0,
          },
    
          marginBottom: themeSpacing(4),
  },
  appendBuiltInDataSourcesList: {
    '@media (min-width: 769.0px)': {
            display: 'none',
          },
  },
  newDSSection: {
    display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: themeSpacing(1),
  },
  newDSDescription: {
    flex: '1 0',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          color: grafanaTokens.colors_text_secondary,
          [@media (max-width: 543.95px)]: {
            visibility: 'hidden',
          },
  },
  searchInput: {
    width: '100%',
          minHeight: '32px',
          marginBottom: themeSpacing(1),
  },
});
