// var express = require("express");
// 
// var webpack = require("webpack");
'use strict';

import * as express from "express";
const {resolve}       = require("path");

var webpackDevMiddleware = require("webpack-dev-middleware");
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpack = require("webpack");

// https://www.npmjs.com/package/@types/node 
// use this url to resolve require usage in node
var webpackConfig = require("../../webpackConfigs/webpack.dev.config");

var app = express();
var compiler = webpack(webpackConfig);


//app.use(app.Router());

app.use(webpackDevMiddleware(compiler, {
          // publicPath is required, whereas all other options are optional

          noInfo: false,
          // display no info to console (only warnings and errors)

          quiet: false,
          // display nothing to the console

          lazy: true,
          // switch into lazy mode
          // that means no watching, but recompilation on every request

          watchOptions: {
            aggregateTimeout: 300,
            poll: true
          },
          // watch options (only lazy: false)

          publicPath: webpackConfig.output.publicPath,
          // public path to bind the middleware to
          // use the same as in webpack
          
          index: "/index.html",
          // the index path for web server

          headers: { "X-Custom-Header": "yes" },
          // custom headers

          stats: {
            colors: true
          },
          // options for formating the statistics

          reporter: null,
          // Provide a custom reporter to change the way how logs are shown.

          serverSideRender: false,
          // Turn off the server-side rendering mode. See Server-Side Rendering part for more info.
}));

app.use(webpackHotMiddleware(compiler, {
    log: console.log
}));

app.use(express.static(webpackConfig.output.path));

app.listen(3000, function () {
  console.log("Listening on port 3000!");
});