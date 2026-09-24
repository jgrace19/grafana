import * as stylex from '@stylexjs/stylex';
import { influxCheatSheetStyles } from './InfluxCheatSheet.stylex';

const CHEAT_SHEET_ITEMS = [
  {
    title: 'Getting started',
    label:
      'Start by selecting a measurement and field from the dropdown above. You can then use the tag selector to further narrow your search.',
  },
];

export const InfluxCheatSheet = () => {

  return (
    <div>
      <h2>InfluxDB Cheat Sheet</h2>
      {CHEAT_SHEET_ITEMS.map((item) => (
        <div {...stylex.props(influxCheatSheetStyles.cheatSheetItem)} key={item.title}>
          <div {...stylex.props(influxCheatSheetStyles.cheatSheetItemTitle)}>{item.title}</div>
          {item.label}
        </div>
      ))}
    </div>
  );
};

