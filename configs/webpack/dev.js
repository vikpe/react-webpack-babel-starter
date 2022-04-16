// development config
const { merge } = require('webpack-merge');
const commonConfig = require('./common');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = merge(commonConfig, {
  mode: 'development',
  devServer: {
    hot: true, // enable HMR on the server
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    new ReactRefreshWebpackPlugin(),
  ],
  externals: {
    react: 'React',
  },
});
