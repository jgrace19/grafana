// eslint-disable-next-line no-restricted-imports -- stylex: pending ToolbarButton migration (see toolbarButtonNotice)
import { css } from '@emotion/css';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { type QueryResultMetaNotice } from '@grafana/data';
import { Icon, ToolbarButton, Tooltip } from '@grafana/ui';
import { motion } from '@grafana/ui/stylex/constants.stylex';
import { colors, components, shadows, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

interface Props {
  notice: QueryResultMetaNotice;
  onClick: (e: React.SyntheticEvent, tab: string) => void;
}

export const PanelHeaderNotice = ({ notice, onClick }: Props) => {
  const iconName =
    notice.severity === 'error' || notice.severity === 'warning' ? 'exclamation-triangle' : 'file-landscape-alt';

  if (notice.inspect && onClick) {
    return (
      <ToolbarButton
        className={toolbarButtonNotice}
        icon={iconName}
        iconSize="md"
        key={notice.severity}
        tooltip={notice.text}
        onClick={(e) => onClick(e, notice.inspect!)}
      />
    );
  }

  if (notice.link) {
    return (
      <a {...stylex.props(styles.notice)} aria-label={notice.text} href={notice.link} target="_blank" rel="noreferrer">
        <Icon name={iconName} style={{ marginRight: '8px' }} size="md" />
      </a>
    );
  }

  return (
    <Tooltip key={notice.severity} content={notice.text}>
      <span {...stylex.props(styles.iconTooltip)}>
        <Icon name={iconName} size="md" />
      </span>
    </Tooltip>
  );
};

// stylex: pending ToolbarButton migration. ToolbarButton's own Emotion background and border would beat StyleX.
const toolbarButtonNotice = css({
  background: 'inherit',
  border: 'none',
  borderRadius: shape['--gf-shape-radius-default'],
});

const focusRing = `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`;

const styles = stylex.create({
  notice: {
    backgroundColor: 'inherit',
    borderStyle: 'none',
    borderRadius: shape['--gf-shape-radius-default'],
  },
  // The Emotion source's mouse-focus rule had an invalid selector (`&: focus`) and never applied. Its `:hover` came
  // after `:focus`, so hover wins while focused too.
  iconTooltip: {
    color: { default: colors['--gf-colors-text-secondary'], ':hover': colors['--gf-colors-text-primary'] },
    backgroundColor: { default: 'inherit', ':hover': colors['--gf-colors-background-secondary'] },
    cursor: 'auto',
    borderStyle: 'none',
    borderRadius: shape['--gf-shape-radius-default'],
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x1'],
    height: `calc(${spacing['--gf-spacing-grid-size']} * ${components['--gf-components-height-md']})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outlineStyle: { default: null, ':focus': 'dotted' },
    outlineWidth: { default: null, ':focus': '2px' },
    outlineColor: { default: null, ':focus': 'transparent' },
    outlineOffset: { default: null, ':focus': '2px' },
    boxShadow: {
      default: null,
      ':hover': shadows['--gf-shadows-z1'],
      ':focus': { default: focusRing, ':hover': shadows['--gf-shadows-z1'] },
    },
    transitionProperty: { default: null, ':focus': 'outline, outline-offset, box-shadow' },
    transitionDuration: { default: null, ':focus': { default: null, [motion.noPreferenceOrReduce]: '0.2s' } },
    transitionTimingFunction: {
      default: null,
      ':focus': { default: null, [motion.noPreferenceOrReduce]: 'cubic-bezier(0.19, 1, 0.22, 1)' },
    },
    zIndex: { default: null, ':focus': 1 },
  },
});
