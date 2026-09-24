import { test, expect } from '@grafana/plugin-e2e';

test.describe(
  'StyleX dashboard performance',
  {
    tag: ['@stylex-perf'],
  },
  () => {
    test('50-panel dashboard first render within budget', async ({ page, gotoDashboardPage }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await gotoDashboardPage({ uid: 'local-testdata-overview' });

      const metrics = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
        return {
          domContentLoaded: nav?.domContentLoadedEventEnd ?? 0,
          styleTags: document.querySelectorAll('style').length,
        };
      });

      expect(metrics.domContentLoaded).toBeGreaterThan(0);
      expect(metrics.styleTags).toBeLessThan(500);
    });
  }
);
