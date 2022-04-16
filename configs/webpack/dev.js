// development config
const { merge } = require('webpack-merge');
const commonConfig = require('./common');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = merge(commonConfig, {
  mode: 'development',
  entry: [
    'webpack-dev-server/client?http://localhost:8080', // bundle the client for webpack-dev-server and connect to the provided endpoint
    'webpack/hot/only-dev-server', // bundle the client for hot reloading, only- means to only hot reload for successful updates
    './index.js', // the entry point of our app
  ],
  resolve: {
    alias: {
      // 'react-dom': '@hot-loader/react-dom',
    },
  },
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
