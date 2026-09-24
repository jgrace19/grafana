import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { PureComponent } from 'react';

import { type PanelProps } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { Button, Spinner } from '@grafana/ui';

import { gettingStartedStyles } from './GettingStarted.stylex';
import { backendSrv } from 'app/core/services/backend_srv';
import { contextSrv } from 'app/core/services/context_srv';
import { getDashboardSrv } from 'app/features/dashboard/services/DashboardSrv';

import { Step } from './components/Step';
import { getSteps } from './steps';
import { type SetupStep } from './types';

interface State {
  checksDone: boolean;
  currentStep: number;
  steps: SetupStep[];
}

export class GettingStarted extends PureComponent<PanelProps, State> {
  state = {
    checksDone: false,
    currentStep: 0,
    steps: getSteps(),
  };

  async componentDidMount() {
    const { steps } = this.state;

    const checkedStepsPromises: Array<Promise<SetupStep>> = steps.map(async (step: SetupStep) => {
      const checkedCardsPromises = step.cards.map(async (card) => {
        return card.check().then((passed) => {
          return { ...card, done: passed };
        });
      });
      const checkedCards = await Promise.all(checkedCardsPromises);
      return {
        ...step,
        done: checkedCards.every((c) => c.done),
        cards: checkedCards,
      };
    });

    const checkedSteps = await Promise.all(checkedStepsPromises);

    this.setState({
      currentStep: !checkedSteps[0].done ? 0 : 1,
      steps: checkedSteps,
      checksDone: true,
    });
  }

  onForwardClick = () => {
    reportInteraction('grafana_getting_started_button_to_advanced_tutorials');
    this.setState((prevState) => ({
      currentStep: prevState.currentStep + 1,
    }));
  };

  onPreviousClick = () => {
    reportInteraction('grafana_getting_started_button_to_basic_tutorials');
    this.setState((prevState) => ({
      currentStep: prevState.currentStep - 1,
    }));
  };

  dismiss = () => {
    const { id } = this.props;
    const dashboard = getDashboardSrv().getCurrent();
    const panel = dashboard?.getPanelById(id);

    reportInteraction('grafana_getting_started_remove_panel');

    dashboard?.removePanel(panel!);

    backendSrv.put('/api/user/helpflags/1', undefined, { showSuccessAlert: false }).then((res) => {
      contextSrv.user.helpFlags1 = res.helpFlags1;
    });
  };

  render() {
    const { checksDone, currentStep, steps } = this.state;
    const step = steps[currentStep];

    return (
      <div {...stylex.props(gettingStartedStyles.container)}>
        {!checksDone ? (
          <div {...stylex.props(gettingStartedStyles.loading)}>
            <div {...stylex.props(gettingStartedStyles.loadingText)}>
              <Trans i18nKey="gettingstarted.getting-started.checking-completed-setup-steps">
                Checking completed setup steps
              </Trans>
            </div>
            <Spinner size="xl" inline />
          </div>
        ) : (
          <>
            <Button
              size="sm"
              fill="text"
              className={stylex.props(gettingStartedStyles.dismiss).className}
              onClick={this.dismiss}
            >
              <Trans i18nKey="gettingstarted.getting-started.remove-this-panel">Remove this panel</Trans>
            </Button>
            {currentStep === steps.length - 1 && (
              <Button
                className={clsx(
                  stylex.props(gettingStartedStyles.backForwardButtons).className,
                  stylex.props(gettingStartedStyles.previous).className
                )}
                onClick={this.onPreviousClick}
                aria-label={t('gettingstarted.getting-started.aria-label-to-basic-tutorials', 'To basic tutorials')}
                icon="angle-left"
                variant="secondary"
              />
            )}
            <div {...stylex.props(gettingStartedStyles.content)}>
              <Step step={step} />
            </div>
            {currentStep < steps.length - 1 && (
              <Button
                className={clsx(
                  stylex.props(gettingStartedStyles.backForwardButtons).className,
                  stylex.props(gettingStartedStyles.forward).className
                )}
                onClick={this.onForwardClick}
                aria-label={t(
                  'gettingstarted.getting-started.aria-label-to-advanced-tutorials',
                  'To advanced tutorials'
                )}
                icon="angle-right"
                variant="secondary"
              />
            )}
          </>
        )}
      </div>
    );
  }
}
