'use strict';
/* eslint-disable no-var */

var express = require('express'),
    webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware');

var app = express();

var compiler = webpack({
  entry: {
    app: ['./spec/index.js']
  },
  module: require('../webpack.config').module,
  output: {
    path: '/',
    filename: 'spec-bundle.js'
  }
});

app.get('/', function (req, res) {
  res.set('Content-Type', 'text/html');
  res.sendFile(__dirname + '/index.html');
});

app.use(webpackDevMiddleware(compiler, {
  // quiet: false,
  // noInfo: false,
  lazy: true,
  // filename: 'bundle.js',
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  }//,
  // publicPath: '/'
}));

var server = app.listen(4000, function () {
  console.log('Running at localhost 4000.');
});
