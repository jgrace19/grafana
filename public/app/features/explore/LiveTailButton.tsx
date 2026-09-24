import { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { ButtonGroup, ToolbarButton } from '@grafana/ui';

import './LiveTailButton.global.css';

type LiveTailButtonProps = {
  splitted: boolean;
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isLive: boolean;
  isPaused: boolean;
};

export function LiveTailButton(props: LiveTailButtonProps) {
  const transitionRef = useRef(null);

  const { start, pause, resume, isLive, isPaused, stop, splitted } = props;
  const buttonVariant = isLive && !isPaused ? 'active' : 'canvas';
  const onClickMain = isLive ? (isPaused ? resume : pause) : start;

  return (
    <ButtonGroup>
      <ToolbarButton
        iconOnly={splitted}
        variant={buttonVariant}
        icon={!isLive || isPaused ? 'play' : 'pause'}
        onClick={onClickMain}
        data-testid={selectors.pages.Explore.toolbar.live}
        tooltip={
          !isLive || isPaused
            ? t('explore.live-tail-button.start-live-stream-your-logs', 'Start live stream your logs')
            : t('explore.live-tail-button.pause-the-live-stream', 'Pause the live stream')
        }
      >
        {isLive && isPaused
          ? t('explore.live-tail-button.paused', 'Paused')
          : t('explore.live-tail-button.live', 'Live')}
      </ToolbarButton>

      <CSSTransition
        mountOnEnter={true}
        unmountOnExit={true}
        timeout={100}
        in={isLive}
        classNames={{
          enter: 'gf-explore-live-stop-enter',
          enterActive: 'gf-explore-live-stop-enter-active',
          exit: 'gf-explore-live-stop-exit',
          exitActive: 'gf-explore-live-stop-exit-active',
        }}
        nodeRef={transitionRef}
      >
        <ToolbarButton
          tooltip={t('explore.live-tail-button.stop-and-exit-the-live-stream', 'Stop and exit the live stream')}
          ref={transitionRef}
          variant={buttonVariant}
          onClick={stop}
          icon="square-shape"
        />
      </CSSTransition>
    </ButtonGroup>
  );
}
