var webpack = require('webpack');

module.exports = {
  entry: './app/app.js',
  output: {
    filename: './bundle.js'
  },
  target: 'node',
  devtool: 'source-map',
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
        test: /\.png/,
        loader: 'url-loader'
      }
    ]
  },
  sassLoader: {
    includePaths: ['app/assets']
  }
};
