#!/usr/bin/env node
// Generates the provisioned baseline dashboards from a fixed-seed PRNG.
// All panel data is inline CSV (testdata `csv_content`), and every dashboard uses
// an absolute UTC time range, so renders are identical across runs and machines.
//
//   node scripts/gen-dashboards.mjs            # writes provisioning/dashboards/json/**
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(HERE, '../provisioning/dashboards/json');
export const SEED = 20240101;
export const TIME_FROM = '2024-01-01T00:00:00.000Z';
export const TIME_TO = '2024-01-01T06:00:00.000Z';
const T0 = Date.parse(TIME_FROM);
const DS = { type: 'grafana-testdata-datasource', uid: 'vb-testdata' };

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(SEED);
const r1 = (v) => Math.round(v * 10) / 10;

function walk(n, start, step, min, max) {
  const out = [];
  let v = start;
  for (let i = 0; i < n; i++) {
    v = Math.min(max, Math.max(min, v + (rand() - 0.5) * step));
    out.push(r1(v));
  }
  return out;
}

function timeCsv(stepMin, n, columns) {
  const names = Object.keys(columns);
  const lines = [['time', ...names].join(',')];
  for (let i = 0; i < n; i++) {
    lines.push([T0 + i * stepMin * 60000, ...names.map((k) => columns[k][i])].join(','));
  }
  return lines.join('\n');
}

const N5 = 73; // 6h at 5 minute resolution, inclusive
const csv = {
  cpuMem: timeCsv(5, N5, {
    cpu: walk(N5, 45, 12, 5, 95),
    mem: walk(N5, 60, 6, 20, 90),
    'io wait': walk(N5, 12, 6, 0, 40),
  }),
  requests: timeCsv(5, N5, { requests: walk(N5, 1200, 180, 400, 2400).map(Math.round) }),
  disk: timeCsv(60, 7, { disk: [61.2, 62.5, 63.1, 64.8, 66.0, 67.4, 71.9] }),
  services: ['service,latency', 'api-gateway,182', 'checkout,341', 'search,96', 'auth,57', 'inventory,228'].join('\n'),
  revenue: ['month,revenue,costs', 'Jan,42,31', 'Feb,48,33', 'Mar,51,35', 'Apr,46,36', 'May,58,38', 'Jun,63,41'].join('\n'),
  browsers: ['browser,share', 'Chrome,64.2', 'Safari,18.9', 'Edge,5.3', 'Firefox,3.1', 'Other,8.5'].join('\n'),
  hosts: [
    'host,region,cpu,mem,status,healthy',
    'web-01,us-east-1,72.4,61.0,serving,true',
    'web-02,us-east-1,38.1,55.2,serving,true',
    'web-03,eu-west-1,91.7,83.9,degraded,false',
    'db-01,eu-west-1,55.0,77.3,serving,true',
    'db-02,ap-south-1,12.9,40.6,maintenance,false',
    'cache-01,ap-south-1,27.3,33.8,serving,true',
    'queue-01,us-west-2,64.8,58.1,serving,true',
  ].join('\n'),
  heatmap: (() => {
    const buckets = ['10', '25', '50', '100', '250', '500'];
    const cols = {};
    for (const b of buckets) {
      cols[b] = [];
    }
    for (let i = 0; i < 31; i++) {
      buckets.forEach((b, bi) => {
        const peak = 2 + Math.sin(i / 5) * 1.2;
        cols[b].push(Math.max(0, Math.round(40 * Math.exp(-((bi - peak) ** 2)) + rand() * 6)));
      });
    }
    return timeCsv(12, 31, cols);
  })(),
  logs: (() => {
    const levels = ['info', 'info', 'info', 'warn', 'error', 'debug'];
    const msgs = [
      'GET /api/dashboards/uid/vb-overview 200 12ms',
      'POST /api/ds/query 200 48ms',
      'cache miss for key=panel:7',
      'slow query detected duration=1.8s',
      'upstream connect error reset reason=timeout',
      'reloading provisioning config',
      'user admin logged in',
      'GET /api/search?query= 200 7ms',
    ];
    const lines = ['time,line,level'];
    for (let i = 0; i < 24; i++) {
      const msg = msgs[Math.floor(rand() * msgs.length)];
      const lvl = levels[Math.floor(rand() * levels.length)];
      lines.push(`${T0 + 5 * 3600000 + i * 150000},${msg},${lvl}`);
    }
    return lines.join('\n');
  })(),
  states: (() => {
    const s = ['OK', 'OK', 'OK', 'WARN', 'DOWN'];
    const lines = ['time,api,db,queue'];
    for (let i = 0; i < 25; i++) {
      lines.push([T0 + i * 15 * 60000, s[Math.floor(rand() * 5)], s[Math.floor(rand() * 5)], s[Math.floor(rand() * 5)]].join(','));
    }
    return lines.join('\n');
  })(),
  latencySamples: (() => {
    const lines = ['time,latency'];
    for (let i = 0; i < 200; i++) {
      const v = Math.round(80 + (rand() + rand() + rand()) * 90);
      lines.push(`${T0 + i * 100000},${v}`);
    }
    return lines.join('\n');
  })(),
};

const target = (csvContent, refId = 'A') => ({ refId, datasource: DS, scenarioId: 'csv_content', csvContent });

let nextId = 1;
function panel(type, title, gridPos, csvContent, extra = {}) {
  return {
    id: nextId++,
    type,
    title,
    gridPos,
    datasource: DS,
    targets: csvContent ? [target(csvContent)] : [],
    fieldConfig: { defaults: {}, overrides: [] },
    options: {},
    ...extra,
  };
}

const thresholds = (steps) => ({ mode: 'absolute', steps });
const GYR = thresholds([
  { color: 'green', value: null },
  { color: 'orange', value: 70 },
  { color: 'red', value: 85 },
]);
const legendTable = { showLegend: true, displayMode: 'table', placement: 'bottom', calcs: ['mean', 'max', 'lastNotNull'] };

function dashboard(uid, title, tags, panels, extra = {}) {
  return {
    uid,
    title,
    tags,
    editable: true,
    graphTooltip: 0,
    timezone: 'utc',
    time: { from: TIME_FROM, to: TIME_TO },
    timepicker: {},
    refresh: '',
    liveNow: false,
    schemaVersion: 41,
    version: 1,
    templating: { list: [] },
    annotations: { list: [] },
    links: [],
    panels,
    ...extra,
  };
}

function overview() {
  nextId = 1;
  return dashboard('vb-overview', 'Visual baseline - Overview', ['baseline', 'overview'], [
    panel('timeseries', 'CPU, memory and IO wait', { x: 0, y: 0, w: 12, h: 8 }, csv.cpuMem, {
      fieldConfig: {
        defaults: { unit: 'percent', min: 0, max: 100, custom: { lineWidth: 2, fillOpacity: 10, gradientMode: 'opacity' } },
        overrides: [],
      },
      options: { legend: legendTable, tooltip: { mode: 'multi', sort: 'desc' } },
    }),
    panel('stat', 'Requests / 5m', { x: 12, y: 0, w: 4, h: 8 }, csv.requests, {
      fieldConfig: { defaults: { unit: 'short', color: { mode: 'thresholds' }, thresholds: thresholds([{ color: 'blue', value: null }, { color: 'purple', value: 1500 }]) }, overrides: [] },
      options: { reduceOptions: { calcs: ['lastNotNull'], fields: '', values: false }, colorMode: 'background', graphMode: 'area', textMode: 'auto', justifyMode: 'auto', orientation: 'auto' },
    }),
    panel('gauge', 'Disk usage', { x: 16, y: 0, w: 4, h: 8 }, csv.disk, {
      fieldConfig: { defaults: { unit: 'percent', min: 0, max: 100, thresholds: GYR }, overrides: [] },
      options: { reduceOptions: { calcs: ['lastNotNull'], fields: '', values: false }, showThresholdLabels: false, showThresholdMarkers: true },
    }),
    panel('bargauge', 'Service latency', { x: 20, y: 0, w: 4, h: 8 }, csv.services, {
      fieldConfig: { defaults: { unit: 'ms', min: 0, max: 400, thresholds: thresholds([{ color: 'green', value: null }, { color: 'orange', value: 200 }, { color: 'red', value: 300 }]) }, overrides: [] },
      options: { reduceOptions: { calcs: [], fields: '', values: true }, displayMode: 'gradient', orientation: 'horizontal', showUnfilled: true, valueMode: 'color' },
    }),
    panel('barchart', 'Monthly revenue vs costs', { x: 0, y: 8, w: 8, h: 8 }, csv.revenue, {
      fieldConfig: { defaults: { unit: 'currencyUSD', custom: { fillOpacity: 80, lineWidth: 1 } }, overrides: [] },
      options: { orientation: 'auto', xTickLabelRotation: 0, showValue: 'auto', groupWidth: 0.7, barWidth: 0.9, legend: { showLegend: true, displayMode: 'list', placement: 'bottom', calcs: [] }, tooltip: { mode: 'single', sort: 'none' } },
    }),
    panel('piechart', 'Browser share', { x: 8, y: 8, w: 4, h: 8 }, csv.browsers, {
      fieldConfig: { defaults: { unit: 'percent' }, overrides: [] },
      options: { reduceOptions: { calcs: [], fields: '', values: true }, pieType: 'donut', displayLabels: ['percent'], legend: { showLegend: true, displayMode: 'list', placement: 'right', values: [] }, tooltip: { mode: 'single', sort: 'none' } },
    }),
    panel('table', 'Hosts', { x: 12, y: 8, w: 12, h: 8 }, csv.hosts, {
      fieldConfig: {
        defaults: { custom: { align: 'auto', cellOptions: { type: 'auto' } }, thresholds: GYR },
        overrides: [
          { matcher: { id: 'byName', options: 'cpu' }, properties: [{ id: 'unit', value: 'percent' }, { id: 'custom.cellOptions', value: { type: 'color-background', mode: 'gradient' } }] },
          { matcher: { id: 'byName', options: 'mem' }, properties: [{ id: 'unit', value: 'percent' }, { id: 'custom.cellOptions', value: { type: 'gauge', mode: 'basic' } }, { id: 'max', value: 100 }, { id: 'min', value: 0 }] },
        ],
      },
      options: { showHeader: true, cellHeight: 'sm', footer: { show: false, reducer: ['sum'], fields: '' } },
    }),
    panel('heatmap', 'Latency distribution', { x: 0, y: 16, w: 8, h: 8 }, csv.heatmap, {
      options: {
        calculate: false,
        cellGap: 1,
        color: { mode: 'scheme', scheme: 'Oranges', fill: 'dark-orange', scale: 'exponential', exponent: 0.5, steps: 64, reverse: false },
        yAxis: { axisPlacement: 'left', unit: 'ms' },
        legend: { show: true },
        tooltip: { mode: 'single', yHistogram: false },
        rowsFrame: { layout: 'auto' },
        cellValues: {},
        exemplars: { color: 'rgba(255,0,255,0.7)' },
        filterValues: { le: 1e-9 },
        showValue: 'never',
      },
    }),
    panel('logs', 'Application logs', { x: 8, y: 16, w: 8, h: 8 }, csv.logs, {
      options: { showTime: true, showLabels: false, showCommonLabels: false, wrapLogMessage: false, prettifyLogMessage: false, enableLogDetails: true, dedupStrategy: 'none', sortOrder: 'Descending' },
    }),
    panel('text', 'Notes', { x: 16, y: 16, w: 4, h: 8 }, null, {
      datasource: undefined,
      options: {
        mode: 'markdown',
        content:
          '## Visual baseline\n\nThis dashboard is **provisioned** from fixed CSV data.\n\n- Time range: 2024-01-01 00:00-06:00 UTC\n- Seed: `20240101`\n\n> Emotion to StyleX migration reference.\n\n[Link text](https://example.invalid)',
        code: { language: 'plaintext', showLineNumbers: false, showMiniMap: false },
      },
    }),
    panel('state-timeline', 'Service status', { x: 20, y: 16, w: 4, h: 8 }, csv.states, {
      fieldConfig: {
        defaults: {
          color: { mode: 'thresholds' },
          mappings: [{ type: 'value', options: { OK: { color: 'green', index: 0 }, WARN: { color: 'orange', index: 1 }, DOWN: { color: 'red', index: 2 } } }],
          custom: { fillOpacity: 80, lineWidth: 0 },
        },
        overrides: [],
      },
      options: { showValue: 'auto', mergeValues: true, alignValue: 'left', rowHeight: 0.9, legend: { showLegend: true, displayMode: 'list', placement: 'bottom' }, tooltip: { mode: 'single', sort: 'none' } },
    }),
  ]);
}

function variants() {
  nextId = 1;
  return dashboard(
    'vb-variants',
    'Visual baseline - Panel variants',
    ['baseline', 'variants'],
    [
      panel('timeseries', 'Bars with thresholds', { x: 0, y: 0, w: 12, h: 9 }, csv.cpuMem, {
        fieldConfig: {
          defaults: { unit: 'percent', thresholds: GYR, custom: { drawStyle: 'bars', fillOpacity: 60, thresholdsStyle: { mode: 'line+area' } } },
          overrides: [],
        },
        options: { legend: { showLegend: true, displayMode: 'list', placement: 'right', calcs: [] }, tooltip: { mode: 'single', sort: 'none' } },
      }),
      panel('timeseries', 'Stacked area, points', { x: 12, y: 0, w: 12, h: 9 }, csv.cpuMem, {
        fieldConfig: {
          defaults: { unit: 'percent', custom: { stacking: { mode: 'normal', group: 'A' }, fillOpacity: 35, showPoints: 'always', pointSize: 4, lineInterpolation: 'smooth' } },
          overrides: [],
        },
        options: { legend: { showLegend: true, displayMode: 'list', placement: 'bottom', calcs: [] }, tooltip: { mode: 'multi', sort: 'none' } },
      }),
      panel('stat', 'Stat - value only', { x: 0, y: 9, w: 6, h: 6 }, csv.cpuMem, {
        fieldConfig: { defaults: { unit: 'percent', thresholds: GYR, color: { mode: 'thresholds' } }, overrides: [] },
        options: { reduceOptions: { calcs: ['mean'], fields: '', values: false }, colorMode: 'value', graphMode: 'none', textMode: 'value_and_name', justifyMode: 'center', orientation: 'horizontal' },
      }),
      panel('bargauge', 'Bar gauge - LCD', { x: 6, y: 9, w: 6, h: 6 }, csv.services, {
        fieldConfig: { defaults: { unit: 'ms', min: 0, max: 400, thresholds: GYR }, overrides: [] },
        options: { reduceOptions: { calcs: [], fields: '', values: true }, displayMode: 'lcd', orientation: 'vertical', showUnfilled: true },
      }),
      panel('status-history', 'Status history', { x: 12, y: 9, w: 12, h: 6 }, csv.states, {
        fieldConfig: {
          defaults: {
            color: { mode: 'thresholds' },
            mappings: [{ type: 'value', options: { OK: { color: 'green', index: 0 }, WARN: { color: 'yellow', index: 1 }, DOWN: { color: 'red', index: 2 } } }],
            custom: { fillOpacity: 70, lineWidth: 1 },
          },
          overrides: [],
        },
        options: { showValue: 'auto', rowHeight: 0.9, colWidth: 0.9, legend: { showLegend: true, displayMode: 'list', placement: 'bottom' }, tooltip: { mode: 'single', sort: 'none' } },
      }),
      panel('histogram', 'Latency histogram', { x: 0, y: 15, w: 12, h: 8 }, csv.latencySamples, {
        fieldConfig: { defaults: { unit: 'ms', custom: { fillOpacity: 60, lineWidth: 1 } }, overrides: [] },
        options: { bucketCount: 20, combine: false, legend: { showLegend: true, displayMode: 'list', placement: 'bottom', calcs: [] } },
      }),
      panel('table', 'Table - pills, colored text, footer', { x: 12, y: 15, w: 12, h: 8 }, csv.hosts, {
        fieldConfig: {
          defaults: { custom: { align: 'auto', cellOptions: { type: 'auto' }, filterable: true }, thresholds: GYR },
          overrides: [
            { matcher: { id: 'byName', options: 'cpu' }, properties: [{ id: 'unit', value: 'percent' }, { id: 'custom.cellOptions', value: { type: 'color-text' } }] },
            { matcher: { id: 'byName', options: 'status' }, properties: [{ id: 'custom.cellOptions', value: { type: 'pill' } }] },
          ],
        },
        options: { showHeader: true, cellHeight: 'md', footer: { show: true, reducer: ['mean'], fields: '' } },
      }),
    ],
    {
      templating: {
        list: [
          {
            type: 'custom',
            name: 'region',
            label: 'Region',
            query: 'us-east-1,eu-west-1,ap-south-1',
            current: { selected: true, text: ['us-east-1'], value: ['us-east-1'] },
            options: [],
            multi: true,
            includeAll: true,
          },
          {
            type: 'textbox',
            name: 'filter',
            label: 'Filter',
            query: 'web',
            current: { text: 'web', value: 'web' },
          },
        ],
      },
    }
  );
}

function teamDashboard() {
  nextId = 1;
  return dashboard('vb-team-alpha', 'Team Alpha - Service health', ['team-alpha'], [
    panel('stat', 'Uptime', { x: 0, y: 0, w: 8, h: 6 }, csv.disk, {
      fieldConfig: { defaults: { unit: 'percent', decimals: 1 }, overrides: [] },
      options: { reduceOptions: { calcs: ['mean'], fields: '', values: false }, colorMode: 'value', graphMode: 'none' },
    }),
    panel('timeseries', 'Requests', { x: 8, y: 0, w: 16, h: 6 }, csv.requests, {
      options: { legend: { showLegend: false, displayMode: 'list', placement: 'bottom', calcs: [] }, tooltip: { mode: 'single', sort: 'none' } },
    }),
  ]);
}

const files = {
  'Visual Baseline/vb-overview.json': overview(),
  'Visual Baseline/vb-variants.json': variants(),
  'Team Alpha/vb-team-alpha.json': teamDashboard(),
};

fs.rmSync(OUT, { recursive: true, force: true });
for (const [rel, json] of Object.entries(files)) {
  const p = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(json, null, 2) + '\n');
}
console.log(`wrote ${Object.keys(files).length} dashboards to ${OUT} (seed ${SEED})`);
