import clsx from 'clsx';

import { dataLinkSuggestionsStyleProps } from './DataLinkSuggestions.stylex'

import { groupBy, capitalize } from 'lodash';
import { useRef, useMemo } from 'react';
import * as React from 'react';
import { useClickAway } from 'react-use';

import { type VariableSuggestion, } from '@grafana/data';

import { List } from '../List/List';

interface DataLinkSuggestionsProps {
  activeRef?: React.RefObject<HTMLDivElement>;
  suggestions: VariableSuggestion[];
  activeIndex: number;
  onSuggestionSelect: (suggestion: VariableSuggestion) => void;
  onClose?: () => void;
}

;

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
    <div role="menu" ref={ref} {...dataLinkSuggestionsStyleProps('wrapper')}>
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
          {...dataLinkSuggestionsStyleProps('list')}
          items={suggestions}
          renderItem={(item, index) => {
            const isActive = index + activeIndexOffset === activeIndex;
            return (
              // key events are handled by DataLinkInput
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <div
                role="menuitem"
                tabIndex={0}
                className={clsx(dataLinkSuggestionsStyleProps('item'), isActive && dataLinkSuggestionsStyleProps('activeItem'))}
                ref={isActive ? selectedRef : undefined}
                onClick={() => {
                  onSuggestionSelect(item);
                }}
                title={item.documentation}
              >
                <span {...dataLinkSuggestionsStyleProps('itemValue')}>
                  <span {...dataLinkSuggestionsStyleProps('label')}>{label}</span> {item.label}
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
