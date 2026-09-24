import * as stylex from '@stylexjs/stylex';
import { forwardRef, type HTMLAttributes, useCallback } from 'react';
import * as React from 'react';
import Highlighter from 'react-highlight-words';

import { motion } from '../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, components, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';
import { type HighlightPart } from '../../types/completion';
import { PartialHighlighter } from '../Typeahead/PartialHighlighter';

type OnLabelClick = (name: string, value: string | undefined, event: React.MouseEvent<HTMLElement>) => void;

interface Props extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  name: string;
  active?: boolean;
  loading?: boolean;
  searchTerm?: string;
  value?: string;
  facets?: number;
  title?: string;
  highlightParts?: HighlightPart[];
  onClick?: OnLabelClick;
}

/**
 * @internal
 */
export const Label = forwardRef<HTMLButtonElement, Props>(
  (
    {
      name,
      value,
      hidden,
      facets,
      onClick,
      className,
      loading,
      searchTerm,
      active,
      style,
      title,
      highlightParts,
      ...rest
    },
    ref
  ) => {
    const searchWords = searchTerm ? [searchTerm] : [];

    const onLabelClick = useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        if (onClick && !hidden) {
          onClick(name, value, event);
        }
      },
      [onClick, name, hidden, value]
    );

    // Using this component for labels and label values. If value is given use value for display text.
    let text = value || name;
    if (facets) {
      text = `${text} (${facets})`;
    }

    return (
      <button
        key={text}
        ref={ref}
        onClick={onLabelClick}
        title={title || text}
        type="button"
        role="option"
        aria-selected={!!active}
        {...mergeStylexProps(
          stylex.props(
            styles.base,
            active && styles.active,
            loading && styles.loading,
            hidden && styles.hidden,
            onClick && !hidden && styles.hover
          ),
          { className, style }
        )}
        {...rest}
      >
        {highlightParts !== undefined ? (
          <PartialHighlighter
            text={text}
            highlightClassName={matchHighlightClassName}
            highlightParts={highlightParts}
          />
        ) : (
          <Highlighter
            textToHighlight={text}
            searchWords={searchWords}
            autoEscape
            highlightClassName={matchHighlightClassName}
          />
        )}
      </button>
    );
  }
);

Label.displayName = 'Label';

const pulse = stylex.keyframes({
  '0%': {
    color: colors['--gf-colors-text-primary'],
  },
  '50%': {
    color: colors['--gf-colors-text-secondary'],
  },
  '100%': {
    color: colors['--gf-colors-text-disabled'],
  },
});

const styles = stylex.create({
  base: {
    display: 'inline-block',
    cursor: 'pointer',
    fontSize: typography['--gf-typography-size-sm'],
    lineHeight: typography['--gf-typography-body-small-line-height'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    color: colors['--gf-colors-text-primary'],
    whiteSpace: 'nowrap',
    textShadow: 'none',
    padding: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
    borderRadius: shape['--gf-shape-radius-default'],
    borderStyle: 'none',
    marginRight: spacing['--gf-spacing-grid-size'],
    marginBottom: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
  },
  loading: {
    fontWeight: typography['--gf-typography-font-weight-medium'],
    backgroundColor: colors['--gf-colors-primary-shade'],
    color: colors['--gf-colors-text-primary'],
    animationName: { default: null, [motion.noPreferenceOrReduce]: pulse },
    animationDuration: { default: null, [motion.noPreferenceOrReduce]: '3s' },
    animationTimingFunction: { default: null, [motion.noPreferenceOrReduce]: 'ease-out' },
    animationDelay: { default: null, [motion.noPreferenceOrReduce]: '0s' },
    animationIterationCount: { default: null, [motion.noPreferenceOrReduce]: 'infinite' },
    animationDirection: { default: null, [motion.noPreferenceOrReduce]: 'normal' },
    animationFillMode: { default: null, [motion.noPreferenceOrReduce]: 'forwards' },
  },
  active: {
    fontWeight: typography['--gf-typography-font-weight-medium'],
    backgroundColor: colors['--gf-colors-primary-main'],
    color: colors['--gf-colors-primary-contrast-text'],
  },
  matchHighLight: {
    color: components['--gf-components-text-highlight-text'],
    backgroundColor: components['--gf-components-text-highlight-background'],
  },
  hidden: {
    opacity: 0.6,
    cursor: 'default',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'transparent',
  },
  hover: {
    opacity: { default: null, ':hover': 0.85 },
  },
});

const matchHighlightClassName = stylex.props(styles.matchHighLight).className ?? '';
