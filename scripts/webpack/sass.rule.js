'use strict';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const wrapInLayer = require('./postcss-wrap-in-layer');

const legacySassDir = path.resolve(__dirname, '../../public/sass') + path.sep;
const layersCss = path.resolve(__dirname, '../../public/app/stylex-layers.css');

module.exports = function (options) {
  const extractLoader = {
    loader: MiniCssExtractPlugin.loader,
    options: {
      publicPath: './',
    },
  };

  return {
    test: /\.(sa|sc|c)ss$/,
    oneOf: [
      {
        // Sass's compressed output drops the final `;` of a lone `@layer` statement, which then swallows the
        // next module's first rule once the extracted CSS is concatenated.
        include: layersCss,
        use: [extractLoader, { loader: 'css-loader', options: { importLoaders: 0, url: false } }],
      },
      {
        use: [
          extractLoader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              url: options.preserveUrl,
              sourceMap: options.sourceMap,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: options.sourceMap,
              postcssOptions: Object.assign(
                (loaderContext) => ({
                  // The legacy Sass theme sheets rank below Emotion globals and StyleX.
                  plugins: loaderContext.resourcePath.startsWith(legacySassDir) ? [wrapInLayer('grafana-legacy')] : [],
                }),
                // postcss-loader reads `config` off the options object itself, even when it's a function.
                { config: path.resolve(__dirname) }
              ),
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: options.sourceMap,
              sassOptions: {
                // silencing these warnings since we're planning to remove sass when angular is gone
                silenceDeprecations: ['import', 'global-builtin'],
              },
            },
          },
        ],
      },
    ],
  };
};
