const path = require('path');
const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base');

const devConfig = {
  mode: 'production',
  entry: path.resolve(__dirname, '../src/preload/preload.ts'),
  target: 'electron-main',
  output: {
    filename: 'preload.js',
    path: path.resolve(__dirname, '../dist'),
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.node$/,
        loader: 'native-ext-loader',
        options: {
          emit: false,
          basePath: ['@volcengine/vertc-electron-sdk/build/Release'],
        },
      },
    ],
  },
};

module.exports = webpackMerge.merge(baseConfig, devConfig);
