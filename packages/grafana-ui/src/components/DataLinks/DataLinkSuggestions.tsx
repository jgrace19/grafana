import * as stylex from '@stylexjs/stylex';
import { groupBy, capitalize } from 'lodash';
import { useRef, useMemo } from 'react';
import * as React from 'react';
import { useClickAway } from 'react-use';

import { type VariableSuggestion } from '@grafana/data';

import { colors, typography } from '../../themes/stylex/tokens.stylex';
import { List } from '../List/List';

interface DataLinkSuggestionsProps {
  activeRef?: React.RefObject<HTMLDivElement>;
  suggestions: VariableSuggestion[];
  activeIndex: number;
  onSuggestionSelect: (suggestion: VariableSuggestion) => void;
  onClose?: () => void;
}

export const DataLinkSuggestions = ({ suggestions, ...otherProps }: DataLinkSuggestionsProps) => {
  const ref = useRef(null);

  useClickAway(ref, () => {
    if (otherProps.onClose) {
      otherProps.onClose();
    }
  });

  const groupedSuggestions = useMemo(() => {
    return groupBy(suggestions, (s) => s.origin);
  }, [suggestions]);

  return (
    <div role="menu" ref={ref} {...stylex.props(styles.wrapper)}>
      {Object.keys(groupedSuggestions).map((key, i) => {
        const indexOffset =
          i === 0
            ? 0
            : Object.keys(groupedSuggestions).reduce((acc, current, index) => {
                if (index >= i) {
                  return acc;
                }
                return acc + groupedSuggestions[current].length;
              }, 0);

        return (
          <DataLinkSuggestionsList
            {...otherProps}
            suggestions={groupedSuggestions[key]}
            label={capitalize(key)}
            activeIndex={otherProps.activeIndex}
            activeIndexOffset={indexOffset}
            key={key}
          />
        );
      })}
    </div>
  );
};

DataLinkSuggestions.displayName = 'DataLinkSuggestions';

interface DataLinkSuggestionsListProps extends DataLinkSuggestionsProps {
  label: string;
  activeIndexOffset: number;
  activeRef?: React.RefObject<HTMLDivElement>;
}

const DataLinkSuggestionsList = React.memo(
  ({
    activeIndex,
    activeIndexOffset,
    label,
    onClose,
    onSuggestionSelect,
    suggestions,
    activeRef: selectedRef,
  }: DataLinkSuggestionsListProps) => {
    return (
      <>
        <List
          className={stylex.props(styles.list).className}
          items={suggestions}
          renderItem={(item, index) => {
            const isActive = index + activeIndexOffset === activeIndex;
            return (
              // key events are handled by DataLinkInput
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <div
                role="menuitem"
                tabIndex={0}
                {...stylex.props(styles.item, isActive && styles.activeItem)}
                ref={isActive ? selectedRef : undefined}
                onClick={() => {
                  onSuggestionSelect(item);
                }}
                title={item.documentation}
              >
                <span {...stylex.props(styles.itemValue)}>
                  <span {...stylex.props(styles.label)}>{label}</span> {item.label}
                </span>
              </div>
            );
          }}
        />
      </>
    );
  }
);

DataLinkSuggestionsList.displayName = 'DataLinkSuggestionsList';

const styles = stylex.create({
  list: {
    borderBottomWidth: { default: '1px', ':last-child': null },
    borderBottomStyle: { default: 'solid', ':last-child': 'none' },
    borderBottomColor: { default: colors['--gf-colors-border-weak'], ':last-child': null },
  },
  wrapper: {
    backgroundColor: colors['--gf-colors-background-primary'],
    width: '250px',
  },
  item: {
    backgroundColor: { default: 'transparent', ':hover': colors['--gf-colors-action-hover'] },
    paddingTop: '2px',
    paddingRight: '8px',
    paddingBottom: '2px',
    paddingLeft: '8px',
    userSelect: 'none',
    color: colors['--gf-colors-text-primary'],
    cursor: 'pointer',
  },
  label: {
    color: colors['--gf-colors-text-secondary'],
  },
  activeItem: {
    backgroundColor: colors['--gf-colors-background-secondary'],
  },
  itemValue: {
    fontFamily: typography['--gf-typography-font-family-monospace'],
    fontSize: typography['--gf-typography-size-sm'],
  },
});
