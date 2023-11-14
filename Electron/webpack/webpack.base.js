const path = require('path');
module.exports = {
  node: {
    __dirname: false,
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
    alias: {
      '@': path.join(__dirname, '../', 'src/'),
      '@src': path.join(__dirname, '../', 'src/renderer'),
      '@assets': path.join(__dirname, '../', 'assets/'),
      '@common': path.join(__dirname, '../', 'src/renderer/common'),
      '@types': path.join(__dirname, '../', 'src/types'),
      '@config': path.join(__dirname, '../', 'src/config'),
      '@utils': path.join(__dirname, '../', 'src/renderer/utils'),
      '@theme': path.join(__dirname, '../', 'src/renderer/theme'),
      '@components': path.join(__dirname, '../', 'src/renderer/components'),
      '@hooks': path.join(__dirname, '../', 'src/renderer/hooks'),
      '@lib': path.join(__dirname, '../', 'src/renderer/lib'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|jsx|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(jpg|png|jpeg|gif|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name]_[hash].[ext]',
          },
        },
      },
    ],
  },
  // plugins: [new CleanWebpackPlugin()],
};
