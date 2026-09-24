import path, { dirname, join } from 'node:path';
import type { StorybookConfig } from '@storybook/react-webpack5';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import remarkGfm from 'remark-gfm';
import type { Configuration } from 'webpack';
import { copyAssetsSync } from './copyAssets';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getStylexWebpackPlugins } = require('../../../scripts/webpack/stylex.js');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const wrapInLayer = require('../../../scripts/webpack/postcss-wrap-in-layer.js');

const coreComponentsGlobs: StorybookConfig['stories'] = [
  // Specific high-level documentation pages
  '../src/Intro.mdx',
  '../src/DesignPrinciples.mdx',
  '../src/VoiceAndTone.mdx',
  '../src/Accessibility.mdx',

  // All the other stories
  '../src/**/*.story.tsx',
];

const alertingComponentsGlobs: StorybookConfig['stories'] = [
  {
    titlePrefix: 'Alerting',
    directory: '../../grafana-alerting/src',
    files: 'Intro.mdx',
  },
  {
    titlePrefix: 'Alerting',
    directory: '../../grafana-alerting/src',
    files: process.env.NODE_ENV === 'production' ? '**/!(*.internal).story.tsx' : '**/*.story.tsx',
  },
];

const stories = [...coreComponentsGlobs, ...alertingComponentsGlobs];

// Copy the assets required by storybook before starting the storybook server.
copyAssetsSync();

const mainConfig: StorybookConfig = {
  stories,
  addons: [
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false,
      },
    },
    getAbsolutePath('@storybook/addon-a11y'),
    {
      name: '@storybook/preset-scss',
      options: {
        styleLoaderOptions: {
          // this is required for theme switching .use() and .unuse()
          injectType: 'lazyStyleTag',
        },
        cssLoaderOptions: {
          url: false,
          importLoaders: 2,
        },
        sassLoaderOptions: {
          sassOptions: {
            // silencing these warnings since we're planning to remove sass when angular is gone
            silenceDeprecations: ['import', 'global-builtin'],
          },
        },
      },
    },
    getAbsolutePath('@storybook/addon-storysource'),
    getAbsolutePath('@storybook/addon-webpack5-compiler-swc'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-webpack5'),
    options: {
      fastRefresh: true,
      builder: {
        fsCache: true,
      },
    },
  },
  logLevel: 'debug',
  staticDirs: ['static', { from: 'images', to: 'images' }],
  typescript: {
    check: true,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      tsconfigPath: path.resolve(__dirname, 'tsconfig.json'),
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
      savePropValueAsString: true,
    },
  },
  swc: () => ({
    jsc: {
      transform: {
        react: {
          runtime: 'automatic',
        },
      },
    },
  }),
  webpackFinal: async (config, { configType }) => {
    configureStylex(config, configType === 'DEVELOPMENT');

    // expose jquery as a global so jquery plugins don't break at runtime.
    config.module?.rules?.push({
      test: require.resolve('jquery'),
      loader: 'expose-loader',
      options: {
        exposes: ['$', 'jQuery'],
      },
    });

    // Tell storybook to resolve imports with the @grafana-app/source condition for
    // the packages in this repo.
    if (config && config.resolve) {
      if (Array.isArray(config.resolve.conditionNames)) {
        config.resolve.conditionNames.unshift('@grafana-app/source');
      } else {
        config.resolve.conditionNames = ['@grafana-app/source', '...'];
      }
    }

    return config;
  },
};
module.exports = mainConfig;

/**
 * Compile StyleX with the same options as the app, and mirror the app's cascade: the layer-order sheet is
 * extracted to a real CSS asset (StyleX appends its rules to it) and the legacy Sass sits in
 * `@layer grafana-legacy`.
 */
function configureStylex(config: Configuration, dev: boolean) {
  const layersCss = path.resolve(__dirname, '../../../public/app/stylex-layers.css');
  const legacySassDir = path.resolve(__dirname, '../../../public/sass') + path.sep;
  const rules = (config.module ??= {}).rules ?? (config.module.rules = []);

  for (const rule of rules) {
    if (!rule || typeof rule !== 'object' || !(rule.test instanceof RegExp)) {
      continue;
    }
    if (rule.test.test('x.css')) {
      rule.exclude = [layersCss, ...(rule.exclude ? [rule.exclude].flat() : [])];
    }
    if (rule.test.test('x.scss') && Array.isArray(rule.use)) {
      const cssLoaderIndex = rule.use.findIndex(
        (use) => typeof use === 'object' && use !== null && String(use.loader).includes('css-loader')
      );
      rule.use.splice(cssLoaderIndex + 1, 0, {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: Object.assign(
            (loaderContext: { resourcePath: string }) => ({
              plugins: loaderContext.resourcePath.startsWith(legacySassDir) ? [wrapInLayer('grafana-legacy')] : [],
            }),
            { config: false }
          ),
        },
      });
    }
  }

  rules.push({ test: layersCss, use: [MiniCssExtractPlugin.loader, require.resolve('css-loader')] });
  (config.plugins ??= []).push(
    new MiniCssExtractPlugin({ filename: 'grafana-stylex.[contenthash].css' }),
    ...getStylexWebpackPlugins({ dev, cssInjectionTarget: (fileName: string) => fileName.includes('grafana-stylex.') })
  );
}

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
