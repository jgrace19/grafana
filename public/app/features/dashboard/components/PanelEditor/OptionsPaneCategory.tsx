import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { optionsPaneCategoryStyles } from './OptionsPaneCategory.stylex';
import { type ReactNode, useCallback, useEffect, useState, useRef } from 'react';
import * as React from 'react';
import { useLocalStorage } from 'react-use';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { Button, Counter, Icon, Tooltip, useStyles2 } from '@grafana/ui';
import { useQueryParams } from 'app/core/hooks/useQueryParams';

import { PANEL_EDITOR_UI_STATE_STORAGE_KEY } from './state/reducers';

export interface OptionsPaneCategoryProps {
  id: string;
  title?: string;
  renderTitle?: (isExpanded: boolean) => React.ReactNode;
  isOpenDefault?: boolean;
  itemsCount?: number;
  forceOpen?: boolean;
  className?: string;
  isNested?: boolean;
  children: ReactNode;
  sandboxId?: string;
  /**
   * When set will disable category and show tooltip with disabledText on hover
   */
  disabledText?: string | React.ReactElement;
}

const CATEGORY_PARAM_NAME = 'showCategory' as const;

export const OptionsPaneCategory = React.memo(
  ({
    id,
    title,
    children,
    forceOpen,
    isOpenDefault = true,
    renderTitle,
    className,
    itemsCount,
    isNested = false,
    sandboxId,
    disabledText,
  }: OptionsPaneCategoryProps) => {
    const [savedState, setSavedState] = useLocalStorage(getOptionGroupStorageKey(id), {
      isExpanded: isOpenDefault,
    });

    const isExpandedInitialValue = forceOpen || (savedState?.isExpanded ?? isOpenDefault);
    const [isExpanded, setIsExpanded] = useState(isExpandedInitialValue);
    const ref = useRef<HTMLDivElement>(null);
    const [queryParams, updateQueryParams] = useQueryParams();
    const isOpenFromUrl = queryParams[CATEGORY_PARAM_NAME] === id;

    // Handle opening by forceOpen param or from URL
    useEffect(() => {
      if ((forceOpen || isOpenFromUrl) && !isExpanded) {
        setIsExpanded(true);
        setTimeout(() => {
          ref.current?.scrollIntoView();
        }, 200);
      }
    }, [isExpanded, isOpenFromUrl, forceOpen]);

    const onToggle = useCallback(() => {
      updateQueryParams({ [CATEGORY_PARAM_NAME]: isExpanded ? undefined : id }, true);
      setSavedState({ isExpanded: !isExpanded });
      setIsExpanded(!isExpanded);
    }, [updateQueryParams, isExpanded, id, setSavedState]);

    if (!renderTitle) {
      renderTitle = function defaultTitle(isExpanded: boolean) {
        if (isExpanded || itemsCount === undefined || itemsCount === 0) {
          return title;
        }

        return (
          <span>
            {title} <Counter value={itemsCount} />
          </span>
        );
      };
    }
    const boxStyles = clsx(
      {
        [mergeStylexClassName(stylex.props(optionsPaneCategoryStyles.box), undefined).className]: true,
        [mergeStylexClassName(stylex.props(optionsPaneCategoryStyles.boxNestedExpanded), undefined).className]: isNested && isExpanded,
      },
      className
    );

    const headerStyles = clsx(mergeStylexClassName(stylex.props(optionsPaneCategoryStyles.header), undefined).className, {
      [mergeStylexClassName(stylex.props(optionsPaneCategoryStyles.headerExpanded), undefined).className]: isExpanded,
      [mergeStylexClassName(stylex.props(optionsPaneCategoryStyles.headerNested), undefined).className]: isNested,
    });

    const bodyStyles = clsx(mergeStylexClassName(stylex.props(optionsPaneCategoryStyles.body), undefined).className, {
      [mergeStylexClassName(stylex.props(optionsPaneCategoryStyles.bodyNested), undefined).className]: isNested,
    });

    /**
     * Disabled categories just show the disabled header and icon
     */
    if (disabledText) {
      return (
        <div
          className={boxStyles}
          data-plugin-sandbox={sandboxId}
          data-testid={selectors.components.OptionsGroup.group(id)}
          ref={ref}
        >
          <Tooltip interactive={!(typeof disabledText === 'string')} content={disabledText}>
            <div className={headerStyles}>
              <h6 id={`button-${id}`} {...mergeStylexClassName(stylex.props(optionsPaneCategoryStyles.title, , mergeStylexClassName(stylex.props(optionsPaneCategoryStyles.titleDisabled), undefined).className), undefined)}>
                {renderTitle(isExpanded)}
              </h6>
              <Icon size="sm" name="ban" {...stylex.props(optionsPaneCategoryStyles.disabledIcon)} />
            </div>
          </Tooltip>
        </div>
      );
    }

    return (
      <div
        className={boxStyles}
        data-plugin-sandbox={sandboxId}
        data-testid={selectors.components.OptionsGroup.group(id)}
        ref={ref}
      >
        {/* disabling a11y rules here because there's a Button that handles keyboard interaction */}
        {/* this just provides a better experience for mouse users */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div className={headerStyles} onClick={onToggle}>
          <h6 id={`button-${id}`} {...mergeStylexClassName(stylex.props(optionsPaneCategoryStyles.title, , isExpanded && mergeStylexClassName(stylex.props(optionsPaneCategoryStyles.titleExpanded), undefined).className), undefined)}>
            {renderTitle(isExpanded)}
          </h6>
          <Button
            aria-label={
              isExpanded
                ? t('dashboard.options-pane-category.aria-label-collapse', 'Collapse {{title}} category', { title })
                : t('dashboard.options-pane-category.aria-label-expand', 'Expand {{title}} category', { title })
            }
            data-testid={selectors.components.OptionsGroup.toggle(id)}
            type="button"
            fill="text"
            size="md"
            variant="secondary"
            aria-expanded={isExpanded}
            {...stylex.props(optionsPaneCategoryStyles.toggleButton)}
            icon={isExpanded ? 'angle-up' : 'angle-down'}
            onClick={onToggle}
          />
        </div>
        {isExpanded && (
          <div className={bodyStyles} id={id} aria-labelledby={`button-${id}`}>
            {children}
          </div>
        )}
      </div>
    );
  }
);
OptionsPaneCategory.displayName = 'OptionsPaneCategory';


const getOptionGroupStorageKey = (id: string) => `${PANEL_EDITOR_UI_STATE_STORAGE_KEY}.optionGroup[${id}]`;
