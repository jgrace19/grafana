
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { noDataStyles } from './NoData.stylex';
import { PanelContainer  } from '@grafana/ui';

export const NoData = () => {
  return (
    <>
      <PanelContainer data-testid="explore-no-data" {...stylex.props(noDataStyles.wrapper)}>
        <span {...stylex.props(noDataStyles.message)}>{'No data'}</span>
      </PanelContainer>
    </>
  );
};

