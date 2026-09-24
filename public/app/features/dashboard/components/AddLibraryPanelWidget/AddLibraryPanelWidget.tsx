import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import tinycolor from 'tinycolor2';

import { Trans, t } from '@grafana/i18n';
import { type LibraryPanel } from '@grafana/schema';
import { IconButton, useTheme2 } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { motion } from '@grafana/ui/stylex/constants.stylex';
import { colors, components, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import {
  LibraryPanelsSearch,
  LibraryPanelsSearchVariant,
} from '../../../library-panels/components/LibraryPanelsSearch/LibraryPanelsSearch';
import { type DashboardModel } from '../../state/DashboardModel';
import { type PanelModel } from '../../state/PanelModel';

import { pulsateVars } from './AddLibraryPanelWidget.stylex';

interface Props {
  panel: PanelModel;
  dashboard: DashboardModel;
}

export const AddLibraryPanelWidget = ({ panel, dashboard }: Props) => {
  const onCancelAddPanel = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    dashboard.removePanel(panel);
  };

  const onAddLibraryPanel = (panelInfo: LibraryPanel) => {
    const { gridPos } = panel;

    const newPanel = {
      ...panelInfo.model,
      gridPos,
      libraryPanel: panelInfo,
    };

    dashboard.addPanel(newPanel);
    dashboard.removePanel(panel);
  };

  const theme = useTheme2();
  const darkPrimary = tinycolor(theme.colors.primary.main).darken(20).toHexString();

  return (
    <div {...stylex.props(styles.wrapper)}>
      <div {...stylex.props(styles.callToAction, styles.pulsateColor(darkPrimary))}>
        <div {...mergeStylexProps(stylex.props(styles.headerRow), { className: 'grid-drag-handle' })}>
          <span>
            <Trans i18nKey="library-panel.add-widget.title">Add panel from panel library</Trans>
          </span>
          <div className="flex-grow-1" />
          <IconButton
            aria-label={t(
              'dashboard.add-library-panel-widget.aria-label-close-add-panel-widget',
              "Close 'Add Panel' widget"
            )}
            name="times"
            onClick={onCancelAddPanel}
            tooltip={t('dashboard.add-library-panel-widget.tooltip-close-widget', 'Close widget')}
          />
        </div>
        <LibraryPanelsSearch onClick={onAddLibraryPanel} variant={LibraryPanelsSearchVariant.Tight} showPanelFilter />
      </div>
    </div>
  );
};

const pulsate = stylex.keyframes({
  '0%': {
    boxShadow: `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`,
  },
  '50%': {
    boxShadow: `0 0 0 2px ${components['--gf-components-dashboard-background']}, 0 0 0px 4px ${pulsateVars.darkPrimary}`,
  },
  '100%': {
    boxShadow: `0 0 0 2px ${components['--gf-components-dashboard-background']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`,
  },
});

const styles = stylex.create({
  // wrapper is used to make sure box-shadow animation isn't cut off in dashboard page
  wrapper: {
    height: '100%',
    paddingTop: spacing['--gf-spacing-x0-5'],
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    height: '38px',
    flexShrink: 0,
    width: '100%',
    fontSize: typography['--gf-typography-font-size'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    paddingLeft: spacing['--gf-spacing-x1'],
    transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'background-color' },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: '0.1s' },
    transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: 'ease-in-out' },
    cursor: 'move',
    backgroundColor: { default: null, ':hover': colors['--gf-colors-background-secondary'] },
  },
  callToAction: {
    backgroundColor: components['--gf-components-panel-background'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: components['--gf-components-panel-border-color'],
    borderRadius: shape['--gf-shape-radius-default'],
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    flexDirection: 'column',
    height: '100%',
    position: 'relative',
    width: '100%',
    outlineWidth: '2px',
    outlineStyle: 'dotted',
    outlineColor: 'transparent',
    outlineOffset: '2px',
    overflow: 'hidden',
    animationName: { default: null, [motion.noPreferenceOrReduce]: pulsate },
    animationDuration: { default: null, [motion.noPreferenceOrReduce]: '2s' },
    animationTimingFunction: { default: null, [motion.noPreferenceOrReduce]: 'ease' },
    animationIterationCount: { default: null, [motion.noPreferenceOrReduce]: 'infinite' },
  },
  pulsateColor: (darkPrimary: string) => ({
    [pulsateVars.darkPrimary]: darkPrimary,
  }),
});
