var webpack = require('webpack');
var fs = require('fs');
var path = require('path');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

fs.readdirSync('app/node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: './src/app.js',
  output: {
    filename: './app/bundle.js'
  },
  target: 'electron',
  devtool: 'source-map',
  resolve: {
    root: [
      path.resolve('./app/node_modules')
    ]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      },
      {
        test: /\.png|\.gif|\.woff/,
        loader: 'url-loader'
      }
    ]
  },
  sassLoader: {
    includePaths: ['src/assets']
  },
  externals: [nodeModules]
};
