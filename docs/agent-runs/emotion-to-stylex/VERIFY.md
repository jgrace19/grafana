# Emotion to StyleX verify log

This log records the verify gate from `.cursor/skills/emotion-to-stylex/SKILL.md` for every batch of the
Emotion to StyleX migration defined in `docs/agent-specs/emotion-to-stylex-grafana-ui.md`.

Each entry is appended by `scripts/stylex/verify-gate.sh` and contains the command, exit code, and last 40 log lines
for these gates:

- **Residual Emotion imports:** `rg -n "@emotion/css|@emotion/react"` over the batch paths (`.ts`/`.tsx`). Exit code 1
  (no matches) is the passing state.
- **Unit tests:** `yarn jest --no-watch <paths>`.
- **Typecheck:** `yarn workspace @grafana/ui typecheck`.
- **Lint:** `yarn eslint --cache <paths>`.

Browser style proof (light and dark screenshots plus computed styles from Chromium) is listed per batch and stored as
Cloud Agent artifacts under `/opt/cursor/artifacts/stylex/`.

## Phase 0 — StyleX foundation (tooling, theme bridge, smoke fixture)

- Date (UTC): 2026-09-24T02:41:49Z
- Base commit: `09be20147b` plus working tree
- Paths: `packages/grafana-ui/src/themes/stylex` `packages/grafana-ui/src/utils/storybook` `packages/grafana-ui/src/internal/index.ts` `public/app/core/utils/ConfigProvider.tsx` `scripts/stylex`

### Residual Emotion imports: FAIL

```sh
rg -n @emotion/css\|@emotion/react -g \*.\{ts\,tsx\} -g \!StyleXThemeFixture.test.tsx packages/grafana-ui/src/themes/stylex packages/grafana-ui/src/utils/storybook packages/grafana-ui/src/internal/index.ts public/app/core/utils/ConfigProvider.tsx scripts/stylex
```

Exit code: 0 (pass = 1)

```text
packages/grafana-ui/src/utils/storybook/ExampleFrame.tsx:1:import { css, cx } from '@emotion/css';
packages/grafana-ui/src/utils/storybook/DashboardStoryCanvas.tsx:1:import { css } from '@emotion/css';
packages/grafana-ui/src/utils/storybook/StoryExample.tsx:1:import { css } from '@emotion/css';
packages/grafana-ui/src/utils/storybook/withStoryContainer.tsx:1:import { css, cx } from '@emotion/css';
```

### Unit tests: PASS

```sh
yarn jest --no-watch packages/grafana-ui/src/themes/stylex packages/grafana-ui/src/utils/storybook packages/grafana-ui/src/internal/index.ts public/app/core/utils/ConfigProvider.tsx scripts/stylex
```

Exit code: 0 (pass = 0)

```text
PASS packages/grafana-ui/src/themes/stylex/StyleXThemeFixture.test.tsx
PASS packages/grafana-ui/src/themes/stylex/useThemeCssVariables.test.tsx
PASS packages/grafana-ui/src/themes/stylex/cssVariables.test.ts
PASS packages/grafana-ui/src/themes/stylex/inject.test.ts

Test Suites: 4 passed, 4 total
Tests:       19 passed, 19 total
Snapshots:   0 total
Time:        3.642 s
Ran all test suites matching /packages\/grafana-ui\/src\/themes\/stylex|packages\/grafana-ui\/src\/utils\/storybook|packages\/grafana-ui\/src\/internal\/index.ts|public\/app\/core\/utils\/ConfigProvider.tsx|scripts\/stylex/i.
```

### @grafana/ui typecheck: PASS

```sh
yarn workspace @grafana/ui typecheck
```

Exit code: 0 (pass = 0)

```text

```

### ESLint: PASS

```sh
yarn eslint --cache packages/grafana-ui/src/themes/stylex packages/grafana-ui/src/utils/storybook packages/grafana-ui/src/internal/index.ts public/app/core/utils/ConfigProvider.tsx scripts/stylex
```

Exit code: 0 (pass = 0)

```text
[@stylistic/eslint-plugin-ts] This package is deprecated in favor of the unified @stylistic/eslint-plugin, please consider migrating to the main package
```

## Phase 0 — StyleX foundation (re-run scoped to files created or touched by the batch)

- Date (UTC): 2026-09-24T02:42:26Z
- Base commit: `09be20147b` plus working tree
- Paths: `packages/grafana-ui/src/themes/stylex` `packages/grafana-ui/src/utils/storybook/fixtures` `packages/grafana-ui/src/utils/storybook/withTheme.tsx` `packages/grafana-ui/src/utils/storybook/ThemedDocsContainer.tsx` `packages/grafana-ui/src/internal/index.ts` `public/app/core/utils/ConfigProvider.tsx` `scripts/stylex`

### Residual Emotion imports: PASS

```sh
rg -n @emotion/css\|@emotion/react -g \*.\{ts\,tsx\} -g \!StyleXThemeFixture.test.tsx packages/grafana-ui/src/themes/stylex packages/grafana-ui/src/utils/storybook/fixtures packages/grafana-ui/src/utils/storybook/withTheme.tsx packages/grafana-ui/src/utils/storybook/ThemedDocsContainer.tsx packages/grafana-ui/src/internal/index.ts public/app/core/utils/ConfigProvider.tsx scripts/stylex
```

Exit code: 1 (pass = 1)

```text

```

### Unit tests: PASS

```sh
yarn jest --no-watch packages/grafana-ui/src/themes/stylex packages/grafana-ui/src/utils/storybook/fixtures packages/grafana-ui/src/utils/storybook/withTheme.tsx packages/grafana-ui/src/utils/storybook/ThemedDocsContainer.tsx packages/grafana-ui/src/internal/index.ts public/app/core/utils/ConfigProvider.tsx scripts/stylex
```

Exit code: 0 (pass = 0)

```text
PASS packages/grafana-ui/src/themes/stylex/inject.test.ts
PASS packages/grafana-ui/src/themes/stylex/cssVariables.test.ts
PASS packages/grafana-ui/src/themes/stylex/useThemeCssVariables.test.tsx
PASS packages/grafana-ui/src/themes/stylex/StyleXThemeFixture.test.tsx

Test Suites: 4 passed, 4 total
Tests:       19 passed, 19 total
Snapshots:   0 total
Time:        1.532 s, estimated 3 s
Ran all test suites matching /packages\/grafana-ui\/src\/themes\/stylex|packages\/grafana-ui\/src\/utils\/storybook\/fixtures|packages\/grafana-ui\/src\/utils\/storybook\/withTheme.tsx|packages\/grafana-ui\/src\/utils\/storybook\/ThemedDocsContainer.tsx|packages\/grafana-ui\/src\/internal\/index.ts|public\/app\/core\/utils\/ConfigProvider.tsx|scripts\/stylex/i.
```

### @grafana/ui typecheck: PASS

```sh
yarn workspace @grafana/ui typecheck
```

Exit code: 0 (pass = 0)

```text

```

### ESLint: PASS

```sh
yarn eslint --cache packages/grafana-ui/src/themes/stylex packages/grafana-ui/src/utils/storybook/fixtures packages/grafana-ui/src/utils/storybook/withTheme.tsx packages/grafana-ui/src/utils/storybook/ThemedDocsContainer.tsx packages/grafana-ui/src/internal/index.ts public/app/core/utils/ConfigProvider.tsx scripts/stylex
```

Exit code: 0 (pass = 0)

```text
[@stylistic/eslint-plugin-ts] This package is deprecated in favor of the unified @stylistic/eslint-plugin, please consider migrating to the main package
```

### Phase 0 browser style proof

Storybook (`yarn workspace @grafana/ui storybook`) was loaded in headless Chromium for
`foundations-stylex-theme-bridge--basic` and `--scoped-themes` with `globals=theme:dark` and `globals=theme:light`.

- **Screenshots:** `phase0-bridge-dark.png`, `phase0-bridge-light.png`, `phase0-scoped-dark.png`, `phase0-scoped-light.png`.
- **Computed styles:** `phase0-computed.json`. The fixture card resolves `background-color` to `rgb(34, 37, 43)` in dark and
  `rgb(244, 245, 245)` in light (`theme.colors.background.secondary`), `padding` to `16px` (`theme.spacing(2)`), and the
  StyleX sheet is the first element in `<head>` in both themes.

## Phase 1 — Lane Tags (Tag, TagList)

- Date (UTC): 2026-09-24T02:47:29Z
- Base commit: `5abf3bdc28` plus working tree
- Paths: `packages/grafana-ui/src/components/Tags`

### Residual Emotion imports: PASS

```sh
rg -n @emotion/css\|@emotion/react -g \*.\{ts\,tsx\} packages/grafana-ui/src/components/Tags
```

Exit code: 1 (pass = 1)

```text

```

### Unit tests: PASS

```sh
yarn jest --no-watch packages/grafana-ui/src/components/Tags
```

Exit code: 0 (pass = 0)

```text
PASS packages/grafana-ui/src/components/Tags/Tag.test.tsx
PASS packages/grafana-ui/src/components/Tags/TagList.test.tsx
PASS packages/grafana-ui/src/components/TagsInput/TagsInput.test.tsx

Test Suites: 3 passed, 3 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        1.953 s, estimated 2 s
Ran all test suites matching /packages\/grafana-ui\/src\/components\/Tags/i.
```

### @grafana/ui typecheck: PASS

```sh
yarn workspace @grafana/ui typecheck
```

Exit code: 0 (pass = 0)

```text

```

### ESLint: FAIL

```sh
yarn eslint --cache packages/grafana-ui/src/components/Tags
```

Exit code: 1 (pass = 0)

```text
[@stylistic/eslint-plugin-ts] This package is deprecated in favor of the unified @stylistic/eslint-plugin, please consider migrating to the main package

/workspace/packages/grafana-ui/src/components/Tags/Tag.test.tsx
  113:18  error  Use toHaveStyle instead of asserting on element style  jest-dom/prefer-to-have-style

✖ 1 problem (1 error, 0 warnings)
  1 error and 0 warnings potentially fixable with the `--fix` option.

```

## Phase 1 — Lane Tags (re-run after lint fix)

- Date (UTC): 2026-09-24T02:48:03Z
- Base commit: `5abf3bdc28` plus working tree
- Paths: `packages/grafana-ui/src/components/Tags`

### Residual Emotion imports: PASS

```sh
rg -n @emotion/css\|@emotion/react -g \*.\{ts\,tsx\} packages/grafana-ui/src/components/Tags
```

Exit code: 1 (pass = 1)

```text

```

### Unit tests: PASS

```sh
yarn jest --no-watch packages/grafana-ui/src/components/Tags
```

Exit code: 0 (pass = 0)

```text
PASS packages/grafana-ui/src/components/Tags/Tag.test.tsx
PASS packages/grafana-ui/src/components/Tags/TagList.test.tsx
PASS packages/grafana-ui/src/components/TagsInput/TagsInput.test.tsx

Test Suites: 3 passed, 3 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        1.984 s, estimated 2 s
Ran all test suites matching /packages\/grafana-ui\/src\/components\/Tags/i.
```

### @grafana/ui typecheck: PASS

```sh
yarn workspace @grafana/ui typecheck
```

Exit code: 0 (pass = 0)

```text

```

### ESLint: PASS

```sh
yarn eslint --cache packages/grafana-ui/src/components/Tags
```

Exit code: 0 (pass = 0)

```text
[@stylistic/eslint-plugin-ts] This package is deprecated in favor of the unified @stylistic/eslint-plugin, please consider migrating to the main package
```

### Lane Tags browser style proof

Emotion baseline and StyleX builds of `information-tag--single` and `information-taglist--list` were captured in headless
Chromium in dark and light. Every element's computed `display`, flex, gap, padding, margin, border, radius, colors,
typography, `white-space`, `opacity`, `cursor`, size, and non-class attributes were compared, plus the hover state of
the first clickable tag.

- **Result:** `compared 1020 values, 0 differences` (`parity-baseline.json` vs `parity-stylex-tags.json`).
- **Screenshots:** `information-tag--single-{dark,light}-{baseline,stylex-tags}.png`,
  `information-taglist--list-{dark,light}-{baseline,stylex-tags}.png`.

## Phase 1 — Lane Badge

- Date (UTC): 2026-09-24T02:50:35Z
- Base commit: `9777f72ab4` plus working tree
- Paths: `packages/grafana-ui/src/components/Badge`

### Residual Emotion imports: PASS

```sh
rg -n @emotion/css\|@emotion/react -g \*.\{ts\,tsx\} packages/grafana-ui/src/components/Badge
```

Exit code: 1 (pass = 1)

```text

```

### Unit tests: PASS

```sh
yarn jest --no-watch packages/grafana-ui/src/components/Badge
```

Exit code: 0 (pass = 0)

```text
PASS packages/grafana-ui/src/components/Badge/Badge.test.tsx

Test Suites: 1 passed, 1 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        1.379 s, estimated 2 s
Ran all test suites matching /packages\/grafana-ui\/src\/components\/Badge/i.
```

### @grafana/ui typecheck: PASS

```sh
yarn workspace @grafana/ui typecheck
```

Exit code: 0 (pass = 0)

```text

```

### ESLint: PASS

```sh
yarn eslint --cache packages/grafana-ui/src/components/Badge
```

Exit code: 0 (pass = 0)

```text
[@stylistic/eslint-plugin-ts] This package is deprecated in favor of the unified @stylistic/eslint-plugin, please consider migrating to the main package
```

### Lane Badge browser style proof

`information-badge--basic` and `information-badge--examples` (all seven colors, including the `brand` gradient) were
captured from the Emotion baseline and the StyleX build in dark and light and compared with the same property set as
the Tags lane.

- **Result:** `compared 1564 values, 0 differences` (`parity-baseline.json` vs `parity-stylex-badge.json`).
- **Screenshots:** `information-badge--{basic,examples}-{dark,light}-{baseline,stylex-badge}.png`.
