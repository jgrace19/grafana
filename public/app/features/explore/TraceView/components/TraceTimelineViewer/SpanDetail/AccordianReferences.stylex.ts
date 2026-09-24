import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../../core/stylex/spacing';

export const accordianReferencesStyles = stylex.create({
  AccordianReferenceItem: {
    borderBottom: `1px solid ${'#d8d8d8'}`,
  },
  AccordianKeyValues: {
    marginLeft: '10px',
  },
  AccordianReferences: {
        position: 'relative',
  },
  AccordianReferencesHeader: {
        color: 'inherit',
        display: 'block',
        padding: '0.25rem 0',
  },
  AccordianReferencesContent: {
        borderTop: `1px solid ${'#d8d8d8'}`,
        padding: '0.5rem 0.5rem 0.25rem 0.5rem',
  },
  AccordianReferencesFooter: {
        color: '#999',
  },
  AccordianKeyValuesItem: {
    marginBottom: themeSpacing(0.5),
  },
  ReferencesList: {
    background: '#fff',
        border: '1px solid #ddd',
        marginBottom: '0.7em',
        maxHeight: '450px',
        overflow: 'auto',
  },
  list: {
    width: '100%',
        listStyle: 'none',
        padding: 0,
        margin: 0,
        background: '#fff',
  },
  itemContent: {
    padding: '0.25rem 0.5rem',
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
  },
  item: {
    '&:nth-child(2n)': {
          background: '#f5f5f5',
        },
  },
  debugInfo: {
    letterSpacing: '0.25px',
        margin: '0.5em 0 0',
        flexWrap: 'wrap',
        display: 'flex',
        justifyContent: 'flex-end',
  },
  debugLabel: {
    margin: '0 5px 0 5px',
        '&::before': {
          color: '#666',
          content: 'attr(data-label)',
        },
  },
  serviceName: {
    marginRight: '8px',
  },
  title: {
    display: 'flex',
        alignItems: 'center',
        gap: '4px',
  },
});
