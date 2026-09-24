import * as stylex from '@stylexjs/stylex';

import { spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

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
        <div {...stylex.props(styles.cheatSheetItem)} key={item.title}>
          <div {...stylex.props(styles.cheatSheetItemTitle)}>{item.title}</div>
          {item.label}
        </div>
      ))}
    </div>
  );
};

const styles = stylex.create({
  cheatSheetItem: {
    marginTop: spacing['--gf-spacing-x3'],
    marginRight: spacing['--gf-spacing-x0'],
    marginBottom: spacing['--gf-spacing-x3'],
    marginLeft: spacing['--gf-spacing-x0'],
  },

  cheatSheetItemTitle: {
    fontSize: typography['--gf-typography-h3-font-size'],
  },
});
