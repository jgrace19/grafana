import { serializeStyles } from '@emotion/serialize';
import { compile, middleware, serialize, stringify } from 'stylis';

import { createTheme } from '@grafana/data';

import { getGlobalStyles } from './GlobalStyles';
import { wrapInGlobalLayer } from './globalLayerCache';

/** The top-level rules Emotion would insert one by one, after the layer plugin ran. */
function compileGlobalRules() {
  const { styles } = serializeStyles([getGlobalStyles(createTheme())]);
  const rules: string[] = [];
  serialize(
    compile(styles),
    middleware([
      wrapInGlobalLayer,
      stringify,
      (element) => {
        if (!element.root && element.return) {
          rules.push(element.return);
        }
      },
    ])
  );
  return rules;
}

describe('GlobalStyles layering', () => {
  it('puts every global rule in its own grafana-global layer block', () => {
    const rules = compileGlobalRules();

    expect(rules.length).toBeGreaterThan(100);
    for (const rule of rules) {
      expect(rule).toMatch(/^@layer grafana-global\{.*\}$/s);
    }
  });

  it('isolates the unparseable forms.ts rule from the rules after it', () => {
    const rules = compileGlobalRules();
    const broken = rules.findIndex((rule) => rule.includes('.gf-form-input--dropdown::after'));

    // `content: '"\f0d7"'` puts a form feed in a CSS string, which the browser can't close.
    expect(rules[broken]).toContain('\f');
    expect(rules.slice(broken + 1).some((rule) => rule.startsWith('@layer grafana-global{.grafana-app{'))).toBe(true);
  });

  it('layers the disabled/read-only form field rules like every other global rule', () => {
    const rules = compileGlobalRules();

    expect(
      rules.some((rule) => rule.startsWith('@layer grafana-global{input[disabled],select[disabled],textarea[disabled]'))
    ).toBe(true);
  });
});
