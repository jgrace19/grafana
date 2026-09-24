import * as stylex from '@stylexjs/stylex';

import { type CloudWatchDatasource } from '../../../datasource';

import { LogGroupSelector } from './LegacyLogGroupSelector';

type Props = {
  datasource: CloudWatchDatasource;
  onChange: (logGroups: string[]) => void;
  region: string;
  legacyLogGroupNames: string[];
};

export const LegacyLogGroupSelection = ({ datasource, region, legacyLogGroupNames, onChange }: Props) => {
  return (
    <div className={`gf-form gf-form--grow flex-grow-1 ${stylex.props(styles.rowGap).className}`}>
      <LogGroupSelector
        region={region}
        selectedLogGroups={legacyLogGroupNames}
        datasource={datasource}
        onChange={onChange}
      />
    </div>
  );
};

const styles = stylex.create({
  rowGap: {
    gap: '3px',
  },
});
