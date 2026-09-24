#!/usr/bin/env node
// Deterministic screenshot capture for Grafana app pages, @grafana/ui Storybook stories,
// and interaction states of interactive @grafana/ui components.
//
//   node scripts/capture.mjs --out /tmp/vb-run1 [--suites app,storybook,states] [--themes light,dark]
//        [--grafana http://127.0.0.1:3300] [--storybook http://127.0.0.1:9009]
//        [--only <regex>] [--workers 6] [--repo /workspace] [--allow-env-mismatch]
//
// Output: <out>/app/<theme>/<name>.png
//         <out>/storybook/<theme>/<story-id>.png
//         <out>/storybook-states/<theme>/<story-id>__<state>.png
//         <out>/manifest.json
import { execSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { stateTargets } from './states.mjs';
import { appTargets } from './targets.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const VB_DIR = path.resolve(HERE, '..');
const args = parseArgs(process.argv.slice(2));
const REPO = path.resolve(args.repo || process.env.REPO || '/workspace');
const requireFromRepo = createRequire(path.join(REPO, 'package.json'));
const { chromium } = requireFromRepo('playwright');
const PLAYWRIGHT_VERSION = requireFromRepo('playwright/package.json').version;

// §4.5: baseline and candidate must use the same Playwright/Chromium build.
export const EXPECTED_PLAYWRIGHT = '1.56.1';
export const EXPECTED_CHROMIUM = '141.0.7390.37';

const OUT = path.resolve(args.out || 'vb-capture');
const SUITES = (args.suites || 'app,storybook,states').split(',');
const THEMES = (args.themes || 'light,dark').split(',');
const GRAFANA = (args.grafana || 'http://127.0.0.1:3300').replace(/\/$/, '');
const STORYBOOK = (args.storybook || 'http://127.0.0.1:9009').replace(/\/$/, '');
const ONLY = args.only ? new RegExp(args.only) : null;
const WORKERS = Number(args.workers || 6);
const EXCLUDE_STORIES = JSON.parse(fs.readFileSync(path.join(VB_DIR, 'storybook-excludes.json'), 'utf8'));
const STORY_OVERRIDES = JSON.parse(fs.readFileSync(path.join(VB_DIR, 'storybook-overrides.json'), 'utf8'));
const storyMasks = (storyId) =>
  STORY_OVERRIDES.masks.filter((m) => m.patterns.some((p) => new RegExp(p).test(storyId))).flatMap((m) => m.selectors);

export const VIEWPORT = { width: 1920, height: 1080 };
const DPR = 1;
// App pages boot with the clock pinned at BOOT_TIME (time then advances so debounce and
// timer-driven code still settles). Immediately before the first screenshot the clock
// is frozen at FREEZE_TIME: Date.now() returns that constant for every frame compared.
// Storybook pages have Date fixed at FREEZE_TIME from boot (stories call new Date()).
export const BOOT_TIME = '2024-01-01T06:30:00.000Z';
export const FREEZE_TIME = '2024-01-01T06:31:00.000Z';
const MASK_COLOR = '#FF00FF';
const STABLE_ATTEMPTS = 10;

// LoadingBar is an infinite compositor (will-change: transform) animation. Playwright resets
// it to its initial, fully hidden state, but a stale compositor frame sometimes leaks a
// 1px sliver; with no animation it sits at the same hidden initial transform every time.
const FREEZE_CSS = `
*, *::before, *::after { caret-color: transparent !important; }
html { scroll-behavior: auto !important; }
[role="status"][aria-label$="oading bar"] { animation: none !important; }
`;
const LOADING_SELECTORS = [
  '[data-testid="Spinner"]',
  '[data-testid="icon-spinner"]',
  '[aria-label="Panel loading bar"]',
  '.panel-loading',
  '[data-testid="data-testid Loading indicator"]',
  '.fa-spinner',
].join(',');

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) {
        out[key] = true;
      } else {
        out[key] = next;
        i++;
      }
    }
  }
  return out;
}

function sh(cmd, cwd = REPO) {
  try {
    return execSync(cmd, { cwd, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return 'unknown';
  }
}

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

function environmentFingerprint(browser) {
  const fonts = sh("fc-list --format '%{file}|%{family}|%{style}\\n' | sort");
  const osRelease = sh('. /etc/os-release && echo "$PRETTY_NAME"');
  const harnessFiles = [
    'scripts/capture.mjs',
    'scripts/targets.mjs',
    'scripts/states.mjs',
    'storybook-excludes.json',
    'storybook-overrides.json',
    'conf/custom.ini',
    'provisioning/datasources/datasources.yaml',
    'provisioning/alerting/rules.yaml',
    'scripts/gen-dashboards.mjs',
    'scripts/seed.sh',
  ];
  const harness = harnessFiles.map((f) => sha256(fs.readFileSync(path.join(VB_DIR, f)))).join('');
  return {
    playwright: PLAYWRIGHT_VERSION,
    chromium: browser.version(),
    node: process.version,
    os: `${osRelease} (${os.platform()} ${os.release()} ${os.arch()})`,
    fontsSha256: sha256(fonts),
    fontCount: fonts === 'unknown' ? 0 : fonts.split('\n').length,
    harnessSha256: sha256(harness),
  };
}

function isLocal(url) {
  try {
    const u = new URL(url);
    return ['127.0.0.1', 'localhost'].includes(u.hostname) || u.protocol === 'data:' || u.protocol === 'blob:';
  } catch {
    return true;
  }
}

// Server-generated wall-clock values (user last seen, session times, created/updated)
// differ between runs. They are rewritten to fixed values in API responses instead of
// masked, so the styled regions that display them are still compared pixel-for-pixel.
export const FIXED_SERVER_TIME = '2024-01-01T06:00:00Z';
const FIXED_AGE = '10 minutes';
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
const TIME_KEY = /(At|Timestamp|^created|^updated|^seen|^rotated|^expires|^lastUsed)$/i;

function normalizeTimes(value, key = '') {
  if (Array.isArray(value)) {
    return value.map((v) => normalizeTimes(v));
  }
  if (value && typeof value === 'object') {
    for (const k of Object.keys(value)) {
      value[k] = normalizeTimes(value[k], k);
    }
    return value;
  }
  if (typeof value === 'string') {
    if (/Age$/.test(key) && value !== 'Never') {
      return FIXED_AGE;
    }
    if (TIME_KEY.test(key) && ISO_DATE.test(value) && !value.startsWith('0001-')) {
      return FIXED_SERVER_TIME;
    }
  }
  return value;
}

async function normalizeApiTimes(context) {
  const handler = async (route) => {
    if (route.request().method() !== 'GET') {
      return route.fallback();
    }
    const response = await route.fetch();
    const type = response.headers()['content-type'] || '';
    if (!type.includes('json')) {
      return route.fulfill({ response });
    }
    const json = await response.json().catch(() => undefined);
    if (json === undefined) {
      return route.fulfill({ response });
    }
    return route.fulfill({ response, json: normalizeTimes(json) });
  };
  await context.route((url) => isLocal(url.toString()) && /^\/apis?\//.test(url.pathname), handler);
}

// Math.random is replaced by a PRNG seeded from RANDOM_SEED and the document URL (several
// stories build their data with Math.random). The URL term matters: MSW derives request
// ids from Math.random, and pages sharing its service worker must not produce equal ids.
export const RANDOM_SEED = 20240101;

async function newContext(browser, theme, { hideSplash = false, normalizeTimes: normalize = false, fixedClockFromBoot = false, ...extra } = {}) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DPR,
    timezoneId: 'UTC',
    locale: 'en-US',
    colorScheme: theme,
    reducedMotion: 'reduce',
    extraHTTPHeaders: { 'Accept-Language': 'en-US' },
    ...extra,
  });
  if (fixedClockFromBoot) {
    await context.clock.setFixedTime(new Date(FREEZE_TIME));
  } else {
    await context.clock.install({ time: new Date(BOOT_TIME) });
  }
  await context.addInitScript((seed) => {
    let a = seed;
    const key = location.pathname + location.search;
    for (let i = 0; i < key.length; i++) {
      a = Math.imul(a ^ key.charCodeAt(i), 16777619);
    }
    Math.random = function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }, RANDOM_SEED);
  await context.addInitScript((css) => {
    const add = () => {
      const s = document.createElement('style');
      s.setAttribute('data-visual-baseline', 'freeze');
      s.textContent = css;
      (document.head || document.documentElement).appendChild(s);
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', add);
    } else {
      add();
    }
  }, FREEZE_CSS);
  // Registered first: later routes take precedence, so the stubs below win over it.
  if (normalize) {
    await normalizeApiTimes(context);
  }
  // External network is blocked: grafana.com news/catalog/gravatar must never leak
  // time-varying content into the baseline.
  await context.route(
    (url) => !isLocal(url.toString()),
    (route) => route.abort()
  );
  await context.route('**/api/gnet/**', (route) => {
    const p = new URL(route.request().url()).pathname;
    if (/\/api\/gnet\/plugins\/?$/.test(p)) {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ items: [] }) });
    }
    return route.fulfill({ status: 404, contentType: 'application/json', body: '{"message":"blocked by visual baseline"}' });
  });
  if (hideSplash) {
    // The "what's new" splash modal opens on every page for a fresh user. It is captured
    // once by the `splash-screen` target; everywhere else the `splashScreen` flag is
    // rewritten to false in the OFREP evaluation response.
    await context.route('**/ofrep/v1/evaluate/flags**', async (route) => {
      const response = await route.fetch();
      const json = await response.json().catch(() => null);
      if (json && Array.isArray(json.flags)) {
        for (const f of json.flags) {
          if (f.key === 'splashScreen') {
            f.value = false;
          }
        }
      } else if (json && json.key === 'splashScreen') {
        json.value = false;
      }
      return json ? route.fulfill({ response, json }) : route.fulfill({ response });
    });
  }
  return context;
}

async function settle(page, { timeout = 20000 } = {}) {
  await page.waitForLoadState('networkidle', { timeout }).catch(() => {});
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await page
    .waitForFunction((sel) => !document.querySelector(sel), LOADING_SELECTORS, { timeout, polling: 100 })
    .catch(() => {});
  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready).catch(() => {});
}

async function waitNoLoading(page, timeout) {
  return page
    .waitForFunction((sel) => !document.querySelector(sel), LOADING_SELECTORS, { timeout, polling: 100 })
    .then(() => true)
    .catch(() => false);
}

// Debounced loads start a few hundred ms after mount, so a single "no spinner" check can
// pass right before one begins. Require network idle + no loading indicator to hold
// across a quiet window before the clock is frozen.
async function quiesce(page, { quietMs = 800, timeout = 20000 } = {}) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    if (!(await waitNoLoading(page, Math.max(1000, deadline - Date.now())))) {
      return false;
    }
    await page.waitForTimeout(quietMs);
    const busy = await page.evaluate((sel) => Boolean(document.querySelector(sel)), LOADING_SELECTORS).catch(() => true);
    if (!busy) {
      return true;
    }
  }
  return false;
}

// Wait out late loading indicators, freeze the clock, then screenshot until two
// consecutive frames are byte-identical. The loading wait happens before the freeze
// because debounced fetches never fire while Date.now() is constant.
async function stableShot(page, { mask = [], fullPage = false } = {}) {
  let loadingSettled = await quiesce(page);
  await page.clock.setFixedTime(new Date(FREEZE_TIME));
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  let prev = null;
  for (let attempt = 1; attempt <= STABLE_ATTEMPTS; attempt++) {
    if (loadingSettled) {
      loadingSettled = await waitNoLoading(page, 3000);
    }
    const buf = await page.screenshot({
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
      fullPage,
      mask,
      maskColor: MASK_COLOR,
    });
    if (prev && buf.equals(prev)) {
      const loadingVisible = await page.evaluate((sel) => Boolean(document.querySelector(sel)), LOADING_SELECTORS).catch(() => false);
      return { buf, attempts: attempt, stable: true, ...(loadingVisible ? { loadingVisible } : {}) };
    }
    prev = buf;
    await page.waitForTimeout(attempt < 3 ? 300 : 700);
  }
  return { buf: prev, attempts: STABLE_ATTEMPTS, stable: false };
}

function baseEntry(manifest, fields) {
  return {
    id: `${fields.suite}:${fields.theme}:${fields.name}`,
    ...fields,
    viewport: VIEWPORT,
    dpr: DPR,
    commit: manifest.commit,
  };
}

async function login(browser) {
  const ctx = await browser.newContext();
  const res = await ctx.request.post(`${GRAFANA}/login`, { data: { user: 'admin', password: 'admin' } });
  if (!res.ok()) {
    throw new Error(`login failed: ${res.status()} ${await res.text()}`);
  }
  const statePath = path.join(os.tmpdir(), `vb-storage-${process.pid}.json`);
  await ctx.storageState({ path: statePath });
  await ctx.close();
  return statePath;
}

function withTheme(p, theme) {
  const [base, hash] = p.split('#');
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}theme=${theme}${hash ? `#${hash}` : ''}`;
}

async function captureApp(browser, manifest) {
  const statePath = await login(browser);
  const api = async (p) => {
    const ctx = await browser.newContext({ storageState: statePath });
    const res = await ctx.request.get(`${GRAFANA}${p}`);
    const json = await res.json();
    await ctx.close();
    return json;
  };
  const version = (await api('/api/frontend/settings')).buildInfo.version;
  manifest.grafanaVersion = version;
  const targets = appTargets.filter((t) => !ONLY || ONLY.test(t.name));
  for (const theme of THEMES) {
    const dir = path.join(OUT, 'app', theme);
    fs.mkdirSync(dir, { recursive: true });
    for (const t of targets) {
      const started = Date.now();
      const relPath = typeof t.path === 'function' ? await t.path({ api }) : t.path;
      const url = GRAFANA + withTheme(relPath, theme);
      const context = await newContext(browser, theme, {
        ...(t.auth === false ? {} : { storageState: statePath }),
        hideSplash: !t.splash,
        normalizeTimes: true,
        fixedClockFromBoot: Boolean(t.fixedClock),
      });
      if (t.localStorage) {
        await context.addInitScript((entries) => {
          for (const [k, v] of Object.entries(entries)) {
            window.localStorage.setItem(k, v);
          }
        }, t.localStorage);
      }
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(String(e.message).slice(0, 300)));
      const file = path.join('app', theme, `${t.name}.png`);
      const entry = baseEntry(manifest, { suite: 'app', theme, name: t.name, url: relPath, masks: t.mask || [], file });
      if (t.note) {
        entry.note = t.note;
      }
      try {
        await page.goto(url, { waitUntil: 'load', timeout: 60000 });
        await settle(page);
        if (t.prepare) {
          await t.prepare(page, { api });
          await settle(page);
        }
        const mask = (t.mask || []).map((sel) => page.locator(sel));
        const { buf, ...shot } = await stableShot(page, { mask });
        fs.writeFileSync(path.join(OUT, file), buf);
        Object.assign(entry, shot);
      } catch (e) {
        delete entry.file;
        entry.error = String(e.message || e).slice(0, 500);
      }
      if (errors.length) {
        entry.pageErrors = errors.slice(0, 5);
      }
      manifest.images.push(entry);
      console.log(`[app/${theme}] ${t.name} ${entry.error ? 'ERROR ' + entry.error : `ok (${entry.attempts} shots${entry.stable ? '' : ', UNSTABLE'})`} ${Date.now() - started}ms`);
      await context.close();
    }
  }
}

function storyUrl(id, theme, extra = '') {
  return `/iframe.html?id=${encodeURIComponent(id)}&viewMode=story&globals=theme:${theme}${extra}`;
}

async function loadStory(page, url) {
  await page.goto(STORYBOOK + url, { waitUntil: 'load', timeout: 60000 });
  await page.waitForFunction(() => /sb-show-(main|errordisplay|nopreview)/.test(document.body.className), null, {
    timeout: 30000,
  });
  await settle(page, { timeout: 10000 });
}

// Runs jobs across WORKERS pages (one context per worker), recreating a page after failures.
async function runPool(browser, theme, jobs, fn) {
  const queue = [...jobs];
  if (!queue.length) {
    return;
  }
  const worker = async () => {
    const context = await newContext(browser, theme, { fixedClockFromBoot: true });
    let page = await context.newPage();
    await warmUpServiceWorker(page);
    while (queue.length) {
      const job = queue.shift();
      const errors = [];
      const onErr = (e) => errors.push(String(e.message).slice(0, 300));
      page.on('pageerror', onErr);
      const entry = await fn(page, job).catch((e) => ({ error: String(e.message || e).slice(0, 500), job }));
      page.off('pageerror', onErr);
      if (entry.error) {
        await page.close().catch(() => {});
        page = await context.newPage();
      }
      if (errors.length) {
        entry.pageErrors = errors.slice(0, 3);
      }
      job.done(entry);
    }
    await context.close();
  };
  await Promise.all(Array.from({ length: Math.min(WORKERS, queue.length) }, worker));
}

// Stories mock their data with MSW (a service worker). Until the worker controls the
// context, the first story's requests miss the mocks and retry with a spinner.
async function warmUpServiceWorker(page) {
  await page.goto(`${STORYBOOK}/iframe.html?id=foundations-text--basic&viewMode=story`, { waitUntil: 'load' }).catch(() => {});
  await page
    .waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 30000 })
    .catch(() => {});
  if (!(await page.evaluate(() => Boolean(navigator.serviceWorker?.controller)).catch(() => false))) {
    await page.reload({ waitUntil: 'load' }).catch(() => {});
  }
}

async function storyIndex() {
  const index = await (await fetch(`${STORYBOOK}/index.json`)).json();
  return Object.values(index.entries).filter((e) => e.type === 'story');
}

async function captureStorybook(browser, manifest) {
  const stories = (await storyIndex()).filter((e) => !ONLY || ONLY.test(e.id)).sort((a, b) => a.id.localeCompare(b.id));
  manifest.storybook = { url: STORYBOOK, totalStories: stories.length, excluded: EXCLUDE_STORIES };
  for (const theme of THEMES) {
    fs.mkdirSync(path.join(OUT, 'storybook', theme), { recursive: true });
    let n = 0;
    const jobs = stories
      .filter((s) => !EXCLUDE_STORIES[s.id])
      .map((story) => {
        const file = path.join('storybook', theme, `${story.id}.png`);
        const url = storyUrl(story.id, theme);
        const entry = baseEntry(manifest, { suite: 'storybook', theme, name: story.id, storyId: story.id, title: story.title, story: story.name, url, masks: storyMasks(story.id), file });
        return {
          entry,
          done: (res) => {
            Object.assign(entry, res);
            delete entry.job;
            if (entry.error) {
              delete entry.file;
            }
            manifest.images.push(entry);
            n++;
            if (entry.error || entry.stable === false || n % 50 === 0) {
              console.log(`[storybook/${theme}] ${n}/${stories.length} ${story.id} ${entry.error ? 'ERROR ' + entry.error : entry.stable ? 'ok' : 'UNSTABLE'}`);
            }
          },
        };
      });
    const shoot = async (page, job) => {
      await loadStory(page, job.entry.url);
      const mask = job.entry.masks.map((sel) => page.locator(sel));
      const { buf, ...shot } = await stableShot(page, { fullPage: true, mask });
      fs.writeFileSync(path.join(OUT, job.entry.file), buf);
      const errorDisplay = await page.evaluate(() => document.body.classList.contains('sb-show-errordisplay'));
      return { ...shot, errorDisplay };
    };
    await runPool(browser, theme, jobs, shoot);
  }
}

async function driveState(page, recipe, state) {
  const root = page.locator('#storybook-root');
  const target = root.locator(recipe.sel).first();
  const hoverTarget = recipe.hoverSel ? root.locator(recipe.hoverSel).first() : target;
  await target.waitFor({ state: 'attached', timeout: 10000 });
  switch (state) {
    case 'hover':
      await hoverTarget.hover({ force: true });
      break;
    case 'focus':
      await page.keyboard.press('Tab');
      await target.focus();
      break;
    case 'active':
      await hoverTarget.hover({ force: true });
      await page.mouse.down();
      break;
    case 'open':
      await hoverTarget.click({ force: true });
      if (recipe.openWait) {
        await page.locator(recipe.openWait).filter({ visible: true }).first().waitFor({ state: 'visible', timeout: 10000 });
      }
      // Park the pointer so hover styles on the trigger don't leak into the open capture.
      await page.mouse.move(VIEWPORT.width - 1, VIEWPORT.height - 1);
      break;
    case 'disabled':
      break;
    default:
      throw new Error(`unknown state ${state}`);
  }
  await settle(page, { timeout: 5000 });
}

async function captureStates(browser, manifest) {
  const known = new Set((await storyIndex()).map((s) => s.id));
  const recipes = [];
  for (const recipe of stateTargets) {
    if (!known.has(recipe.story)) {
      manifest.missingStateStories = [...(manifest.missingStateStories || []), recipe.story];
      continue;
    }
    const states = recipe.states.filter((state) => !ONLY || ONLY.test(`${recipe.story}__${state}`));
    if (states.length) {
      recipes.push({ recipe, states });
    }
  }
  for (const theme of THEMES) {
    fs.mkdirSync(path.join(OUT, 'storybook-states', theme), { recursive: true });
    let count = 0;
    // One job per story: its states run sequentially, so two concurrent pages never load
    // the same story URL.
    const jobs = recipes.map(({ recipe, states }) => ({
      recipe,
      states,
      done: (res) => {
        for (const entry of res.entries || []) {
          manifest.images.push(entry);
          count++;
          if (entry.error || entry.stable === false) {
            console.log(`[states/${theme}] ${entry.name} ${entry.error ? 'ERROR ' + entry.error : 'UNSTABLE'}`);
          }
        }
        if (res.error) {
          console.log(`[states/${theme}] ${recipe.story} ERROR ${res.error}`);
        }
      },
    }));
    const shootStates = async (workerPage, job) => {
      const entries = [];
      for (const state of job.states) {
        const name = `${job.recipe.story}__${state}`;
        const file = path.join('storybook-states', theme, `${name}.png`);
        const url = storyUrl(job.recipe.story, theme, state === 'disabled' ? '&args=disabled:!true' : '');
        const selector = job.recipe.hoverSel && ['hover', 'active', 'open'].includes(state) ? job.recipe.hoverSel : job.recipe.sel;
        const entry = baseEntry(manifest, { suite: 'storybook-states', theme, name, storyId: job.recipe.story, state, selector, url, masks: storyMasks(job.recipe.story), file });
        // A new page resets pointer position/buttons left behind by the previous state.
        const page = await workerPage.context().newPage();
        const errors = [];
        page.on('pageerror', (e) => errors.push(String(e.message).slice(0, 300)));
        try {
          await loadStory(page, url);
          await driveState(page, job.recipe, state);
          const { buf, ...shot } = await stableShot(page, { fullPage: true, mask: entry.masks.map((sel) => page.locator(sel)) });
          fs.writeFileSync(path.join(OUT, file), buf);
          Object.assign(entry, shot);
        } catch (e) {
          delete entry.file;
          entry.error = String(e.message || e).slice(0, 500);
        } finally {
          if (state === 'active') {
            await page.mouse.up().catch(() => {});
          }
          await page.close().catch(() => {});
        }
        if (errors.length) {
          entry.pageErrors = errors.slice(0, 3);
        }
        entries.push(entry);
      }
      return { entries };
    };
    await runPool(browser, theme, jobs, shootStates);
    console.log(`[states/${theme}] ${count} captures`);
  }
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({
    // --disable-partial-raster: partial raster reuses previously rasterized tile content,
    // which makes icon/logo anti-aliasing depend on paint history (non-deterministic).
    args: [
      '--force-color-profile=srgb',
      '--font-render-hinting=none',
      '--disable-lcd-text',
      '--disable-gpu',
      '--disable-partial-raster',
      '--num-raster-threads=1',
    ],
  });
  const env = environmentFingerprint(browser);
  if ((env.playwright !== EXPECTED_PLAYWRIGHT || env.chromium !== EXPECTED_CHROMIUM) && !args['allow-env-mismatch']) {
    await browser.close();
    throw new Error(
      `Playwright ${env.playwright} / Chromium ${env.chromium} does not match pinned ${EXPECTED_PLAYWRIGHT} / ${EXPECTED_CHROMIUM}. ` +
        'Install the pinned version or pass --allow-env-mismatch (results are then not comparable with the baseline).'
    );
  }
  const manifest = {
    commit: sh('git rev-parse HEAD'),
    capturedAt: new Date().toISOString(),
    environment: env,
    viewport: VIEWPORT,
    dpr: DPR,
    timezone: 'UTC',
    locale: 'en-US',
    reducedMotion: 'reduce',
    clock: { app: `installed at ${BOOT_TIME}, frozen at ${FREEZE_TIME} before the first screenshot`, storybook: `fixed at ${FREEZE_TIME} from boot` },
    randomSeed: RANDOM_SEED,
    storybookOverrides: STORY_OVERRIDES,
    chromiumArgs: ['--force-color-profile=srgb', '--font-render-hinting=none', '--disable-lcd-text', '--disable-gpu', '--disable-partial-raster', '--num-raster-threads=1'],
    screenshot: { animations: 'disabled', caret: 'hide', scale: 'css', fontsReady: true, stableFramesRequired: 2, maskColor: MASK_COLOR },
    themes: THEMES,
    grafanaUrl: GRAFANA,
    dataSetup: {
      datasource: 'grafana-testdata-datasource uid=vb-testdata (csv_content / csv_metric_values only, no random scenarios)',
      dashboards: 'provisioning/dashboards/json/** generated by scripts/gen-dashboards.mjs (seed 20240101)',
      timeRange: '2024-01-01T00:00:00Z -> 2024-01-01T06:00:00Z (absolute, UTC)',
      alerting: 'provisioning/alerting/rules.yaml (paused rules, execute_alerts=false)',
      seed: 'scripts/seed.sh (users alice/bob/carol, org "Baseline Org Two", teams Platform/Checkout)',
      server: 'fresh SQLite DB per run via scripts/start-grafana.sh, conf/custom.ini',
      network: 'all non-localhost requests aborted; /api/gnet/* stubbed with an empty catalog',
      responseRewrites: [
        `GET /api/** and /apis/** JSON: ISO timestamps in *At/*Timestamp/created/updated/seen/rotated/expires/lastUsed keys -> ${FIXED_SERVER_TIME}, *Age strings -> "${FIXED_AGE}" (except "Never")`,
        'POST .../ofrep/v1/evaluate/flags: splashScreen -> false for every target except app:*:splash-screen',
      ],
    },
    images: [],
  };
  try {
    if (SUITES.includes('app')) {
      await captureApp(browser, manifest);
    }
    if (SUITES.includes('storybook')) {
      await captureStorybook(browser, manifest);
    }
    if (SUITES.includes('states')) {
      await captureStates(browser, manifest);
    }
  } finally {
    await browser.close();
  }
  manifest.images.sort((a, b) => a.id.localeCompare(b.id));
  const summary = {};
  for (const img of manifest.images) {
    const k = `${img.suite}/${img.theme}`;
    summary[k] = summary[k] || { ok: 0, errors: 0, unstable: 0 };
    if (img.error) {
      summary[k].errors++;
    } else {
      summary[k].ok++;
      if (!img.stable) {
        summary[k].unstable++;
      }
    }
  }
  manifest.summary = summary;
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
