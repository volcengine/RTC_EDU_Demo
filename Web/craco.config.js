const CracoLessPlugin = require('craco-less');
const path = require('path');

module.exports = {
  webpack: {
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
    client: {
      overlay: {
        errors: false,
        warnings: false,
        runtimeErrors: false,
      },
    },
  },
};
