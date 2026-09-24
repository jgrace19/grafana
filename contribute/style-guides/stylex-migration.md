# StyleX migration guide

Grafana is migrating core styling from Emotion to StyleX. External plugins continue to use `useStyles2`, `useTheme2`, and `@emotion/css`.

## Tokens

Run `yarn stylex:gen-tokens` after changing `createTheme()` inputs. CI runs `tokens.generated.test.ts` to catch drift.

Use `grafanaTokens` from `@grafana/ui/unstable` inside `stylex.create`. Runtime themes apply via `StyleXThemeScope` and `themeToCssVars`.

## className merge

```tsx
import { mergeStylexClassName } from '@grafana/ui/unstable';

const props = mergeStylexClassName(stylex.props(styles.root), className);
return <div {...props} />;
```

Emotion overrides stay unlayered and win over layered StyleX when specificity matches.

## Variants

Prefer `stylex.props(base, condition && variantStyles)` over runtime `stylex.create` calls.

## Nested selectors

1. Move styles onto the child component.
2. Use `stylex.when.*` when supported.
3. For third-party DOM (react-select, Monaco, uPlot), use data attributes and plain CSS in the `grafana-global` layer.

## Responsive props

Pre-generate maps keyed by breakpoint token for `Box`, `Stack`, and `Grid`.

## Codemod

`yarn stylex:codemod path/to/file.tsx` performs mechanical `theme.spacing(n)` → spacing token replacements. Nested selectors and color math remain manual.
