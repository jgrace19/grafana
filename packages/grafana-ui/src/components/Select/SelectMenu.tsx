import * as stylex from '@stylexjs/stylex';
import { type RefCallback, useLayoutEffect, useMemo, useRef, type JSX } from 'react';
import * as React from 'react';
import { FixedSizeList as List } from 'react-window';

import { type SelectableValue, toIconName } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { t, Trans } from '@grafana/i18n';

import { useTheme2 } from '../../themes/ThemeContext';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import {
  colors,
  components as componentTokens,
  shadows,
  shape,
  spacing,
  typography,
} from '../../themes/stylex/tokens.stylex';
import { Icon } from '../Icon/Icon';
import { ScrollContainer } from '../ScrollContainer/ScrollContainer';

import { ToggleAllState } from './types';

export interface ToggleAllOptions {
  state: ToggleAllState;
  selectAllClicked: () => void;
  selectedCount?: number;
}

interface SelectMenuProps {
  maxHeight: number;
  innerRef: RefCallback<HTMLDivElement>;
  innerProps: {};
  selectProps: {
    toggleAllOptions?: ToggleAllOptions;
    components?: { Option?: (props: React.PropsWithChildren<SelectMenuOptionProps<unknown>>) => JSX.Element };
  };
}

export const SelectMenu = ({
  children,
  maxHeight,
  innerRef,
  innerProps,
  selectProps,
}: React.PropsWithChildren<SelectMenuProps>) => {
  const { toggleAllOptions, components } = selectProps;

  const optionsElement = components?.Option ?? SelectMenuOptions;

  return (
    <div
      {...innerProps}
      data-testid={selectors.components.Select.menu}
      {...mergeStylexProps(stylex.props(styles.menu), { style: { maxHeight } })}
      aria-label={t('grafana-ui.select.menu-label', 'Select options menu')}
    >
      <ScrollContainer ref={innerRef} maxHeight="inherit" overflowX="hidden" showScrollIndicators padding={0.5}>
        {toggleAllOptions && (
          <ToggleAllOption
            state={toggleAllOptions.state}
            optionComponent={optionsElement}
            selectedCount={toggleAllOptions.selectedCount}
            onClick={toggleAllOptions.selectAllClicked}
          ></ToggleAllOption>
        )}
        {children}
      </ScrollContainer>
    </div>
  );
};

SelectMenu.displayName = 'SelectMenu';

const VIRTUAL_LIST_ITEM_HEIGHT = 37;
const VIRTUAL_LIST_WIDTH_ESTIMATE_MULTIPLIER = 8;
const VIRTUAL_LIST_PADDING = 8;
// Some list items have icons or checkboxes so we need some extra width
const VIRTUAL_LIST_WIDTH_EXTRA = 58;

// A virtualized version of the SelectMenu, descriptions for SelectableValue options not supported since those are of a variable height.
//
// To support the virtualized list we have to "guess" the width of the menu container based on the longest available option.
// the reason for this is because all of the options will be positioned absolute, this takes them out of the document and no space
// is created for them, thus the container can't grow to accomodate.
//
// VIRTUAL_LIST_ITEM_HEIGHT and WIDTH_ESTIMATE_MULTIPLIER are both magic numbers.
// Some characters (such as emojis and other unicode characters) may consist of multiple code points in which case the width would be inaccurate (but larger than needed).
interface VirtualSelectMenuProps<T> {
  children: React.ReactNode;
  innerRef: React.Ref<HTMLDivElement>;
  focusedOption: T;
  innerProps: JSX.IntrinsicElements['div'];
  options: T[];
  maxHeight: number;
  selectProps: {
    toggleAllOptions?: ToggleAllOptions;
    components?: { Option?: (props: React.PropsWithChildren<SelectMenuOptionProps<unknown>>) => JSX.Element };
  };
}

export const VirtualizedSelectMenu = ({
  children,
  maxHeight,
  innerRef: scrollRef,
  options,
  selectProps,
  focusedOption,
}: VirtualSelectMenuProps<SelectableValue>) => {
  const theme = useTheme2();
  const listRef = useRef<List>(null);
  const { toggleAllOptions, components } = selectProps;

  const optionComponent = components?.Option ?? SelectMenuOptions;

  // we need to check for option groups (categories)
  // these are top level options with child options
  // if they exist, flatten the list of options
  const flattenedOptions = useMemo(
    () => options.flatMap((option) => (option.options ? [option, ...option.options] : [option])),
    [options]
  );

  // scroll the focused option into view when navigating with keyboard
  const focusedIndex = flattenedOptions.findIndex(
    (option: SelectableValue<unknown>) => option.value === focusedOption?.value
  );
  useLayoutEffect(() => {
    listRef.current?.scrollToItem(focusedIndex);
  }, [focusedIndex]);

  if (!Array.isArray(children)) {
    return null;
  }

  // flatten the children to account for any categories
  // these will have array children that are the individual options
  const flattenedChildren = children.flatMap((child, index) => {
    if (hasArrayChildren(child)) {
      // need to remove the children from the category else they end up in the DOM twice
      const childWithoutChildren = React.cloneElement(child, {
        children: null,
      });
      return [
        childWithoutChildren,
        ...child.props.children.slice(0, -1),
        // add a bottom divider to the last item in the category
        React.cloneElement(child.props.children.at(-1), {
          innerProps: {
            ...child.props.children.at(-1).props.innerProps,
            style: {
              borderBottom: `1px solid ${theme.colors.border.weak}`,
              height: VIRTUAL_LIST_ITEM_HEIGHT,
            },
          },
        }),
      ];
    }
    return [child];
  });

  if (toggleAllOptions) {
    flattenedChildren.unshift(
      <ToggleAllOption
        optionComponent={optionComponent}
        state={toggleAllOptions.state}
        selectedCount={toggleAllOptions.selectedCount}
        onClick={toggleAllOptions.selectAllClicked}
      ></ToggleAllOption>
    );
  }

  let longestOption = flattenedOptions.reduce((max, option) => {
    const length = option.label?.length ?? 0;
    return Math.max(max, length);
  }, 0);
  if (toggleAllOptions && longestOption < 12) {
    longestOption = 12;
  }
  const widthEstimate =
    longestOption * VIRTUAL_LIST_WIDTH_ESTIMATE_MULTIPLIER + VIRTUAL_LIST_PADDING * 2 + VIRTUAL_LIST_WIDTH_EXTRA;
  const heightEstimate = Math.min(flattenedChildren.length * VIRTUAL_LIST_ITEM_HEIGHT, maxHeight);

  return (
    <List
      outerRef={scrollRef}
      ref={listRef}
      className={stylex.props(styles.menu).className}
      height={heightEstimate}
      width={widthEstimate}
      aria-label={t('grafana-ui.select.menu-label', 'Select options menu')}
      itemCount={flattenedChildren.length}
      itemSize={VIRTUAL_LIST_ITEM_HEIGHT}
    >
      {({ index, style }) => <div style={{ ...style, overflow: 'hidden' }}>{flattenedChildren[index]}</div>}
    </List>
  );
};

// check if a child has array children (and is therefore a react-select group)
// we need to flatten these so the correct count and elements are passed to the virtualized list
const hasArrayChildren = (child: React.ReactNode) => {
  return React.isValidElement<Record<string, unknown>>(child) && Array.isArray(child.props.children);
};

VirtualizedSelectMenu.displayName = 'VirtualizedSelectMenu';

interface SelectMenuOptionProps<T> {
  isDisabled: boolean;
  isFocused: boolean;
  isSelected: boolean;
  indeterminate?: boolean;
  innerProps: JSX.IntrinsicElements['div'];
  innerRef: RefCallback<HTMLDivElement>;
  renderOptionLabel?: (value: SelectableValue<T>) => JSX.Element;
  data: SelectableValue<T>;
}

const ToggleAllOption = ({
  state,
  onClick,
  selectedCount,
  optionComponent,
}: {
  state: ToggleAllState;
  onClick: () => void;
  selectedCount?: number;
  optionComponent: (props: React.PropsWithChildren<SelectMenuOptionProps<unknown>>) => JSX.Element;
}) => {
  return (
    <button
      data-testid={selectors.components.Select.toggleAllOptions}
      {...stylex.props(styles.toggleAllButton)}
      onClick={onClick}
    >
      {optionComponent({
        isDisabled: false,
        isSelected: state === ToggleAllState.allSelected,
        isFocused: false,
        data: {},
        indeterminate: state === ToggleAllState.indeterminate,
        innerRef: () => {},
        innerProps: {},
        children: (
          <>
            <Trans i18nKey="select.select-menu.selected-count">Selected</Trans>
            {` (${selectedCount ?? 0})`}
          </>
        ),
      })}
    </button>
  );
};

export const SelectMenuOptions = ({
  children,
  data,
  innerProps,
  innerRef,
  isFocused,
  isSelected,
  renderOptionLabel,
}: React.PropsWithChildren<SelectMenuOptionProps<unknown>>) => {
  const icon = data.icon ? toIconName(data.icon) : undefined;
  // We are removing onMouseMove and onMouseOver from innerProps because they cause the whole
  // list to re-render everytime the user hovers over an option. This is a performance issue.
  // See https://github.com/JedWatson/react-select/issues/3128#issuecomment-451936743
  const { onMouseMove, onMouseOver, ...rest } = innerProps;

  return (
    <div
      ref={innerRef}
      {...stylex.props(
        styles.option,
        isFocused && styles.optionFocused,
        isSelected && styles.optionSelected,
        data.isDisabled && styles.optionDisabled
      )}
      {...rest}
      data-testid={selectors.components.Select.option}
      title={data.title}
    >
      {icon && <Icon name={icon} xstyle={styles.optionIcon} />}
      {data.imgUrl && (
        <img {...stylex.props(styles.optionImage)} src={data.imgUrl} alt={data.label || String(data.value)} />
      )}
      <div {...stylex.props(styles.optionBody)}>
        <span>{renderOptionLabel ? renderOptionLabel(data) : children}</span>
        {data.description && <div {...stylex.props(styles.optionDescription)}>{data.description}</div>}
        {data.component && <data.component />}
      </div>
    </div>
  );
};

SelectMenuOptions.displayName = 'SelectMenuOptions';

const forcedColors = '@media (forced-colors: active), (prefers-contrast: more)';

const styles = stylex.create({
  menu: {
    backgroundColor: componentTokens['--gf-components-dropdown-background'],
    borderRadius: shape['--gf-shape-radius-default'],
    boxShadow: shadows['--gf-shadows-z3'],
    position: 'relative',
    minWidth: '100%',
    overflow: 'hidden',
    zIndex: 1,
  },
  // Every background also keeps the hover colour: the Emotion :hover rule out-ranked the state classes.
  option: {
    padding: '8px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 0,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    borderRadius: shape['--gf-shape-radius-default'],
    backgroundColor: { default: null, ':hover': colors['--gf-colors-action-hover'] },
    borderTopWidth: { default: null, ':hover': { default: null, [forcedColors]: '1px' } },
    borderRightWidth: { default: null, ':hover': { default: null, [forcedColors]: '1px' } },
    borderBottomWidth: { default: null, ':hover': { default: null, [forcedColors]: '1px' } },
    borderLeftWidth: { default: '2px', ':hover': { default: null, [forcedColors]: '1px' } },
    borderTopStyle: { default: null, ':hover': { default: null, [forcedColors]: 'solid' } },
    borderRightStyle: { default: null, ':hover': { default: null, [forcedColors]: 'solid' } },
    borderBottomStyle: { default: null, ':hover': { default: null, [forcedColors]: 'solid' } },
    borderLeftStyle: 'solid',
    borderTopColor: {
      default: null,
      ':hover': { default: null, [forcedColors]: colors['--gf-colors-primary-border'] },
    },
    borderRightColor: {
      default: null,
      ':hover': { default: null, [forcedColors]: colors['--gf-colors-primary-border'] },
    },
    borderBottomColor: {
      default: null,
      ':hover': { default: null, [forcedColors]: colors['--gf-colors-primary-border'] },
    },
    borderLeftColor: {
      default: 'transparent',
      ':hover': { default: null, [forcedColors]: colors['--gf-colors-primary-border'] },
    },
  },
  optionIcon: {
    marginRight: spacing['--gf-spacing-x1'],
  },
  optionImage: {
    width: '16px',
    marginRight: '10px',
  },
  optionDescription: {
    fontWeight: 'normal',
    fontSize: typography['--gf-typography-size-sm'],
    color: colors['--gf-colors-text-secondary'],
    whiteSpace: 'normal',
    lineHeight: typography['--gf-typography-body-line-height'],
  },
  optionBody: {
    display: 'flex',
    fontWeight: typography['--gf-typography-font-weight-medium'],
    flexDirection: 'column',
    flexGrow: 1,
  },
  optionFocused: {
    backgroundColor: { default: colors['--gf-colors-action-focus'], ':hover': colors['--gf-colors-action-hover'] },
    borderTopWidth: { default: null, [forcedColors]: '1px' },
    borderRightWidth: { default: null, [forcedColors]: '1px' },
    borderBottomWidth: { default: null, [forcedColors]: '1px' },
    borderLeftWidth: { default: '2px', [forcedColors]: '1px' },
    borderTopStyle: { default: null, [forcedColors]: 'solid' },
    borderRightStyle: { default: null, [forcedColors]: 'solid' },
    borderBottomStyle: { default: null, [forcedColors]: 'solid' },
    borderTopColor: { default: null, [forcedColors]: colors['--gf-colors-primary-border'] },
    borderRightColor: { default: null, [forcedColors]: colors['--gf-colors-primary-border'] },
    borderBottomColor: { default: null, [forcedColors]: colors['--gf-colors-primary-border'] },
    borderLeftColor: { default: 'transparent', [forcedColors]: colors['--gf-colors-primary-border'] },
  },
  optionSelected: {
    backgroundColor: {
      default: colors['--gf-colors-action-selected'],
      ':hover': colors['--gf-colors-action-hover'],
    },
    '::before': {
      backgroundImage: colors['--gf-colors-gradients-brand-vertical'],
      borderRadius: shape['--gf-shape-radius-default'],
      content: '" "',
      display: 'block',
      height: '100%',
      position: 'absolute',
      transform: 'translateX(-50%)',
      width: spacing['--gf-spacing-x0-5'],
      left: 0,
    },
  },
  optionDisabled: {
    backgroundColor: {
      default: colors['--gf-colors-action-disabled-background'],
      ':hover': colors['--gf-colors-action-hover'],
    },
    color: colors['--gf-colors-action-disabled-text'],
    cursor: 'not-allowed',
  },
  // clearButtonStyles + the fixed virtual list row height
  toggleAllButton: {
    backgroundColor: 'transparent',
    color: colors['--gf-colors-text-primary'],
    borderStyle: 'none',
    padding: 0,
    width: '100%',
    textAlign: 'left',
    height: VIRTUAL_LIST_ITEM_HEIGHT,
  },
});
