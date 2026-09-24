// App capture targets. Each target is loaded in a fresh browser context (clean
// localStorage) with `?theme=<light|dark>` appended, which Grafana applies at boot.
//
// Fields:
//   name      output file name (app/<theme>/<name>.png)
//   path      URL path (string, or async (ctx) => string for runtime-resolved UIDs)
//   auth      default true; false = anonymous (login page)
//   prepare   async (page, ctx) => void, runs after the page settles
//   mask      CSS selectors painted #FF00FF in the screenshot (non-deterministic content).
//             Masks are fixed up front; adding/widening one needs coordinator approval.
//   splash    true = leave the "what's new" splash modal visible (default: stubbed dismissed)
//   localStorage  entries written before the app boots
//   fixedClock    true = Date fixed at FREEZE_TIME from boot (pages that query relative ranges)
//   note      why a mask/prepare exists (copied into manifest.json)

const RANGE = { from: '1704067200000', to: '1704088800000' }; // 2024-01-01 00:00 -> 06:00 UTC
const TESTDATA = { type: 'grafana-testdata-datasource', uid: 'vb-testdata' };

function exploreUrl(queries) {
  const panes = { vb: { datasource: 'vb-testdata', queries, range: RANGE } };
  return `/explore?schemaVersion=1&orgId=1&panes=${encodeURIComponent(JSON.stringify(panes))}`;
}

async function folderUid(ctx, title) {
  const res = await ctx.api(`/api/search?type=dash-folder&query=${encodeURIComponent(title)}`);
  const hit = res.find((f) => f.title === title);
  if (!hit) {
    throw new Error(`folder not found: ${title}`);
  }
  return hit.uid;
}

async function userUid(ctx, login) {
  const u = await ctx.api(`/api/users/lookup?loginOrEmail=${encodeURIComponent(login)}`);
  return u.uid;
}

async function expandAllMenuSections(page) {
  for (let i = 0; i < 30; i++) {
    const btn = page.locator('button[aria-label^="Expand section:"]').first();
    if ((await btn.count()) === 0) {
      break;
    }
    await btn.click();
    await page.waitForTimeout(100);
  }
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('#mega-menu-toggle ~ *, nav, nav *')) {
      if (el.scrollHeight > el.clientHeight) {
        el.scrollTop = 0;
      }
    }
  });
}

async function scrollMainToBottom(page) {
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('main, main *, #pageContent, body, html')) {
      if (el.scrollHeight > el.clientHeight + 10 && getComputedStyle(el).overflowY !== 'hidden') {
        el.scrollTop = el.scrollHeight;
      }
    }
  });
}

async function openCommandPalette(page) {
  await page.keyboard.press('Control+k');
  await page.locator('[role="dialog"] input, input[placeholder*="Search"]').first().waitFor({ state: 'visible', timeout: 10000 });
}

// Only the 16x16 suffix icon of the async contact point Combobox.
const CONTACT_POINT_SUFFIX_ICON = '[data-testid="input-wrapper"]:has(input[placeholder$="contact point"]) svg[data-testid^="icon-"]';

const OVERVIEW_PANELS = [
  [1, 'timeseries'],
  [2, 'stat'],
  [3, 'gauge'],
  [4, 'bargauge'],
  [5, 'barchart'],
  [6, 'piechart'],
  [7, 'table'],
  [8, 'heatmap'],
  [9, 'logs'],
  [10, 'text'],
  [11, 'state-timeline'],
];
const VARIANT_PANELS = [
  [1, 'timeseries-bars'],
  [2, 'timeseries-stacked'],
  [3, 'stat-value'],
  [4, 'bargauge-lcd'],
  [5, 'status-history'],
  [6, 'histogram'],
  [7, 'table-pills-footer'],
];

export const appTargets = [
  { name: 'login', path: '/login', auth: false },
  { name: 'home', path: '/' },
  {
    name: 'splash-screen',
    path: '/',
    splash: true,
    note: '"what\'s new" splash modal; every other target stubs it as dismissed',
  },
  {
    name: 'nav-menu-expanded',
    path: '/',
    prepare: expandAllMenuSections,
    note: 'docked mega menu with every section expanded',
  },
  {
    name: 'nav-menu-undocked-open',
    path: '/',
    localStorage: { 'grafana.navigation.docked': 'false' },
    prepare: async (page) => {
      await page.locator('#mega-menu-toggle').click();
      await page.locator('[data-testid="data-testid navigation mega-menu"]').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    },
    note: 'menu undocked via localStorage, opened as overlay',
  },
  { name: 'search-command-palette', path: '/', prepare: openCommandPalette },
  {
    name: 'search-command-palette-query',
    path: '/',
    prepare: async (page) => {
      await openCommandPalette(page);
      await page.keyboard.type('baseline');
      await page.waitForTimeout(1500);
    },
  },
  { name: 'search-page-query', path: '/dashboards?query=baseline' },
  { name: 'dashboards-browse', path: '/dashboards' },
  { name: 'dashboards-browse-folder', path: async (ctx) => `/dashboards/f/${await folderUid(ctx, 'Visual Baseline')}/` },
  { name: 'dashboard-overview', path: '/d/vb-overview' },
  { name: 'dashboard-variants', path: '/d/vb-variants' },
  { name: 'dashboard-team-alpha', path: '/d/vb-team-alpha' },
  { name: 'dashboard-overview-kiosk', path: '/d/vb-overview?kiosk' },
  ...OVERVIEW_PANELS.map(([id, n]) => ({ name: `panel-view-${n}`, path: `/d/vb-overview?viewPanel=panel-${id}` })),
  ...VARIANT_PANELS.map(([id, n]) => ({ name: `panel-view-${n}`, path: `/d/vb-variants?viewPanel=panel-${id}` })),
  { name: 'panel-edit-timeseries', path: '/d/vb-overview?editPanel=1' },
  { name: 'panel-edit-table', path: '/d/vb-overview?editPanel=7' },
  { name: 'panel-edit-stat', path: '/d/vb-overview?editPanel=2' },
  { name: 'dashboard-settings', path: '/d/vb-overview?editview=settings' },
  { name: 'dashboard-settings-variables', path: '/d/vb-variants?editview=variables' },
  { name: 'dashboard-new', path: '/dashboard/new' },
  {
    name: 'explore-timeseries',
    path: exploreUrl([{ refId: 'A', datasource: TESTDATA, scenarioId: 'csv_metric_values', stringInput: '1,20,90,30,5,0,12,48', alias: 'baseline' }]),
  },
  {
    name: 'explore-table',
    path: exploreUrl([
      {
        refId: 'A',
        datasource: TESTDATA,
        scenarioId: 'csv_content',
        csvContent: 'host,region,cpu\nweb-01,us-east-1,72.4\nweb-02,us-east-1,38.1\ndb-01,eu-west-1,55.0',
      },
    ]),
  },
  { name: 'alerting-home', path: '/alerting' },
  {
    name: 'alerting-list',
    path: '/alerting/list',
    mask: [CONTACT_POINT_SUFFIX_ICON],
    note: 'Combobox suffix icon: react-inlinesvg sometimes keeps the spinner SVG after options load (product race)',
  },
  { name: 'alerting-rule-form-new', path: '/alerting/new/alerting', fixedClock: true },
  { name: 'alerting-rule-view', path: '/alerting/grafana/vb-rule-cpu/view', fixedClock: true, note: 'query preview uses the rule\'s relative range (now-10m)' },
  { name: 'alerting-rule-edit', path: '/alerting/grafana/vb-rule-cpu/edit', fixedClock: true },
  { name: 'alerting-contact-points', path: '/alerting/notifications' },
  {
    name: 'alerting-notification-policies',
    path: '/alerting/routes',
    mask: [CONTACT_POINT_SUFFIX_ICON],
    note: 'Combobox suffix icon: react-inlinesvg sometimes keeps the spinner SVG after options load (product race)',
  },
  { name: 'connections-datasources', path: '/connections/datasources' },
  { name: 'connections-datasource-prometheus', path: '/connections/datasources/edit/vb-prometheus' },
  { name: 'connections-datasource-testdata', path: '/connections/datasources/edit/vb-testdata' },
  { name: 'connections-add-new', path: '/connections/add-new-connection' },
  { name: 'admin-home', path: '/admin' },
  { name: 'admin-users', path: '/admin/users', note: 'Last active comes from normalized API times (capture.mjs normalizeTimes)' },
  {
    name: 'admin-user-edit',
    path: async (ctx) => `/admin/users/edit/${await userUid(ctx, 'alice')}`,
  },
  { name: 'admin-orgs', path: '/admin/orgs' },
  { name: 'admin-teams', path: '/org/teams' },
  { name: 'org-users', path: '/org/users' },
  { name: 'profile', path: '/profile' },
  { name: 'profile-sessions', path: '/profile', prepare: scrollMainToBottom, note: 'session times come from normalized API times' },
  { name: 'plugins-catalog', path: '/plugins' },
  { name: 'plugins-catalog-installed-list', path: '/plugins?filterBy=installed&filterByType=all&sortBy=nameAsc&view=list' },
];
