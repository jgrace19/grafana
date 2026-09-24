import { test, expect } from '@grafana/plugin-e2e';

test.describe(
  'StyleX layer precedence',
  {
    tag: ['@storybook', '@stylex-compat'],
  },
  () => {
    test('Emotion className override wins over core StyleX', async ({ page }) => {
      await page.goto('?path=/story/stylex-layer-precedence--override-wins');
      const iframe = page.frameLocator('#storybook-preview-iframe');
      const target = iframe.locator('[data-testid="stylex-layer-target"]');
      await expect(target).toBeVisible();
      const color = await target.evaluate((el) => getComputedStyle(el).color);
      expect(color).toBe('rgb(255, 0, 0)');
    });
  }
);
