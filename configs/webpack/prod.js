// production config
const merge = require('webpack-merge');
const {resolve} = require('path');

const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  entry: './index.js',
  devtool: 'source-map',
  plugins: [],
});
