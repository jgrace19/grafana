import inject, { STYLEX_STYLE_ELEMENT_ATTRIBUTE } from './inject';

function getStylexSheet() {
  const element = document.head.querySelector<HTMLStyleElement>(`style[${STYLEX_STYLE_ELEMENT_ATTRIBUTE}]`);
  return { element, rules: Array.from(element?.sheet?.cssRules ?? []).map((rule) => rule.cssText) };
}

describe('StyleX runtime injection', () => {
  it('places the sheet before any existing head element', () => {
    const existing = document.createElement('style');
    document.head.appendChild(existing);

    inject({ ltr: '.a1{color:red}', priority: 3000 });

    const { element } = getStylexSheet();
    expect(element).not.toBeNull();
    expect(document.head.firstElementChild).toBe(element);
  });

  it('orders rules by priority and keeps plain class specificity', () => {
    inject({ ltr: '.b3{margin-top:1px}', priority: 4000 });
    inject({ ltr: '.b1{margin:0}', priority: 1000 });
    inject({ ltr: '.b2:hover{opacity:.5}', priority: 3130 });
    inject({ ltr: '.b0{padding:0}', priority: 2000 });

    const rules = getStylexSheet().rules.filter((rule) => rule.startsWith('.b'));
    expect(rules.map((rule) => rule.split(/[{:]/)[0].trim())).toEqual(['.b1', '.b0', '.b2', '.b3']);
    expect(rules.join('')).not.toContain(':not(#');
  });

  it('inserts each rule once', () => {
    inject({ ltr: '.c1{color:blue}', priority: 3000 });
    inject({ ltr: '.c1{color:blue}', priority: 3000 });
    expect(getStylexSheet().rules.filter((rule) => rule.startsWith('.c1'))).toHaveLength(1);
  });

  it('resolves defineConsts placeholders', () => {
    inject({ ltr: '', priority: 0, constKey: 'xconst1', constVal: '6px' });
    inject({ ltr: '.d1{gap:var(--xconst1)}', priority: 2000 });
    expect(getStylexSheet().rules).toContain('.d1 {gap: 6px;}');
  });
});
