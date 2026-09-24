import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

import { type ExploreUrlState, serializeStateToUrlParam, toURLRange } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import {
  type SceneComponentProps,
  SceneObjectBase,
  type SceneObjectState,
  type SceneTimeRangeState,
  type SceneVariableSetState,
  sceneGraph,
} from '@grafana/scenes';
import { type DataQuery } from '@grafana/schema';
import { Button, Dropdown, Icon, IconButton, Menu, Modal } from '@grafana/ui';

import { trackInsightsFeedback } from '../Analytics';

type DataQueryWithExpr = DataQuery & { expr: string };

const getPrometheusExploreUrl = ({
  queries,
  range,
  variables,
}: {
  queries?: DataQueryWithExpr[];
  range: SceneTimeRangeState;
  variables: SceneVariableSetState;
}): string => {
  // In Mimir-per-group panels, replace `$rule_group` in the query expression with the actual rule group value
  const ruleGroup = variables?.variables.find((v) => v.state.name === 'rule_group')?.getValue() || null;
  if (ruleGroup !== null) {
    queries = queries?.map((query) => {
      return {
        ...query,
        expr: query.expr.replace('$rule_group', String(ruleGroup)),
      };
    });
  }
  const urlState: ExploreUrlState = {
    datasource: (queries?.length && queries[0].datasource?.uid) || null,
    queries:
      queries?.map(({ expr, refId }, i) => {
        return { expr, refId };
      }) || [],
    range: toURLRange(range ? { from: range.from, to: range.to } : { from: 'now-1h', to: 'now' }),
  };

  const param = encodeURIComponent(serializeStateToUrlParam(urlState));

  return `/explore?left=${param}`;
};

const InsightsMenuButtonRenderer = ({ model }: SceneComponentProps<InsightsMenuButton>) => {
  const data = sceneGraph.getData(model).useState();
  const timeRange = sceneGraph.getTimeRange(model).useState();
  const variables = sceneGraph.getVariables(model).useState();
  const panel = model.state.panel;

  const url = getPrometheusExploreUrl({
    queries: data.data?.request?.targets as DataQueryWithExpr[],
    range: timeRange,
    variables: variables,
  });

  const [showModal, setShowModal] = useState<boolean>(false);

  const onDismiss = () => {
    setShowModal(false);
  };

  const onButtonClick = (useful: boolean) => {
    trackInsightsFeedback({ useful, panel: panel });
    onDismiss();
  };

  const modal = (
    <Modal
      title={t('alerting.insights-menu-button-renderer.modal.title-rate-this-panel', 'Rate this panel')}
      isOpen={showModal}
      onDismiss={onDismiss}
      onClickBackdrop={onDismiss}
      xstyle={styles.feedbackModal}
    >
      <div>
        <p>
          <Trans i18nKey="alerting.insights-menu-button-renderer.help-us">
            Help us improve this page by telling us whether this panel is useful to you!
          </Trans>
        </p>
        <div {...stylex.props(styles.buttonsContainer)}>
          <Button variant="secondary" xstyle={styles.feedbackButton} onClick={() => onButtonClick(false)}>
            <div {...stylex.props(styles.button)}>
              <Icon name="thumbs-up" xstyle={styles.thumbsdown} size="xxxl" />
              <span>{`I don't like it`}</span>
            </div>
          </Button>
          <Button variant="secondary" xstyle={styles.feedbackButton} onClick={() => onButtonClick(true)}>
            <div {...stylex.props(styles.button)}>
              <Icon name="thumbs-up" size="xxxl" />
              <span>
                <Trans i18nKey="alerting.insights-menu-button-renderer.modal.i-like-it">I like it</Trans>
              </span>
            </div>
          </Button>
        </div>
      </div>
    </Modal>
  );

  const menu = (
    <Menu>
      <Menu.Item
        label={t('alerting.insights-menu-button-renderer.menu.label-explore', 'Explore')}
        icon="compass"
        url={url}
        target="_blank"
      />
      <Menu.Item
        label={t('alerting.insights-menu-button-renderer.menu.label-rate-this-panel', 'Rate this panel')}
        icon="comment-alt-message"
        onClick={() => setShowModal(true)}
      />
    </Menu>
  );

  return (
    <div>
      <Dropdown overlay={menu} placement="bottom-start">
        <IconButton
          name="ellipsis-v"
          variant="secondary"
          xstyle={styles.menuButton}
          aria-label={t('alerting.insights-menu-button-renderer.aria-label-rate-this-panel', 'Rate this panel')}
        />
      </Dropdown>
      {modal}
    </div>
  );
};

interface InsightsMenuButtonState extends SceneObjectState {
  panel: string;
}

export class InsightsMenuButton extends SceneObjectBase<InsightsMenuButtonState> {
  static Component = InsightsMenuButtonRenderer;
}

const styles = stylex.create({
  feedbackModal: {
    maxWidth: '370px',
  },
  feedbackButton: {
    height: '150px',
    width: '150px',
    cursor: 'pointer',
    justifyContent: 'center',
  },
  menuButton: {
    height: '25px',
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: '25px',
  },
  button: {
    display: 'flex',
    flexDirection: 'column',
  },
  thumbsdown: {
    transform: 'scale(-1, -1)',
  },
});
