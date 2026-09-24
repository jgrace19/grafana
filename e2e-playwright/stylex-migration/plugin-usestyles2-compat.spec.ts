import { expect, test } from '@grafana/plugin-e2e';

test.describe(
  'StyleX external plugin compatibility',
  {
    tag: ['@stylex-compat'],
  },
  () => {
    test('useStyles2 panel renders with theme math and className override', async ({ panelEditPage }) => {
      await panelEditPage.setVisualization('Grafana useStyles2 Compat Panel');

      const host = panelEditPage.panel.locator.getByTestId('usestyles2-compat-host');
      await expect(host).toBeVisible();

      const badge = panelEditPage.panel.locator.getByTestId('usestyles2-compat-badge');
      await expect(badge).toBeVisible();

      const themeColorEl = panelEditPage.panel.locator.getByTestId('usestyles2-compat-theme-color');
      const color = await themeColorEl.evaluate((el) => getComputedStyle(el).color);
      expect(color).not.toBe('');

      const outlineWidth = await badge.evaluate((el) => getComputedStyle(el).outlineWidth);
      expect(outlineWidth).not.toBe('0px');

      // Sanity: host receives panel dimensions from Grafana
      const box = await host.boundingBox();
      expect(box?.width).toBeGreaterThan(0);
      expect(box?.height).toBeGreaterThan(0);
    });
  }
);
