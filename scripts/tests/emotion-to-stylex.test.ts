import { applyTransform } from 'jscodeshift/dist/testUtils';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const transform = require('../codemods/emotion-to-stylex.cjs');

const run = (source: string, path = 'public/app/features/demo/Demo.tsx') =>
  applyTransform(transform, {}, { source, path }, { parser: 'tsx' });

describe('emotion-to-stylex codemod', () => {
  it('converts a theme-only getStyles and its call sites', () => {
    const output = run(`
import { css, cx } from '@emotion/css';

import { type GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';

export function Demo({ className, active }: { className?: string; active: boolean }) {
  const styles = useStyles2(getStyles);
  return (
    <div className={cx(styles.wrapper, active && styles.active, className)}>
      <span className={styles.label}>x</span>
    </div>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  wrapper: css({
    label: 'demo-wrapper',
    padding: theme.spacing(1, 2),
    color: theme.colors.text.primary,
    '&:hover': { color: theme.colors.text.maxContrast },
    [theme.breakpoints.up('md')]: { display: 'flex' },
  }),
  active: css({ background: theme.colors.background.secondary }),
  label: css({ zIndex: theme.zIndex.tooltip }),
});
`);

    expect(output).toContain("import * as stylex from '@stylexjs/stylex';");
    expect(output).toContain("import { bp, zIndex } from '@grafana/ui/stylex/constants.stylex';");
    expect(output).toContain("import { mergeStylexProps } from '@grafana/ui/internal';");
    expect(output).toContain("import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';");
    expect(output).not.toContain('@emotion/css');
    expect(output).not.toContain('useStyles2');
    expect(output).not.toContain('GrafanaTheme2');
    expect(output).toContain('{...mergeStylexProps(stylex.props(styles.wrapper, active && styles.active), {');
    expect(output).toContain('<span {...stylex.props(styles.label)}>');
    expect(output).toContain("paddingTop: spacing['--gf-spacing-x1']");
    expect(output).toContain("paddingRight: spacing['--gf-spacing-x2']");
    expect(output).toContain("paddingLeft: spacing['--gf-spacing-x2']");
    expect(output).toMatch(
      /color: \{\s+default: colors\['--gf-colors-text-primary'\],\s+':hover': colors\['--gf-colors-text-max-contrast'\],/
    );
    expect(output).toMatch(/display: \{\s+default: null,\s+\[bp\.mdUp\]: 'flex',/);
    expect(output).toContain("backgroundColor: colors['--gf-colors-background-secondary']");
    expect(output).toContain('zIndex: zIndex.tooltip');
    expect(output).not.toContain('demo-wrapper');
    expect(output).not.toContain('TODO(stylex)');
  });

  it('uses relative imports inside @grafana/ui', () => {
    const output = run(
      `
import { css } from '@emotion/css';
import { type GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '../../themes/ThemeContext';

export const Box = () => {
  const styles = useStyles2(getStyles);
  return <div className={styles.box} />;
};

const getStyles = (theme: GrafanaTheme2) => ({ box: css({ gap: theme.spacing(0.75) }) });
`,
      'packages/grafana-ui/src/components/Box/Box.tsx'
    );

    expect(output).toContain("from '../../themes/stylex/tokens.stylex'");
    expect(output).toContain("gap: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`");
    expect(output).not.toContain('ThemeContext');
  });

  it('leaves selectors it cannot translate for the migrator', () => {
    const output = run(`
import { css } from '@emotion/css';
import { type GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';

export const Row = () => {
  const styles = useStyles2(getStyles);
  return <div className={styles.row} />;
};

const getStyles = (theme: GrafanaTheme2) => ({
  row: css({ display: 'flex', '& svg': { color: 'red' }, border: \`1px solid \${theme.colors.border.weak}\` }),
});
`);

    expect(output).toContain('TODO(stylex): restructure by hand');
    expect(output).toContain("row › '& svg': {…} (restructure: selector)");
    expect(output).toContain('row › border:');
    expect(output).toContain("display: 'flex'");
  });

  it('only annotates prop-driven style factories', () => {
    const source = `
import { css } from '@emotion/css';
import { type GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';

export const Bar = ({ width }: { width: number }) => {
  const styles = useStyles2(getStyles, width);
  return <div className={styles.bar} />;
};

const getStyles = (theme: GrafanaTheme2, width: number) => ({ bar: css({ width }) });
`;
    const output = run(source);

    expect(output).toContain('TODO(stylex): getStyles: prop-driven or non-literal style factory');
    expect(output).toContain("import { css } from '@emotion/css';");
    expect(output).toContain('useStyles2(getStyles, width)');
  });

  it('skips files without Emotion', () => {
    expect(run(`export const a = 1;`)).toBe('');
  });
});
