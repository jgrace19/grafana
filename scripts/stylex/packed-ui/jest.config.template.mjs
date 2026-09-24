// Written to the scratch project by run.sh (__REPO__ / __WORK__ are substituted).
// The create-plugin Jest setup (SWC, ESM allowlist) with no StyleX Babel plugin and no @grafana-app/source condition.
import { grafanaESModules, nodeModulesToTransform } from '__REPO__/packages/grafana-plugin-configs/jest/utils.js';

export default {
  rootDir: '__WORK__/app',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/*.test.js'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      '__REPO__/node_modules/@swc/jest',
      { jsc: { parser: { syntax: 'typescript', tsx: true }, transform: { react: { runtime: 'automatic' } } } },
    ],
  },
  transformIgnorePatterns: [nodeModulesToTransform(grafanaESModules)],
  moduleDirectories: ['node_modules', '__REPO__/node_modules'],
  moduleNameMapper: {
    '\\.css$': '__REPO__/public/test/mocks/style.ts',
    'react-inlinesvg': '__REPO__/public/test/mocks/react-inlinesvg.tsx',
  },
  setupFiles: ['__REPO__/node_modules/jest-canvas-mock', '__REPO__/scripts/stylex/packed-ui/jest-setup.js'],
};
