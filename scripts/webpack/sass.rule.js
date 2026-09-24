'use strict';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const wrapInLayer = require('./postcss-wrap-in-layer');

const legacySassDir = path.resolve(__dirname, '../../public/sass') + path.sep;

module.exports = function (options) {
  return {
    test: /\.(sa|sc|c)ss$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: './',
        },
      },
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
  };
};
