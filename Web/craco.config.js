const CracoLessPlugin = require('craco-less');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  webpack: {
    /**
     * @param {import('webpack').Configuration} config
     * @param {{ env: string }} param
     */
    configure(config, { env }) {
      config.plugins.push(
        new webpack.DefinePlugin({
          __DEV__: env === 'development',
        })
      );
      return config;
    },
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  devServer: {
    open: 'http://localhost:3000/rtc/solution/vertcroom',
    client: {
      overlay: {
        errors: false,
        warnings: false,
        runtimeErrors: false,
      },
    },
  },
};
