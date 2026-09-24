import { test, expect } from '@grafana/plugin-e2e';

const STORYBOOK_STORIES = [
  'layout-divider--horizontal',
  'layout-divider--vertical',
  'foundations-text--body',
  'information-badge--blue',
  'information-spinner--basic',
  'layout-card--basic',
];

test.describe(
  'StyleX visual regression (Storybook)',
  {
    tag: ['@storybook', '@stylex-visual'],
  },
  () => {
    for (const storyId of STORYBOOK_STORIES) {
      for (const theme of ['light', 'dark'] as const) {
        test(`${storyId} (${theme})`, async ({ page }) => {
          await page.emulateMedia({ reducedMotion: 'reduce' });
          await page.goto(`?path=/story/${storyId}&globals=theme:${theme}`);
          const iframe = page.frameLocator('#storybook-preview-iframe');
          await expect(iframe.locator('body')).toBeVisible({ timeout: 30_000 });
          await expect(iframe.locator('body')).toHaveScreenshot(`${storyId}-${theme}.png`, {
            maxDiffPixelRatio: 0.01,
          });
        });
      }
    }
  }
);
