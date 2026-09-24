import * as stylex from '@stylexjs/stylex';
import { useMemo } from 'react';

import { type ActionModel, type Field, type LinkModel, type ThemeSpacingTokens } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { Trans } from '@grafana/i18n';

import { colors, spacing } from '../../themes/stylex/tokens.stylex';
import { ActionButton } from '../Actions/ActionButton';
import { Button } from '../Button/Button';
import { DataLinkButton } from '../DataLinks/DataLinkButton';
import { Icon } from '../Icon/Icon';
import { Stack } from '../Layout/Stack/Stack';
import { type ResponsiveProp } from '../Layout/utils/responsiveness';
import { type AdHocFilterItem } from '../Table/TableNG/types';

import './VizTooltipFooter.css';

export interface AdHocFilterModel extends AdHocFilterItem {
  onClick: () => void;
}

export interface FilterByGroupedLabelsModel {
  onFilterForGroupedLabels?: () => void;
  onFilterOutGroupedLabels?: () => void;
}

interface VizTooltipFooterProps {
  dataLinks: Array<LinkModel<Field>>;
  actions?: Array<ActionModel<Field>>;
  adHocFilters?: AdHocFilterModel[];
  filterByGroupedLabels?: FilterByGroupedLabelsModel;
  annotate?: () => void;
}

export const ADD_ANNOTATION_ID = 'add-annotation-button';

type RenderOneClickTrans = (title: string) => React.ReactNode;
type RenderItem<T extends LinkModel | ActionModel> = (item: T, idx: number) => React.ReactNode;

function makeRenderLinksOrActions<T extends LinkModel | ActionModel>(
  renderOneClickTrans: RenderOneClickTrans,
  renderItem: RenderItem<T>,
  itemGap?: ResponsiveProp<ThemeSpacingTokens>
) {
  const renderLinksOrActions = (items: T[]) => {
    if (items.length === 0) {
      return;
    }

    const oneClickItem = items.find((item) => item.oneClick === true);

    if (oneClickItem != null) {
      return (
        <div {...stylex.props(styles.footerSection)}>
          <Stack direction="column" justifyContent="flex-start" gap={0.5}>
            <span {...stylex.props(styles.oneClickWrapper)}>
              <Icon name="info-circle" size="lg" xstyle={styles.infoIcon} />
              {renderOneClickTrans(oneClickItem.title)}
            </span>
          </Stack>
        </div>
      );
    }

    return (
      <div {...stylex.props(styles.footerSection)}>
        <Stack direction="column" justifyContent="flex-start" gap={itemGap}>
          {items.map((item, i) => renderItem(item, i))}
        </Stack>
      </div>
    );
  };

  return renderLinksOrActions;
}

const renderDataLinks = makeRenderLinksOrActions<LinkModel>(
  (title) => (
    <Trans i18nKey="grafana-ui.viz-tooltip.footer-click-to-navigate">Click to open {{ linkTitle: title }}</Trans>
  ),
  (item, i) => (
    <DataLinkButton
      link={item}
      key={i}
      buttonProps={{ className: 'gf-viz-tooltip-footer-link', fill: 'text', xstyle: styles.link }}
    />
  ),
  0.5
);

const renderActions = makeRenderLinksOrActions<ActionModel>(
  (title) => <Trans i18nKey="grafana-ui.viz-tooltip.footer-click-to-action">Click to {{ actionTitle: title }}</Trans>,
  (item, i) => <ActionButton key={i} action={item} variant="secondary" />
);

export const VizTooltipFooter = ({
  dataLinks,
  actions = [],
  annotate,
  adHocFilters = [],
  filterByGroupedLabels,
}: VizTooltipFooterProps) => {
  const hasOneClickLink = useMemo(() => dataLinks.some((link) => link.oneClick === true), [dataLinks]);
  const hasOneClickAction = useMemo(() => actions.some((action) => action.oneClick === true), [actions]);

  return (
    <div {...stylex.props(styles.wrapper)}>
      {!hasOneClickAction && renderDataLinks(dataLinks)}
      {!hasOneClickLink && renderActions(actions)}
      {!hasOneClickLink && !hasOneClickAction && adHocFilters.length > 0 && (
        <div {...stylex.props(styles.footerSection)}>
          {adHocFilters.map((item, index) => (
            <Button key={index} icon="filter" variant="secondary" size="sm" onClick={item.onClick}>
              <Trans i18nKey="grafana-ui.viz-tooltip.footer-filter-for-value">
                Filter for '{{ value: item.value }}'
              </Trans>
            </Button>
          ))}
        </div>
      )}

      {!hasOneClickLink && !hasOneClickAction && filterByGroupedLabels && (
        <div {...stylex.props(styles.footerSection)}>
          <Stack direction="column" gap={0.5} width="fit-content">
            <Button
              icon="filter"
              variant="secondary"
              size="sm"
              onClick={filterByGroupedLabels.onFilterForGroupedLabels}
              data-testid={selectors.components.VizTooltipFooter.buttons.apply}
            >
              <Trans i18nKey="grafana-ui.viz-tooltip.footer-apply-series-as-filter">Filter on this value</Trans>
            </Button>
            <Button
              icon="filter"
              variant="secondary"
              size="sm"
              onClick={filterByGroupedLabels.onFilterOutGroupedLabels}
              data-testid={selectors.components.VizTooltipFooter.buttons.applyInverse}
            >
              <Trans i18nKey="grafana-ui.viz-tooltip.footer-apply-series-as-inverse-filter">
                Filter out this value
              </Trans>
            </Button>
          </Stack>
        </div>
      )}
      {!hasOneClickLink && !hasOneClickAction && annotate != null && (
        <div {...stylex.props(styles.footerSection)}>
          <Button icon="comment-alt" variant="secondary" size="sm" id={ADD_ANNOTATION_ID} onClick={annotate}>
            <Trans i18nKey="grafana-ui.viz-tooltip.footer-add-annotation">Add annotation</Trans>
          </Button>
        </div>
      )}
    </div>
  );
};

// Button's own focus background still applies unless hovered, as it did under the Emotion class.
const styles = stylex.create({
  link: {
    cursor: 'pointer',
    paddingLeft: 0,
    paddingRight: 0,
    height: 'auto',
    textDecoration: { default: null, ':hover': 'underline', ':focus': { default: 'none', ':hover': 'underline' } },
    backgroundColor: {
      default: 'transparent',
      ':hover': 'transparent',
      ':focus': { default: colors['--gf-colors-primary-transparent'], ':hover': 'transparent' },
      ':active': 'transparent',
    },
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    padding: `calc(${spacing['--gf-spacing-grid-size']} * 0)`,
  },
  footerSection: {
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors['--gf-colors-border-medium'],
    padding: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
  },
  oneClickWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  infoIcon: {
    color: colors['--gf-colors-primary-main'],
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
  },
});
