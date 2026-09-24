import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import Highlighter from 'react-highlight-words';

import { motion } from '../../themes/stylex/constants.stylex';
import { colors, spacing, typography, v1 } from '../../themes/stylex/tokens.stylex';
import { type CompletionItem, CompletionItemKind } from '../../types/completion';

import { PartialHighlighter } from './PartialHighlighter';

interface Props {
  isSelected: boolean;
  item: CompletionItem;
  style: React.CSSProperties;
  prefix?: string;

  onClickItem?: (event: React.MouseEvent) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const TypeaheadItem = (props: Props) => {
  const { isSelected, item, prefix, style, onMouseEnter, onMouseLeave, onClickItem } = props;
  const highlightClassName = stylex.props(styles.typeaheadItemMatch).className;
  const label = item.label || '';

  if (item.kind === CompletionItemKind.GroupTitle) {
    return (
      <li {...stylex.props(styles.typeaheadItemGroupTitle)} style={style}>
        <span>{label}</span>
      </li>
    );
  }

  return (
    <li role="none">
      <button
        role="menuitem"
        {...stylex.props(styles.typeaheadItem, isSelected && styles.typeaheadItemSelected)}
        style={style}
        onMouseDown={onClickItem}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        type="button"
      >
        {item.highlightParts !== undefined ? (
          <PartialHighlighter
            text={label}
            highlightClassName={highlightClassName}
            highlightParts={item.highlightParts}
          ></PartialHighlighter>
        ) : (
          <Highlighter
            textToHighlight={label}
            searchWords={[prefix ?? '']}
            autoEscape={true}
            highlightClassName={highlightClassName}
          />
        )}
      </button>
    </li>
  );
};

const grid = spacing['--gf-spacing-grid-size'];

const styles = stylex.create({
  typeaheadItem: {
    borderStyle: 'none',
    backgroundColor: 'transparent',
    textAlign: 'left',
    height: 'auto',
    fontFamily: typography['--gf-typography-font-family-monospace'],
    paddingTop: grid,
    paddingRight: grid,
    paddingBottom: grid,
    paddingLeft: `calc(${grid} * 2)`,
    fontSize: typography['--gf-typography-body-small-font-size'],
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    zIndex: 11,
    display: 'block',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'color, border-color, background, padding' },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: '0.3s, 0.3s, 0.3s, 0.15s' },
    transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: 'cubic-bezier(0.645, 0.045, 0.355, 1)' },
  },
  typeaheadItemSelected: {
    backgroundColor: colors['--gf-colors-background-secondary'],
  },
  typeaheadItemMatch: {
    color: v1['--gf-v1-palette-yellow'],
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: v1['--gf-v1-palette-yellow'],
    paddingTop: 'inherit',
    paddingRight: 'inherit',
    paddingBottom: 'inherit',
    paddingLeft: 'inherit',
    backgroundColor: 'inherit',
  },
  typeaheadItemGroupTitle: {
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    lineHeight: typography['--gf-typography-body-line-height'],
    paddingTop: grid,
    paddingRight: grid,
    paddingBottom: grid,
    paddingLeft: grid,
  },
});
