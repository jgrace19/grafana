import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { type ReactNode, useCallback, useEffect, useState, useRef } from 'react';
import * as React from 'react';
import { useLocalStorage } from 'react-use';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { Button, Counter, Icon, Tooltip, useTheme2 } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
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
  /** StyleX overrides for the category box, applied after its own styles */
  xstyle?: StyleXStyles;
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
    xstyle,
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

    const theme = useTheme2();
    const boxProps = mergeStylexProps(
      stylex.props(styles.box, isNested && isExpanded && styles.boxNestedExpanded, xstyle),
      { className }
    );
    const headerProps = stylex.props(
      styles.header,
      styles.headerHover(theme.colors.emphasize(theme.colors.background.primary, 0.03)),
      isExpanded && styles.headerExpanded,
      isNested && styles.headerNested
    );
    const bodyProps = stylex.props(styles.body, isNested && styles.bodyNested);

    /**
     * Disabled categories just show the disabled header and icon
     */
    if (disabledText) {
      return (
        <div
          {...boxProps}
          data-plugin-sandbox={sandboxId}
          data-testid={selectors.components.OptionsGroup.group(id)}
          ref={ref}
        >
          <Tooltip interactive={!(typeof disabledText === 'string')} content={disabledText}>
            <div {...headerProps}>
              <h6 id={`button-${id}`} {...stylex.props(styles.title, styles.titleDisabled)}>
                {renderTitle(isExpanded)}
              </h6>
              <Icon size="sm" name="ban" xstyle={styles.disabledIcon} />
            </div>
          </Tooltip>
        </div>
      );
    }

    return (
      <div
        {...boxProps}
        data-plugin-sandbox={sandboxId}
        data-testid={selectors.components.OptionsGroup.group(id)}
        ref={ref}
      >
        {/* disabling a11y rules here because there's a Button that handles keyboard interaction */}
        {/* this just provides a better experience for mouse users */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div {...headerProps} onClick={onToggle}>
          <h6 id={`button-${id}`} {...stylex.props(styles.title, isExpanded && styles.titleExpanded)}>
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
            className={stylex.props(styles.toggleButton).className}
            icon={isExpanded ? 'angle-up' : 'angle-down'}
            onClick={onToggle}
          />
        </div>
        {isExpanded && (
          <div {...bodyProps} id={id} aria-labelledby={`button-${id}`}>
            {children}
          </div>
        )}
      </div>
    );
  }
);
OptionsPaneCategory.displayName = 'OptionsPaneCategory';

const styles = stylex.create({
  box: {
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors['--gf-colors-border-weak'],
  },
  boxNestedExpanded: {
    marginBottom: spacing['--gf-spacing-x2'],
  },
  title: {
    flexGrow: 1,
    overflow: 'hidden',
    lineHeight: 1.5,
    fontSize: '1rem',
    fontWeight: typography['--gf-typography-font-weight-medium'],
    margin: 0,
    color: colors['--gf-colors-text-secondary'],
  },
  titleExpanded: {
    color: colors['--gf-colors-text-primary'],
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x1-5'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x1-5'],
    color: colors['--gf-colors-text-primary'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    cursor: 'pointer',
  },
  headerHover: (hoverBackground: string) => ({
    backgroundColor: { default: null, ':hover': hoverBackground },
  }),
  toggleButton: {
    alignSelf: 'baseline',
  },
  headerExpanded: {
    color: colors['--gf-colors-text-primary'],
  },
  headerNested: {
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: 0,
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: 0,
  },
  body: {
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x2'],
  },
  titleDisabled: {
    color: colors['--gf-colors-text-disabled'],
    cursor: 'not-allowed',
  },
  disabledIcon: {
    color: colors['--gf-colors-text-disabled'],
    marginTop: spacing['--gf-spacing-x1'],
    marginRight: spacing['--gf-spacing-x1'],
    marginBottom: spacing['--gf-spacing-x1'],
    marginLeft: 0,
  },
  bodyNested: {
    position: 'relative',
    paddingRight: 0,
    '::before': {
      content: "''",
      position: 'absolute',
      top: 0,
      left: '1px',
      width: '1px',
      height: '100%',
      backgroundColor: colors['--gf-colors-border-weak'],
    },
  },
});

const getOptionGroupStorageKey = (id: string) => `${PANEL_EDITOR_UI_STATE_STORAGE_KEY}.optionGroup[${id}]`;
