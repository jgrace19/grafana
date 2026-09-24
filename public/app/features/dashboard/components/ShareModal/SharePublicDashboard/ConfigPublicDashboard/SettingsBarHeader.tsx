import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import * as React from 'react';

import { t } from '@grafana/i18n';
import { IconButton, ReactUtils } from '@grafana/ui';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import './SettingsBarHeader.css';

export interface Props {
  onRowToggle: () => void;
  isContentVisible?: boolean;
  title?: string;
  headerElement?: React.ReactNode | ((props: { className?: string; xstyle?: StyleXStyles }) => React.ReactNode);
}

export function SettingsBarHeader({ headerElement, isContentVisible = false, onRowToggle, title, ...rest }: Props) {
  const headerElementRendered =
    headerElement && ReactUtils.renderOrCallToRender(headerElement, { xstyle: styles.summaryWrapper });

  return (
    <div {...stylex.props(styles.wrapper)}>
      <div {...stylex.props(styles.header)}>
        <IconButton
          name={isContentVisible ? 'angle-down' : 'angle-right'}
          tooltip={
            isContentVisible
              ? t('public-dashboard.settings-bar-header.collapse-settings-tooltip', 'Collapse settings')
              : t('public-dashboard.settings-bar-header.expand-settings-tooltip', 'Expand settings')
          }
          className="gf-settings-bar-header-collapse-icon"
          onClick={onRowToggle}
          aria-expanded={isContentVisible}
          {...rest}
        />
        {title && (
          // disabling the a11y rules here as the IconButton above handles keyboard interactions
          // this is just to provide a better experience for mouse users
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <div {...stylex.props(styles.titleWrapper)} onClick={onRowToggle}>
            <span {...stylex.props(styles.title)}>{title}</span>
          </div>
        )}
        {headerElementRendered}
      </div>
    </div>
  );
}

SettingsBarHeader.displayName = 'SettingsBarHeader';

const styles = stylex.create({
  wrapper: {
    padding: spacing['--gf-spacing-x0-5'],
    borderRadius: shape['--gf-shape-radius-default'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    minHeight: spacing['--gf-spacing-x4'],
    outlineStyle: { default: null, ':focus': 'none' },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    overflow: 'hidden',
    marginRight: spacing['--gf-spacing-x0-5'],
    flex: { default: null, [bp.smDown]: '1 1' },
  },
  title: {
    fontWeight: typography['--gf-typography-font-weight-bold'],
    marginLeft: spacing['--gf-spacing-x0-5'],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  summaryWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: { default: null, [bp.smDown]: '2 2' },
  },
});
